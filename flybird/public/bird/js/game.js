var game = null;
var score = 0;
$(document).ready(function(){
	 game = new Phaser.Game(document.body.offsetWidth,document.body.offsetHeight,Phaser.AUTO,'game_div');

	game.state.add('load',load_state);
	game.state.add('menu',menu_state);
	game.state.add('ready',ready_state);
	game.state.add('play',play_state);
	game.state.add('gameover',gameover_state);
	
	game.state.start('load');
});
