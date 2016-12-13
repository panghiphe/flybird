var game = null;
var score = 0;
var bra_num = 0;
var pixelRatio = 2;
$(document).ready(function(){
	$(".close-btn").click(function(){
		$(this).parents().find(".alert-dlg").fadeOut("fast");
	});
	
	$("#share-dlg").click(function() {
		$(this).fadeOut("fast");
	});
	
	if($(window).width() > $(window).height())
	{
		$(".msg-con").fadeIn("fast");
	}
	else
	{
		game = new Phaser.Game(document.body.offsetWidth*pixelRatio,document.body.offsetHeight*pixelRatio,Phaser.AUTO,'game_div');
		game.state.add('load',load_state);
		game.state.add('menu',menu_state);
		game.state.add('ready',ready_state);
		game.state.add('play',play_state);
		game.state.add('gameover',gameover_state);
		
		game.state.start('load');
	}
	
	$(window).resize(function() {
		if($(window).width() > $(window).height())
		{
			$(".msg-con").fadeIn("fast");
			if(game)
			{
				game.gamePaused();
			}
		}
		else
		{
			$(".msg-con").fadeOut(function() {
				if(game)
				{
					game.gameResumed();
				}
				else
				{
					game = new Phaser.Game(document.body.offsetWidth,document.body.offsetHeight,Phaser.AUTO,'game_div');

					game.state.add('load',load_state);
					game.state.add('menu',menu_state);
					game.state.add('ready',ready_state);
					game.state.add('play',play_state);
					game.state.add('gameover',gameover_state);
					
					game.state.start('load');
				}
			});
		}
	});
});

function isPointInBounds(point, bounds) {
	if(!point || !bounds)
	{
		return false;
	}
	if(point.x >= bounds.x/pixelRatio && point.x <= bounds.x/pixelRatio + bounds.width/pixelRatio &&
	   point.y >= bounds.y/pixelRatio && point.y <= bounds.y/pixelRatio + bounds.height/pixelRatio)
	{
		return true;
	}
	return false;
}
