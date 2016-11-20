var play_state = {
    create: function() { 
		//载入所需资源
		this.bg = this.game.add.sprite(0,0,'bg');
		this.bg.width = game.world.width;
		this.bg.height = game.world.height;
		this.bo = this.game.add.sprite(0,0,'bo');
		this.bo.width = game.world.width;
		this.bo.height = game.world.height;
		
		
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this); 

        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe');  
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);           

        this.bird = this.game.add.sprite(100, 245, 'bird');
        this.bird.body.gravity.y = 1000; 		//设置Bird重力属性,gravity
        this.bird.anchor.setTo(-0.2, 0.5);		//设置Bird重心
        
        // Not 'this.score', but just 'score'
        score = 0; 
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "0", style); 

        this.jump_sound = this.game.add.audio('jump');		//加载音效
		this.dead_sound = this.game.add.audio('dead');		//||
		
		this.holeIndex = 1;  //保留当前通道的索引，避免相邻两个管道的通道上下距离太远而无法通过游戏，最好保持在上下1.5个通道高度的距离
    },

    update: function() {
        if (this.bird.inWorld == false)
            this.restart_game(); 

        if (this.bird.angle < 20)
            this.bird.angle += 1;

        this.game.physics.overlap(this.bird, this.pipes, this.hit_pipe, null, this);      
    },
	//每次按下空格调用的函数
    jump: function() {
        if (this.bird.alive == false)
            return; 

        this.bird.body.velocity.y = -350;
        this.game.add.tween(this.bird).to({angle: -20}, 50).start();
        this.jump_sound.play();
    },
	//撞管子
    hit_pipe: function() {
        if (this.bird.alive == false)
            return;

        this.bird.alive = false;
        this.game.time.events.remove(this.timer);

        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
		this.dead_sound.play();
    },
	//重新开始函数
    restart_game: function() {
        this.game.time.events.remove(this.timer);
		
        this.game.state.start('gameover');
    },

    add_one_pipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();
        pipe.reset(x, y);
        pipe.body.velocity.x = -200; 
        pipe.outOfBoundsKill = true;
    },

    add_row_of_pipes: function() {
    	var pipeNum = Math.ceil(game.world.height / 60);
        var hole = Math.floor(Math.random()*(pipeNum - 3))+1;
        if(hole > this.holeIndex + 5)
        {
        	this.holeIndex = this.holeIndex + 5;
        }
        else if(hole < this.holeIndex - 3)
        {
        	this.holeIndex = this.holeIndex - 3;
        }
        else
        {
        	this.holeIndex = hole;
        }
        for (var i = 0; i < pipeNum; i++)
            if (i != this.holeIndex && i != this.holeIndex +1) 
                this.add_one_pipe(game.world.width, i*60+10);   
        score += 1; 
        this.label_score.content = score;  
    },
};