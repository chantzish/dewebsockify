#!/usr/bin/env node
var net = require('net');
var WebSocket = require('ws');

var net = require('net');

if(process.argv.length < 4) {
	console.log("Usage: dewebsockify ws://someserver/path <port>");
  process.exit(1);
}
var port = process.argv[3];

var server = net.createServer(function(socket) {
  var ws = new WebSocket(process.argv[2], {
    rejectUnauthorized: false
  });

  socket.on('error', function(err) {
    ws.close();
    socket.destroy();
  });

  ws.on('error', function(err) {
    console.log("Connection from", socket.myaddress ,"to end-point...", err.toString());
    socket.destroy();
  });

  ws.on('open', function() {
    socket.myaddress = socket.address().address;
    console.log("Connection from", socket.myaddress ,"accepted");
    socket.on('data', function(data) {
      try {
        ws.send(data);
      } catch(e) {
        console.log("[Error: Uh oh!]");
        ws.close();
        socket.destroy();
      }
    });
  });

  ws.on('message', function(data, flags) {
    socket.write(data);
  });

  socket.on('end', function() {
    console.log("Connection from", socket.myaddress ,"ended");
    ws.removeAllListeners('close');
    ws.close();
  });

  ws.on('close', function() {
    console.log("Web socket server has closed connection, closing socket to", socket.myaddress);
    socket.destroy();
  });

}).listen(port);
