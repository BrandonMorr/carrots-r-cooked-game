/**
 * @file - Holds the client functionality.
 */

var Client = {};

Client.socket = io.connect();

/**
 * Send message to the server when a new player has joined.
 */
Client.askNewPlayer = function() {
  Client.socket.emit('newplayer');
};

/**
 * Send click data (x/y coordinates) to server.
 */
Client.sendClick = function(x, y) {
  Client.socket.emit('click', {
    x:x,
    y:y,
  });
};

/**
 * DEBUG: emit a test message to the server.
 */
Client.sendTest = function() {
  Client.socket.emit('test');
};

/**
 * Create a new player.
 */
Client.socket.on('newplayer', function(playerData) {
  Game.addNewPlayer(playerData.id, playerData.xPos, playerData.yPos);
});

/**
 * Display all other players on server.
 */
Client.socket.on('displayallplayers', function(playerMap) {
  for (var i = 0; i < playerMap.length; i++) {
    Game.addNewPlayer(playerMap[i].id, playerMap[i].xPos, playerMap[i].yPos);
  }
});

/**
 * Remove the player on disconnect.
 */
Client.socket.on('remove', function(id) {
  Game.removePlayer(id);
});

/**
 * Move the player with the provided data (id, x/y coordinates).
 */
Client.socket.on('move', function(data) {
  Game.movePlayer(data.id, data.x, data.y);
});
