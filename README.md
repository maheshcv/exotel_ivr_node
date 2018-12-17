# exotel_ivr_node
Node.js implementation of async IVR class for eXotel. For latest Node.js usage - await syntax.

Initialization:
const exotelIVR = new ExotelIvr(nconf.get('IVR_SID'), nconf.get('IVR_TOKEN'), nconf.get('IVR_APP_ID'));

The below is the example how to use it (in a async function):
(async() => {
	var call_flow = {
		'from' :      , //Mandatory
		'to' :        , //Mandatory of Agent
		'caller_id' : '<Provide your IVR number', //Mandatory
		'time_limit' : '',
		'time_out' :   '',
		'status_callback' : ''
	}
	await exotelIVR.call_number(call_flow);
})();



Similarly, other class methods can be used for sending SMS, etc.
