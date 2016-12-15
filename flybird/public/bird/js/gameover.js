var gameover_state = {
	create:function(){
		this.shareUrl = "";
		var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		space_key.onDown.add(this.start,this);	
		var t = this;
		this.game.input.touch.onTouchStart = function(ev){
			var evPos = {
				x: ev.touches[0].clientX,
				y: ev.touches[0].clientY
			}
			
            if(isPointInBounds(evPos, t.shareBtn.getBounds()))
			{
				t.share_game();
			}
			else if(isPointInBounds(evPos, t.rankBtn.getBounds()))
			{
				t.show_rank();
			}
			else if(isPointInBounds(evPos, t.replayBtn.getBounds()))
			{
				t.start();
			}
       } 
		
		var fontSize = 16 * pixelRatio;
		var style = {font: "bold " + fontSize + "px Arial",fill: "#b54503"};
		var style1 = {font: "bold " + fontSize + "px Arial",fill: "#f93e04"};
		var x = game.world.width/2,y = game.world.height/2;
		
		
		this.bg = this.game.add.sprite(0,0,'gameoverbg');
		var scale = game.world.width / this.bg.width;
		this.bg.scale.x = game.world.width / this.bg.width;
		this.bg.scale.y = game.world.height / this.bg.height;
		
		this.gameover = this.game.add.sprite(x, game.world.height * 0.08,'gameover');
		this.gameover.scale.x = game.world.width * 0.8 / this.gameover.width;
		this.gameover.scale.y = this.gameover.scale.x;
		this.gameover.anchor.setTo(0.5,0);
		
		this.score_board = this.game.add.sprite(x, game.world.height * 0.08 + this.gameover.height/2 + 50 * pixelRatio,'scoreboard');
        var boardScale = game.world.width * 0.65 / this.score_board.width;
        this.score_board.scale.x = boardScale;
		this.score_board.scale.y = boardScale;
		this.score_board.anchor.setTo(0.5,0);
		
		this.bra_label = this.game.add.text(x-10 * pixelRatio,this.score_board.position.y + this.score_board.height * 0.334,"内衣奖励 ",style);
		this.bra_label.anchor.setTo(1, 0);
		
		this.score_label = this.game.add.text(x+10 * pixelRatio,this.score_board.position.y + this.score_board.height * 0.334,"本次分数 ",style);
		
		this.bra_sprite = this.game.add.sprite(this.bra_label.position.x-this.bra_label.width-8 * pixelRatio, this.bra_label.position.y + this.bra_label.height + 5 * pixelRatio, 'bra0');
		this.bra_sprite.scale.x = game.world.width * 0.12 / this.bra_sprite.width;
		this.bra_sprite.scale.y = this.bra_sprite.scale.x;
		//this.bra_sprite.anchor.setTo(1,0);
		
		this.bra_text = this.game.add.text(this.bra_sprite.position.x+this.bra_sprite.width+7 * pixelRatio, this.bra_sprite.position.y + this.bra_sprite.height/2 + 10 * pixelRatio,"x" + bra_num,style1);
		this.bra_text.anchor.setTo(0, 0.5);
		
		this.score_text = this.game.add.text(this.score_label.x+this.score_label.width/2, this.score_label.position.y + this.score_label.height, score, style1);
		this.score_text.anchor.setTo(0.5, 0);
		
		this.max_score_label = this.game.add.text(x+10 * pixelRatio, this.score_text.position.y + this.score_text.height, "最高分数 ",style);
		
		this.max_score_text = this.game.add.text(this.max_score_label.x+this.max_score_label.width/2, this.max_score_label.position.y + this.max_score_label.height," ",style1);
		this.max_score_text.anchor.setTo(0.5, 0);
		
		this.replayBtn = this.game.add.button(x-8 * pixelRatio, this.score_board.position.y + this.score_board.height * 0.564 + 5 * pixelRatio, "replaybtn", this.start);
        var btnScale = 30 * pixelRatio / this.replayBtn.width;
        this.replayBtn.scale.x = btnScale;
		this.replayBtn.scale.y = btnScale;
		this.replayBtn.anchor.setTo(1,0);
		
		this.rankBtn = this.game.add.button(x+8 * pixelRatio, this.replayBtn.position.y, "rank_btn", this.show_rank);
        var btnScale = 30 * pixelRatio / this.rankBtn.width;
        this.rankBtn.scale.x = btnScale;
		this.rankBtn.scale.y = btnScale;
		
		var shareBtnY = this.score_board.position.y + this.score_board.height;
		while(shareBtnY >= game.world.height-10 * pixelRatio)
		{
			shareBtnY -= 5 * pixelRatio;
		}
		this.shareBtn = this.game.add.button(x, shareBtnY, "sharebtn", this.share_game);
        var btnScale = game.world.width * 0.58 / this.shareBtn.width;
        this.shareBtn.scale.x = btnScale;
		this.shareBtn.scale.y = btnScale;
		this.shareBtn.anchor.setTo(0.5,1);
		
        this.btnflower = this.game.add.sprite(x, this.shareBtn.position.y - this.shareBtn.height/2, "btnflower");
        this.btnflower.scale.x = game.world.width * 0.19 / this.btnflower.width;
		this.btnflower.scale.y = this.btnflower.scale.x;
		this.btnflower.anchor.setTo(0.5,1.2);
        
		this.gamebottom = this.game.add.sprite(0, game.world.height,'bottom');
        this.gamebottom.scale.x = game.world.width / this.gamebottom.width;
		this.gamebottom.scale.y = this.gamebottom.scale.x
		this.gamebottom.anchor.setTo(0,1);
		
		this.end_game();
		/*var score_label = this.game.add.text(x,y-50,"score " + score,style1);
		score_label.anchor.setTo(0.5,0.5);
		var bestScore = localStorage.flybestScore? Number(localStorage.flybestScore):0
		var nowBest = Math.max(bestScore, score);
		localStorage.flybestScore = nowBest;
		var best_label = this.game.add.text(x,y,"best " + nowBest,style1);
		best_label.anchor.setTo(0.5,0.5);
		var text = this.game.add.text(x,y+50,"Touch to back!",style);		//定义显示文本变量,并在game.world显示，参数(坐标,显示文本,文本风格)
		text.anchor.setTo(0.5,0.5);	*/
	},
    //告诉后台游戏结束
    end_game: function() {
    	var postData = {
    		score: score,
    		bra_num: bra_num 
    	};
    	var t = this;
    	$.ajax({
    		url: "/bird/game/end",
    		type: "post",
    		data: postData,
    		dataType: "json",
    		success: function(data) {
    			if(data.error == "0")
    			{
    				t.max_score_text.text = Math.max(parseInt(data.max), score);
    				t.shareUrl = data.shareUrl;
    			}
    		},
    		error: function() {
    			
    		}
    	});
    },
	show_rank: function() {
		$("#rank-dlg").fadeIn("fast");
		getRank();
	},
	share_game: function() {
		//$("#share-dlg").fadeIn("fast");
		if(this.shareUrl)
		{
			localStorage.shareFrom = "self";
			location.href = this.shareUrl;
		}
	},
	start:function(){
		this.game.state.start('menu');	
	}
};