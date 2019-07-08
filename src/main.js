/**
 * @file - Create the game object, add and fire up the 'Game' state (game.js).
 */

var game = new Phaser.Game(768,544, Phaser.AUTO, document.getElementById('game'));

game.state.add('Game', Game);
game.state.start('Game');
