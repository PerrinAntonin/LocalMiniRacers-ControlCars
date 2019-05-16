// controller.js
const mqtt = require('mqtt');
const MQTT_ADDR = "mqtt://broker.mqttdashboard.com";

const client = mqtt.connect('mqtt://broker.hivemq.com',{
 will: {
   topic: 'car/connected',
   payload: 'false'
 }
});

var options={ retain:false, qos:1};
var connected = false;

client.on('connect', function() {
 client.subscribe('car/connected');
 client.subscribe('car/state');

});

client.on('message', function(topic, message, packet) {
 switch (topic) {
   case 'car/connected':
      return handleCarConnected(message);
   case 'car/state':
      return handleCarState(message);
 }
 console.log('No handler for topic %s', topic);
});

client.on("error",function(error){
 console.log("Can't connect" + error);
 process.exit(1)});

function handleCarConnected (message) {
 console.log('car connected status %s', message);
 connected = (message.toString() === 'true');
 run();
}

function handleCarState (message) {
   console.log('car state update to %s', message)
}

function carSendData () {
 if (connected) {
   // Ask the car to go ahead
     var message = '{"rotation":"30","acceleration":"10"}';

     client.publish('car/data', message, options);
 }
}

// simulate car mouvement
function run() {
   if(connected){
       setTimeout(function() {
           carSendData();
           console.log('Instruction move data');
       }, 5000);
   }
}