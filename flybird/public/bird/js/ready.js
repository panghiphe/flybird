var ready_state = {
	create:function(){
		//载入游戏准备界面
		var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		space_key.onDown.add(this.start,this);
		var t = this;
		this.game.input.touch.onTouchStart = function(){
            t.start();
        }
		
		var x = game.world.width/2,y = game.world.height/2;		//定义坐标变量x,y，(x,y)为game.world中心
		var style = {font: "30px Arial",fill: "#666"};		//定义游戏操作说明文字风格
		this.bg = this.game.add.sprite(0,0,'bg');
		this.bg.width = game.world.width;
		this.bg.height = game.world.height;
		this.bo = this.game.add.sprite(0,0,'bo');
		this.bo.width = game.world.width;
		this.bo.height = game.world.height;
		this.ready = this.game.add.sprite(0,0,'ready');
		this.ready.width = game.world.width;
		this.ready.height = game.world.height;
		//this.bird = this.game.add.sprite(100,245,'bird');
		var text = this.game.add.text(x,y+100,"Touch to continue!",style);		//定义显示文本变量,并在game.world显示，参数(坐标,显示文本,文本风格)
		text.anchor.setTo(0.5,0.5);	
	},
	start:function(){
		this.game.state.start('play');	
	},
};