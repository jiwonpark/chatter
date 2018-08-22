// https://stackoverflow.com/a/35523939/396431

var mqtt = require('mqtt');

var MQTT_TOPIC          = "/seoul-iot/mqtt/test";
var MQTT_ADDR           = "mqtt://MQTTBroker2.us-west-1.elasticbeanstalk.com";
var MQTT_PORT           = 1883;

const clientId = 'test-client-' + (Math.random() * 10000).toFixed();

var client  = mqtt.connect(MQTT_ADDR, {
    clientId: clientId,
    protocolId: 'MQIsdp',
    protocolVersion: 3,
    connectTimeout:1000,
    debug:true
});

var readline = require('readline');

client.on('connect', function () {
    console.log(`Connected to ${MQTT_ADDR} ${clientId}!`);
    console.log(`Subscribing to ${MQTT_TOPIC}`);
    client.subscribe(MQTT_TOPIC);

    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        terminal: false
    });

    rl.on('line', function(line){
        client.publish(MQTT_TOPIC, line);
    });
});

client.on('message', function (topic, message) {
    console.log(`'${message.toString()}' received for topic '${topic}'`);
});

client.on('error', function(){
    console.log("ERROR")
})
