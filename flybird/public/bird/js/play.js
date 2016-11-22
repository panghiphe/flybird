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
        var t = this;
        this.game.input.touch.onTouchStart = function(){
            t.jump();
        }

        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe'); 
        game.physics.arcade.enable(this.pipes, true);
        this.pipes.forEach(function (p) {
        	p.events.onKilled.add(function(){
        		this.isScored = false;
        	}, p);
        });
        
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);           

        this.bird = this.game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.body.gravity.y = 1000; 		//设置Bird重力属性,gravity
        this.bird.anchor.setTo(-0.2, 0.5);		//设置Bird重心
        
        this.bras = game.add.group();
        this.bras.createMultiple(3, 'diamond'); 
        game.physics.arcade.enable(this.bras, true);
        
        // Not 'this.score', but just 'score'
        score = 0; 
        var style = { font: "30px Arial", fill: "#ffffff" };
        this.label_score = this.game.add.text(20, 20, "0", style); 
        //game.physics.arcade.enable(this.label_score);
        this.score_box = this.game.add.sprite(20, 20);
        game.physics.arcade.enable(this.score_box);
        this.score_box.width = 50;
        this.score_box.height = 50;

        this.jump_sound = this.game.add.audio('jump');		//加载音效
		this.dead_sound = this.game.add.audio('dead');		//||
		
		this.holeIndex = 1;  //保留当前通道的索引，避免相邻两个管道的通道上下距离太远而无法通过游戏，最好保持在上下1.5个通道高度的距离
    },

    update: function() {
        if (this.bird.inWorld == false)
            this.restart_game(); 

        if (this.bird.angle < 20)
            this.bird.angle += 1;

        this.game.physics.arcade.overlap(this.bird, this.pipes, this.hit_pipe, null, this); 
        
        this.pipes.forEachExists(this.pass_score,this); //分数检测和更新
        this.game.physics.arcade.overlap(this.bird, this.bras, this.collect_bra, null, this);
        this.game.physics.arcade.overlap(this.score_box, this.bras, this.get_bra, null, this);
    },
	//每次按下空格调用的函数
    jump: function() {
        if (this.bird.alive == false)
            return; 

        this.bird.body.velocity.y = -350;
        this.game.add.tween(this.bird).to({angle: -20}, 50).start();
        this.jump_sound.play();
    },
    //收集bra
    collect_bra: function(bird, bra) {
    	if (this.bird.alive == false)
            return;
        if(!bra.isCount)
        {
        	bra.isCount = true;
        	score += 3; 
        	bra.body.velocity.x = 0;
        	this.game.physics.arcade.moveToObject(bra, this.label_score, 1000);
        }
    },
    //将bra转移到分值
    get_bra: function(label, bra) {
        if(bra.alive)
        {
        	this.label_score.text = score;
        	bra.kill();
        	bra.alive = false;
        }
    },
    //通过管子
    pass_pipe: function(bird, pass) {
        if (this.bird.alive == false)
            return;
        if(!pass.isScored)
        {
        	score += 1; 
        	this.label_score.text = score;
        	pass.kill();
        	pass.isScored = true;
        }
    },
    //通过管子积分
    pass_score: function(pipe) {
    	if(!pipe.isScored && pipe.y <= 0 && pipe.x < this.bird.x - this.bird.width/2 - pipe.width/2) {
    		score += 1; 
        	this.label_score.text = score;
        	pipe.isScored = true;
        	return true;
    	}
    	return false;
    },
	//撞管子
    hit_pipe: function() {
        if (this.bird.alive == false)
            return;

        this.bird.alive = false;
        this.game.time.events.remove(this.timer);

        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
            p.isScored = false;
        }, this);
        
        this.bras.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
		this.dead_sound.play();
    },
	//重新开始函数
    restart_game: function() {
        this.game.time.events.remove(this.timer);
		
        this.game.state.start('gameover');
    },
    
	//增加障碍管道
    add_one_pipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();
        if(!pipe)
        {
        	pipe = this.game.add.sprite(x, y, 'pipe');
        	game.physics.arcade.enable(pipe);
        	pipe.events.onKilled.add(function(){
        		this.isScored = false;
        	}, pipe);
        	this.pipes.add(pipe);
        }
        pipe.reset(x, y);
        pipe.body.velocity.x = -1*game.world.width/2; 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    
    //增加可收集的bra
    add_one_bra: function(x, y) {
        var bra = this.bras.getFirstDead();
        if(!bra)
        {
        	bra = this.game.add.sprite(x, y, 'diamond');
        	game.physics.arcade.enable(bra);
        	this.bras.add(bra);
        }
        bra.reset(x, y);
        bra.body.velocity.x = -1*game.world.width/2; 
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
        this.add_one_bra(game.world.width*(/*2*Math.round(Math.random())+10*/11)/8, this.holeIndex*60 + (Math.round(Math.random())==1? -50:130) );
        for (var i = 0; i < pipeNum; i++)
            if (i != this.holeIndex && i != this.holeIndex +1) 
                this.add_one_pipe(game.world.width, i*60);   
        /*score += 1; 
        this.label_score.text = score;  */
    },
};