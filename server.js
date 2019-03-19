/**
 * @file - Holds the server functionality.
 */

// Server setup
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io').listen(server);

// Setup static file paths (styles, assets, code)
app.use('/css', express.static(__dirname + '/css'));
app.use('/dist', express.static(__dirname + '/dist'));
app.use('/src', express.static(__dirname + '/src'));
app.use('/assets', express.static(__dirname + '/assets'));

// Load index.html when a request is made to the server
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

server.lastPlayerID = 0;

// Tell the server to listen for connections on port 8081
server.listen(process.env.PORT || 8081, function(){
  console.log('🥕 Server initialized & listening for connections on port ' + server.address().port + ' 🥕\n');
});

// When the server recieves a connection, do:
io.on('connection', function(socket) {
  // DEBUG: If any test messages have been recieved, log it
  socket.on('test', function() {
    console.log("Test recieved");
  });

  // Create new player, assign ID and provide random x/y coordinates for
  // spawning
  socket.on('newplayer', function() {
    socket.player = {
      id: server.lastPlayerID++,
      xPos: getRandomInt(100,400),
      yPos: getRandomInt(100,400),
    };
    console.log('New connection recieved, assigning ID: ' + server.lastPlayerID);

    // Build up a list of all current players, send the data to the client
    socket.emit('displayallplayers', getAllPlayers());
    // Broadcast new player to other new players
    socket.broadcast.emit('newplayer', socket.player);

    // When a click is recieved, move the player
    socket.on('click', function(data) {
      socket.player.x = data.x;
      socket.player.y = data.y;
      io.emit('move', socket.player);
    });

    // When a player disconnects, remove them from the game
    socket.on('disconnect', function() {
      io.emit('remove', socket.player.id);
    });
  });
});

/**
 * Return all players currently connected to server.
 */
function getAllPlayers() {
  var players = [];

  Object.keys(io.sockets.connected).forEach(function(socketId) {
    var player = io.sockets.connected[socketId].player;

    if (player) {
      players.push(player);
    }
  });

  return players;
}

/**
 * Return a random integer within a specified range.
 */
function getRandomInt(low, high) {
  return Math.floor(Math.random() * (high - low) + low);
}
