var menu_state={
	create: function(){
		
		var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);		//定义接受按键消息变量
		space_key.onDown.add(this.start,this);		//按键按下时调用start()函数
		var t = this;
		this.game.input.touch.onTouchStart = function(){
            t.start();
        }
		
		var style = {font: "30px Arial",fill: "#FFFFFF"};		//定义游戏操作说明文字风格
		var x = game.world.width/2,y = game.world.height/2;		//定义坐标变量x,y，(x,y)为game.world中心
		
		this.bg = this.game.add.sprite(0,0,'bg');		//在game.world中坐标(0,0)处画出预加载游戏资源，背景图片
		this.bg.width = game.world.width;
		this.bg.height = game.world.height;
		this.bo = this.game.add.sprite(0,0,'bo');		//也是背景图片，我的背景由两个背景透明的图片组合而成，其实可以合二为一
		this.bo.width = game.world.width;
		this.bo.height = game.world.height;
		//this.menu = this.game.add.sprite(0,0,'menu');		//加载menu图片
		this.bird = this.game.add.sprite(x,y-60,'bird');		//载入即将闯荡管子世界的Bird
		this.bird.anchor.setTo(0.5,0.5);
		var gameName = this.game.add.text(x,y-118,"Flappy Bra",style);		//定义显示文本变量,并在game.world显示，参数(坐标,显示文本,文本风格)
		gameName.anchor.setTo(0.5,0.5);
		var text = this.game.add.text(x,y,"Touch to start!",style);		//定义显示文本变量,并在game.world显示，参数(坐标,显示文本,文本风格)
		text.anchor.setTo(0.5,0.5);		//
		
		var rankBtn = this.game.add.button(x, y-180, "RANK", this.show_rank);
		rankBtn.anchor.setTo(0.5,0.5);
	},
	show_rank: function() {
		$.ajax({
    		url: "/bird/game/rank",
    		type: "post",
    		dataType: "json",
    		success: function(data) {
    			
    		},
    		error: function() {
    			
    		}
    	});
	},
	start:function(){
		this.game.state.start('ready');		//调用start()函数后进入'ready'state
	}
};