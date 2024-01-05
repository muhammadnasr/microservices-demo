const WebSocket = require('ws');
const mqtt = require('mqtt')
const mqttBrokerServiceName = process.env.MQTT_BROKER_SERVICE_NAME;
const webSocketPort = process.env.WEB_SOCKET_PORT;
const imageTopic = process.env.MQTT_IMAGE_TOPIC;
const mqttClient = mqtt.connect(`mqtt://${mqttBrokerServiceName}`)

let clients = [];

mqttClient.subscribe(imageTopic);

mqttClient.on('connect', () => {
  console.info('Image Dispatcher is Connected to MQTT Broker')

  //TODO: use socket.io instead of websockets
  const webSocketServer = new WebSocket.Server({port:webSocketPort});

  webSocketServer.on('connection', (ws) => {
    clients.push(ws);
    ws.on('close', () => {
      clients = clients.filter(client => client !== ws);
    });
  });
})

//handle mqtt errors
mqttClient.on('error', (err) => {
  console.error(err);
})

// MQTT message handling
mqttClient.on('message', (receivedTopic, message) => {
  if (receivedTopic === imageTopic) {
    // Forward MQTT message (image) to connected WebSocket clients
    clients.forEach(client => client.send(message.toString()));
  }
});