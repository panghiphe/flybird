var load_state = {  
//预加载游戏资源
    preload: function() { 
        this.game.load.image('bg','/bird/image/bg.png');
        this.game.load.image('menubg','/bird/image/bg.jpg');
        this.game.load.image('title','/bird/image/title.png');
        this.game.load.image('startbtn','/bird/image/start-btn.png');
        this.game.load.image('rulebtn','/bird/image/rule-btn.png');
        this.game.load.image('rankbtn','/bird/image/rank-btn.png');
		this.game.load.image('bo','/bird/image/back.png');
		this.game.load.image('menu','/bird/image/menu.png');
		this.game.load.image('ready','/bird/image/ready.png');
        this.game.load.spritesheet('bird', '/bird/image/bird.png', 46, 34);
        this.game.load.image('pipe', '/bird/image/pipe.png');  
        this.game.load.audio('jump', '/bird/image/jump.wav');
		this.game.load.audio('dead','/bird/image/dead.wav');
		this.game.load.image('gameover','/bird/image/gameover.png');
		this.game.load.image('diamond','/bird/image/diamond.png');
    },

    create: function() {
		
        // 所有资源加载完成后，进入'menu'state
        this.game.state.start('menu');
		
    }
};