// car.js
const mqtt = require('mqtt');
const MQTT_ADDR = "mqtt://broker.mqttdashboard.com";

const client = mqtt.connect('mqtt://broker.hivemq.com',{
 will: {
   topic: 'car/connected',
   payload: 'false'
 }
});
var options={retain:false, qos:1};
var state = 'nothing';

client.on('connect', function() {
 client.subscribe('car/data');

 // Inform controllers that garage is connected
 client.publish('car/connected', 'true',options);
 sendStateUpdate();
});

client.on('message', function(topic, message) {
 switch (topic) {
   case 'car/data':
       state = "inMouvement";
     return handleDataRequest(message);
 }
});

function sendStateUpdate () {
 console.log('sending state %s', state);
 client.publish('car/state', state, options);
}

function handleDataRequest (message) {
 if (state !== 'nothing') {
     var data = JSON.parse(message)
    console.log(data);
     sendStateUpdate();
 }
}

/**
* Want to notify controller that car is disconnected before shutting down
*/
function handleAppExit (options, err) {
 if (err) {
   console.log(err.stack);
 }

 if (options.cleanup) {
   client.publish('car/connected', 'false');
 }

 if (options.exit) {
   process.exit();
 }
}

/**
* Handle the different ways an application can shutdown
*/
process.on('exit', handleAppExit.bind(null, {
 cleanup: true
}));
process.on('SIGINT', handleAppExit.bind(null, {
 exit: true
}));
process.on('uncaughtException', handleAppExit.bind(null, {
 exit: true
}));




