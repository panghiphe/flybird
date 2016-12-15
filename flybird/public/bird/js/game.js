var game = null;
var score = 0;
var bra_num = 0;
var pixelRatio = 2;
var currentPage = 1;
$(document).ready(function(){
	$("body").on('touchmove', function(e) {
		e = e || window.event;
		e.stopPropagation();
		e.preventDefault();
		return false;
	});
	
	$(".close-btn").click(function(){
		$(this).parents().find(".alert-dlg").fadeOut("fast");
	});
	
	$("#share-dlg").click(function() {
		$(this).fadeOut("fast");
	});
	
	//排行榜上一页
	$("#pre-btn").click(function() {
		if(currentPage <= 1)
		{
			return;
		}
		getRank(currentPage - 1);
	});
	
	//排行榜下一页
	$("#next-btn").click(function() {
		if($(this).attr("disabled"))
		{
			return;
		}
		getRank(currentPage + 1);
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

function getRank(page) {
	page = page? page:1;
	var postData = {
		page: page
	};
	$(".rank-group").html("");
	currentPage = page;
	$("#current-page").html(page);
	$.ajax({
		url: "/bird/game/rank",
		type: "get",
		data: postData,
		dataType: "json",
		success: function(data) {
			if(!data)
			{
				$("#next-btn").attr("disabled", true);
				return;
			}
			if(data.error == 0)
			{
				if(data.rank.length < 10)
				{
					$("#next-btn").attr("disabled", true);
				}
				else
				{
					$("#next-btn").removeAttr("disabled");
				}
				var rankHtml = "";
				for(var i = 0; i < data.rank.length; i++)
				{
					var rankInfo = data.rank[i];
					rankHtml += '<li class="rank-item">' +
									'<div class="left-part">' +
										'<span class="rank">' + ((currentPage-1) * 10 * (i+1)) + '</span>' +
										'<img src="' + rankInfo.USER_PORTRAIT + '" class="portrait" />' +
										'<span class="username">' + rankInfo.NICK_NAME + '</span>' +
									'</div>' +
									'<div class="right-part">' +
										'<span class="score">' + rankInfo.SCORE + '</span>' +
									'</div>' +
									'<div class="clearfix"></div>' +
								'</li>';
				}
				$(".rank-group").html(rankHtml);
			}
			else
			{
				$("#next-btn").attr("disabled", true);
			}
		},
		error: function() {
			
		}
	});
}
