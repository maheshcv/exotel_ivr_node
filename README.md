# exotel_ivr_node
Node.js implementation of async IVR class for eXotel. For latest Node.js usage - await syntax.

Initialization:<br/>
const exotelIVR = new ExotelIvr(nconf.get('IVR_SID'), nconf.get('IVR_TOKEN'), nconf.get('IVR_APP_ID'));<br/>

The below is the example how to use it (in a async function):<br/>
(async() => {<br/>
	var call_flow = {<br/>
		'from' :      , //Mandatory<br/>
		'to' :        , //Mandatory of Agent<br/>
		'caller_id' : '<Provide your IVR number', //Mandatory<br/>
		'time_limit' : '',<br/>
		'time_out' :   '',<br/>
		'status_callback' : ''<br/>
	}<br/>
	await exotelIVR.call_number(call_flow);<br/>
})();



Similarly, other class methods can be used for sending SMS, etc.
