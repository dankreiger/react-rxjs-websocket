const WebSocketServer = require('websocket').server;
const http = require('http');

console.log('Server starting');
const httpServer = http.createServer(function(request, response) {
  // we need an http server to bind and open port for websocket server
});
httpServer.listen(3030, function() {});

//WEB SOCKET SERVER
const connections = [];
const webSocketServer = new WebSocketServer({ httpServer });
webSocketServer.on('request', function(request) {
  let connection = request.accept(null, request.origin);
  let connectionIndex = connections.push(connection);
  console.log('Connection accepted: ', connectionIndex);

  connection.on('message', function(message) {
    console.log('Received message', JSON.stringify(message.utf8Data));
    connections.forEach(conn => conn.sendUTF(JSON.stringify(message.utf8Data)));
  });

  connection.on('close', function(connection) {
    console.log('Connection closed: ', connectionIndex);
  });
});
console.log('Server started');
