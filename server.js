var http = require('http');
var express = require('express');
var socket_io = require('socket.io');

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

var players = [];

io.on('connection', function (socket) {
    console.log('Client connected');
    players.push(socket.id);
    console.log(players);
    var first = players[0];
    
    //show start button to first connected socket
    socket.on('start', function(start) {
        socket.broadcast.to(first).emit('start', start);
    });
    
    //send word to first connected socket
    socket.on('word', function(word) {
        socket.broadcast.to(first).emit('word', word);
    });
    
    //broadcast user drawing to all connected sockets
    socket.on('draw', function(position) {
        socket.broadcast.emit('draw', position);
    });
    
    //broadcst guess to all connected sockets
    socket.on('guess', function(guess) {
        socket.broadcast.emit('guess', guess);
    });

});

server.listen(process.env.PORT || 8080);