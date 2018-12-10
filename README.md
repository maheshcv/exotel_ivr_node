# exotel_ivr_node
Node.js implementation of IVR class for eXotel

The below is the example how to use it (in a async function):
var call_flow = {
			'from' :      , //Mandatory
			'to' :        , //Mandatory of Agent
			'caller_id' : '<Provide your IVR number', //Mandatory
			'time_limit' : '',
			'time_out' :   '',
			'status_callback' : ''
}
await exotelIVR.call_number(call_flow);


Similaryly, other class methods can be used for sending SMS, etc.
