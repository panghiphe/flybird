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
		this.game.load.image('diamond','/bird/image/diamond.png');
		this.game.load.image('gameoverbg','/bird/image/gameover-bg.jpg');
		this.game.load.image('gameover','/bird/image/gameover.png');
		this.game.load.image('diamond','/bird/image/diamond.png');
		this.game.load.image('playbg','/bird/image/play-bg.jpg');
		this.game.load.image('pipeup','/bird/image/up-lock.png');
		this.game.load.image('pipedown','/bird/image/down-lock.png');
		this.game.load.image('merry','/bird/image/Christmas.png');
        this.game.load.image('btnflower','/bird/image/flower.png');
        this.game.load.image('scoreboard','/bird/image/score-board.png');
        this.game.load.image('bottom','/bird/image/bottom.png');
        this.game.load.image('sharebtn','/bird/image/share-btn.png');
        this.game.load.image('replaybtn','/bird/image/replay-btn.png');
        this.game.load.image('rank_btn','/bird/image/rank_btn.png');
        this.game.load.image('bra0','/bird/image/bra0.png');
        this.game.load.image('bra1','/bird/image/bra1.png');
        this.game.load.image('bra2','/bird/image/bra2.png');
        this.game.load.image('bra3','/bird/image/bra3.png');
        this.game.load.image('bra4','/bird/image/bra4.png');
    },

    create: function() {
		
        // 所有资源加载完成后，进入'menu'state
        this.game.state.start('menu');
		
    }
};