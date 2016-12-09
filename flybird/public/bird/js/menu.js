var menu_state={
	create: function(){
		
		var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);		//定义接受按键消息变量
		space_key.onDown.add(this.start,this);		//按键按下时调用start()函数
		var t = this;
		this.game.input.touch.onTouchStart = function(ev){
			var evPos = {
				x: ev.touches[0].clientX,
				y: ev.touches[0].clientY
			}
			
			if(isPointInBounds(evPos, t.rankBtn.getBounds()))
			{
				t.show_rank();
			}
			else if(isPointInBounds(evPos, t.startBtn.getBounds()))
			{
				t.start();
			}
			else if(isPointInBounds(evPos, t.ruleBtn.getBounds()))
			{
				$("#rule-dlg").fadeIn("fast");
			}
            
        }
		
		var style = {font: "30px Arial",fill: "#FFFFFF"};		//定义游戏操作说明文字风格
		var x = game.world.width/2,y = game.world.height/2;		//定义坐标变量x,y，(x,y)为game.world中心
		
		this.bg = this.game.add.sprite(0,0,'menubg');		//在game.world中坐标(0,0)处画出预加载游戏资源，背景图片
		/*this.bg.width = game.world.width;
		this.bg.height = game.world.height;*/
		var scale = game.world.width / this.bg.width;
		this.bg.scale.x = game.world.width / this.bg.width;
		this.bg.scale.y = game.world.height / this.bg.height;
		
		this.titleImg = this.game.add.sprite(x,game.world.height * 0.15,'title');
		this.titleImg.scale.x = game.world.width * 0.8 / this.titleImg.width;
		this.titleImg.scale.y = this.titleImg.scale.x;
		this.titleImg.anchor.setTo(0.5,0);
		
        this.bird = this.game.add.sprite(game.world.width * 0.14, game.world.height * 0.4, 'bird');
        //game.physics.arcade.enable(this.bird);
        this.bird.scale.x = game.world.width * 0.184 / this.bird.width;
		this.bird.scale.y = this.bird.scale.x;
        this.bird.animations.add('fly', [0, 1, 2], 10, true);
        this.bird.animations.play('fly');
        
		this.startBtn = this.game.add.button(x, this.titleImg.position.y + this.titleImg.height + 50, "startbtn", this.show_rank);
        var btnScale = game.world.width * 0.58 / this.startBtn.width;
        this.startBtn.scale.x = btnScale;
		this.startBtn.scale.y = btnScale;
		this.startBtn.anchor.setTo(0.5,0.5);
		
		this.ruleBtn = this.game.add.button(x, this.startBtn.position.y + this.startBtn.height + 10, "rulebtn", this.show_rank);
        this.ruleBtn.scale.x = btnScale;
		this.ruleBtn.scale.y = btnScale;
		this.ruleBtn.anchor.setTo(0.5,0.5);
		
		this.rankBtn = this.game.add.button(x, this.ruleBtn.position.y + this.ruleBtn.height + 10, "rankbtn", this.show_rank);
        this.rankBtn.scale.x = btnScale;
		this.rankBtn.scale.y = btnScale;
		this.rankBtn.anchor.setTo(0.5,0.5);
		
        this.btnflower = this.game.add.sprite(x, this.startBtn.position.y - this.startBtn.height/2, "btnflower");
        this.btnflower.scale.x = game.world.width * 0.19 / this.btnflower.width;
		this.btnflower.scale.y = this.btnflower.scale.x;
		this.btnflower.anchor.setTo(0.5,0.5);
        
		//$(".opt-btn-con").fadeIn();
	},
	show_rank: function() {
		$("#rank-dlg").fadeIn("fast");
		$.ajax({
    		url: "/bird/game/rank",
    		type: "post",
    		dataType: "json",
    		success: function(data) {
    			if(!data)
    			{
    				return;
    			}
    			if(data.error == 0)
    			{
    				var rankHtml = "";
    				for(var i = 0; i < data.rank.length; i++)
    				{
    					var rankInfo = data.rank[i];
    					rankHtml += '<li class="rank-item">' +
										'<div class="left-part">' +
											'<span class="rank">' + (i+1) + '</span>' +
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
    			
    		},
    		error: function() {
    			
    		}
    	});
	},
	start:function(){
		this.game.state.start('play');		//调用start()函数后进入'play'state
	}
};