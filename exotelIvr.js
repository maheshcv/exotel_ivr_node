// Author: Mahesha Cukkemane, IOP Technologies LLP. 
// See license in respository

const fetch = require('node-fetch');
//var xml_parser = require('fast-xml-parser');

const EXOTEL_API_URL = 'api.exotel.com/v1/Accounts/';

class ExotelIvr {

    constructor(sid, token, appId) {
        this.sid = sid;
        this.token = token;
		this.appId = appId;
        this.url = 'https://'+this.sid+':'+this.token+'@'+EXOTEL_API_URL+this.sid+'/';
    }
    /**
     * First dials the 'from' number and when received, dials the 'to' number and connects them
     * 'caller_id' number is shown to both the numbers.
     *
     * details {
     * 'from' : , //Mandatory
     * 'to' : , //Mandatory
     * 'caller_id' : , //Mandatory
     * 'time_limit' : ,
     * 'time_out' : ,
     * 'status_callback' : ,
     * }
     */
    async call_number(details)
    {
        if (!(details.from) || !(details.to) || !(details.caller_id)) {
            console.log('Insufficient arguments.');
        }
		console.log('Call connecting From mobile number:'+details.from);
		
		var params = '?From='+details.from+'&To='+details.to+'&CallerId='+details.caller_id;
		var url = this.url+'Calls/connect.json'+params;
		try {
			let res = await fetch(url, { method: 'post' });
			console.log('Response Status:'+res.status);
			let response = await res.json();
			console.log('Json Response:')
			console.log(response);
			if (res.status == 200) {
				console.log('Success');
			} else if (res.status == 429) {
				console.log('RateLimitExceededException');
			} else {
				console.log(response.RestException.Message);
			}
			return response;
		} catch(error) {
			console.log(error);
			return error;
		}
		
    }
    /**
     * First dials the 'to' number and when received, connects the call to the 'app_id' flow mentioned
     * 'caller_id' number is shown to the 'to' number user.
     *
     * details {
     * 'from' : , //Mandatory
     * 'app_id' : , //Mandatory
     * 'caller_id' : , //Mandatory
     * 'time_limit' : ,
     * 'time_out' : ,
     * 'status_callback' : ,
     * 'custom_field' : ,
     * }
     */
    async call_flow(details)
    {
        if (!(details.from) || !(details.app_id) || !(details.caller_id)) {
            console.log('Insufficient arguments.');
        }
		
		var params = '?From='+details.from+'&CallerId='+details.caller_id+'&Url=http://my.exotel.com/'+this.sid+'/exoml/start_voice/'+this.app_id;
		var url = this.url+'Calls/connect.json'+params;
		try {
			let res = await fetch(url, { method: 'post' });
			console.log('Response Status:'+res.status);
			let response = await res.json();
			console.log('Json Response:')
			console.log(response);
			if (res.status == 200) {
				console.log('Success');
			} else if (res.status == 429) {
				console.log('RateLimitExceededException');
			} else {
				console.log(response.RestException.Message);
			}
			return response;
		} catch(error) {
			console.log(error);
			return error;
		}
		
    }
	/**
     * Get the details of a Call identified by 'call_sid'.
     */
    async call_details(call_sid)
    {
        if (!(call_sid)) {
            console.log('call details: Insufficient Parameter');
        }
		var url = this.url+'Calls/'+call_sid+'.json';
		try {
			let res = await fetch(url, { method: 'get' });
			console.log('Response Status:'+res.status);
			let response = await res.json();
			console.log('Json Response:')
			console.log(response);
			if (res.status == 200) {
				console.log('Success');
			} else if (res.status == 429) {
				console.log('RateLimitExceededException');
			} else {
				console.log(response.RestException.Message);
			}
			return response;
		} catch(error) {
			console.log(error);
			return error;
		}
		
    }
    /**
     * Sends an SMS to the 'to' number with 'body' as message body and 'priority'.
     *
     * details {
     * 'from' : , //Mandatory
     * 'to' : , //Mandatory
     * 'msg' : , //Mandatory
     * 'priority' : ,
     * 'status_callback' : ,
     * }
     */
    async send_sms(details)
    {
		console.log(details);
		if (!(details.from) || !(details.to) || !(details.msg)) {
            console.log('Insufficient arguments.');
        }
		console.log('Sending SMS to: '+details.to);
		// Check if number whitelisted
		var whitelist = await this.dnd_check_whitelist(details.to);
		if (!(whitelist)) {
			console.log('Number is in DND')
			//TODO: Handle DND cases
		}
		
		
		var params = '?From='+details.from+'&To='+details.to+'&Body='+details.msg;
		var url = this.url+'Sms/send.json'+params;
		try {
			let res = await fetch(url, { method: 'post' });
			console.log('Response Status:'+res.status);
			let response = await res.json();
			console.log('Json Response:')
			console.log(response);
			if (res.status == 200) {
				console.log('Success');
			} else if (res.status == 429) {
				console.log('RateLimitExceededException');
			} else {
				console.log(response.RestException.Message);
			}
			return response;
		} catch(error) {
			console.log(error);
			return error;
		}
		
    }
    /**
     * Get the details of an SMS identified by 'sms_sid'.
     *
     */
    async sms_details(sms_sid)
    {
        if (!(sms_sid)) {
            console.log('sms_details: Insufficient Parameter');
        }
		
		var url = this.url+'Sms/Messages'+sms_sid+'.json';
		try {
			let res = await fetch(url, { method: 'get' });
			console.log('Response Status:'+res.status);
			let response = await res.json();
			console.log('Json Response:')
			console.log(response);
			if (res.status == 200) {
				console.log('Success');
			} else if (res.status == 429) {
				console.log('RateLimitExceededException');
			} else {
				console.log(response.RestException.Message);
			}
			return response;
		} catch(error) {
			console.log(error);
			return error;
		}
		
    }
    /**
     * Add a list of DND numbers.
     *
     */
    async dnd_add_whitelist(details)
    {
        if (!(details.vritualNumber) || !(details.numbers)) {
            console.log('Insufficient arguments.');
        }
		
		
		var params = '?VirtualNumber='+details.virtualNumber+'&Number='+details.numbers;
		var url = this.url+'CustomerWhitelist.json'+params;
		try {
			let res = await fetch(url, { method: 'post' });
			console.log('Response Status:'+res.status);
			let response = await res.json();
			console.log('Json Response:')
			console.log(response);
			if (res.status == 200) {
				console.log('Success');
				return response.Result.Succeeded;
			} else if (res.status == 429) {
				console.log('RateLimitExceededException');
			} else {
				console.log(response.RestException.Message);
			}
			return response;
		} catch(error) {
			console.log(error);
			return error;
		}
		
    }
	/**
     * Delete a list of DND numbers.
     *
     */
    async dnd_delete_whitelist(details)
    {
        if (!(details.numbers)) {
            console.log('Insufficient arguments.');
        }
		
		var params = '?Number='+details.numbers; // List of numbers to be added comma seperated
		var url = this.url+'CustomerWhitelist.json'+params;
		try {
			let res = await fetch(url, { method: 'delete' });
			console.log('Response Status:'+res.status);
			let response = await res.json();
			console.log('Json Response:')
			console.log(response);
			if (res.status == 200) {
				console.log('Success');
				return response.Result.Succeeded;
			} else if (res.status == 429) {
				console.log('RateLimitExceededException');
			} else {
				console.log(response.RestException.Message);
			}
			return response;
		} catch(error) {
			console.log(error);
			return error;
		}
		
    }
	/**
     * Check if number is whitelisted.
     *
     */
    async dnd_check_whitelist(number, callback)
    {
        if (!(number)) {
            console.log('Insufficient arguments.');
        }
		var url = this.url+'CustomerWhitelist/'+number+'.json';
		try {
			let res = await fetch(url, { method: 'get' });
			console.log('Response Status:'+res.status);
			let response = await res.json();
			console.log('Json Response:')
			console.log(response);
			if (res.status == 200) {
				console.log('Success');
				var dnd = (response.Result.Status == 'Whitelist');
				return dnd;
			} else if (res.status == 429) {
				console.log('RateLimitExceededException');
			} else {
				console.log(response.RestException.Message);
			}
			return false;
		} catch(error) {
			console.log(error);
			return error;
		}
		
		
		//if (xml_parser.validate(body) === true) {
		//	var json_resp = xml_parser(body);
		//	return (json_resp.Status == 'Whitelist');
		//} else {
		//	return body; // XML
		//}
		
    }
	/**
     * Check number telecom circle details.
     *
     */
    async telecom_circle_check(number)
    {
        if (!(number)) {
            console.log('Insufficient arguments.');
        }
		
		var url = this.url+'Numbers/'+number+'.json';
		try {
			let res = await fetch(url, { method: 'get' });
			console.log('Response Status:'+res.status);
			let response = await res.json();
			console.log('Json Response:')
			console.log(response);
			if (res.status == 200) {
				console.log('Success');
			} else if (res.status == 429) {
				console.log('RateLimitExceededException');
			} else {
				console.log(response.RestException.Message);
			}
			return response;
		} catch(error) {
			console.log(error);
			return error;
		}
		
		/* Response:
		* {
		*  "Numbers": {
		*	"PhoneNumber": "0XXXXX30240",
		*	"Circle": "GJ",
		*	"CircleName": "Gujarat Telecom Circle (includes Daman & Diu, Dadra & Nagar Haveli)",
		*	"Type": "Mobile",
		*	"Operator": "R",
		*	"OperatorName": "Reliance",
		*	"DND": "Yes"
		*  }
		* }
		*/
		
    }
	/**
     * Get exophone details for all numbers associated.
     *
     */
    async get_exophone_details()
    {
        var url = this.url+'IncomingPhoneNumbers/';
		try {
			let res = await fetch(url, { method: 'get' });
			console.log('Response Status:'+res.status);
			let response = await res.json();
			console.log('Json Response:')
			console.log(response);
			if (res.status == 200) {
				console.log('Success');
			} else if (res.status == 429) {
				console.log('RateLimitExceededException');
			} else {
				console.log(response.RestException.Message);
			}
			return response;
		} catch(error) {
			console.log(error);
			return error;
		}
		
    }
}

exports.ExotelIvr = ExotelIvr;