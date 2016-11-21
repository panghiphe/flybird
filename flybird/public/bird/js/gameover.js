var gameover_state = {
	create:function(){
		
		var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		space_key.onDown.add(this.start,this);	
		var t = this;
		this.game.input.touch.onTouchStart = function(){
            t.start();
       } 
		
		var style = {font: "30px Arial",fill: "#666"};
		var style1 = {font: "40px Arial",fill: "#F00"};
		var x = game.world.width/2,y = game.world.height/2;
		
		
		this.bg = this.game.add.sprite(0,0,'bg');
		this.bg.width = game.world.width;
		this.bg.height = game.world.height;
		this.bo = this.game.add.sprite(0,0,'bo');
		this.bo.width = game.world.width;
		this.bo.height = game.world.height;
		/*this.gameover = this.game.add.sprite(0,0,'gameover');
		this.gameover.width = game.world.width;
		this.gameover.height = game.world.height;*/
		var over_label = this.game.add.text(x,y-100,"Game Over",style);
		over_label.anchor.setTo(0.5,0.5);
		var score_label = this.game.add.text(x,y-50,"score " + score,style1);
		score_label.anchor.setTo(0.5,0.5);
		var bestScore = localStorage.flybestScore? Number(localStorage.flybestScore):0
		var nowBest = Math.max(bestScore, score);
		localStorage.flybestScore = nowBest;
		var best_label = this.game.add.text(x,y,"best " + nowBest,style1);
		best_label.anchor.setTo(0.5,0.5);
		var text = this.game.add.text(x,y+50,"Touch to back!",style);		//定义显示文本变量,并在game.world显示，参数(坐标,显示文本,文本风格)
		text.anchor.setTo(0.5,0.5);	
	},
	start:function(){
		this.game.state.start('menu');	
	}
};