/**
 * @file - 'Game' state file.
 */

var Game = {};

/**
 * Init - called when the state is starting up.
 */
Game.init = function() {
  // Keep running when visibility of the game has changed
  game.stage.disableVisibilityChange = true;
};

/**
 * Preload - first function to be called in the state flow. Useful for loading
 * assets.
 */
Game.preload = function() {
  // Load assets
  game.load.tilemap('tilemap', 'assets/map/example_map.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.spritesheet('tileset', 'assets/map/tilesheet.png', 32, 32);
  game.load.image('player', 'assets/sprites/player.png');
};

/**
 * Create - called once preload is complete.
 */
Game.create = function() {
  Game.playerMap = {};

  // Map setup
  var map = game.add.tilemap('tilemap');
  map.addTilesetImage('tilesheet', 'tileset');

  var layer;

  for (var i = 0; i < map.layers.length; i++) {
    layer = map.createLayer(i);
  }

  Client.askNewPlayer();

  // Add callback to send x/y coordinates to server
  layer.inputEnabled = true;
  layer.events.onInputUp.add(Game.getCoordinates, this);
};

/**
 * Add new player to map.
 */
Game.addNewPlayer = function(id, xPos, yPos) {
  Game.playerMap[id] = game.add.sprite(xPos, yPos, 'player');
};

/**
 * Remove the specified player from the map.
 */
Game.removePlayer = function(id) {
  Game.playerMap[id].destroy();
  delete Game.playerMap[id];
};

/**
 * Get x/y coordinates from click.
 */
Game.getCoordinates = function(layer, pointer){
  Client.sendClick(pointer.worldX, pointer.worldY);
};

/**
 * Move player to the next x/y coordinates.
 */
Game.movePlayer = function(id, xPos, yPos){
  var player = Game.playerMap[id];
  var distance = Phaser.Math.distance(player.x, player.y, xPos, yPos);
  var duration = distance * 2;
  // Move player to new location via tween animation
  var tween = game.add.tween(player);
  tween.to({
    x:xPos,
    y:yPos,
  }, duration);
  tween.start();
};
