var play_state = {
    create: function() { 
		//载入所需资源
		this.bgs = game.add.group();
		this.bgs.createMultiple(3, 'playbg'); 
        game.physics.arcade.enable(this.bgs, true);
        this.bgs.forEach(function (bg) {
        	bg.width = game.world.width;
			bg.height = game.world.height;
			/*bg.events.onKilled.add(function(){
        		t.add_one_bg();
        	}, bg);*/
        });
		this.add_one_bg(0, 0);
		this.add_one_bg();
        this.bgtimer = this.game.time.events.loop(2900, this.add_one_bg, this);           

		/*this.bo = this.game.add.sprite(0,0,'bo');
		this.bo.width = game.world.width;
		this.bo.height = game.world.height;*/
		
		
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this); 
        this.game.input.touch.onTouchStart = function(ev){
            t.jump();
        }

        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe'); 
        game.physics.arcade.enable(this.pipes, true);
        
        this.pipeups = game.add.group();
        this.pipeups.createMultiple(3, 'pipeup'); 
        game.physics.arcade.enable(this.pipeups, true);
        this.pipeups.forEach(function (p) {
        	p.events.onKilled.add(function(){
        		this.isScored = false;
        	}, p);
        });
        
        this.pipedowns = game.add.group();
        this.pipedowns.createMultiple(3, 'pipedown'); 
        game.physics.arcade.enable(this.pipedowns, true);
        
        this.timer = this.game.time.events.loop(1500, this.add_row_of_pipes, this);           

        this.bird = this.game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.scale.x = game.world.width * 0.15 / this.bird.width;
		this.bird.scale.y = this.bird.scale.x;
        this.bird.animations.add('fly', [0, 1, 2], 10, true);
        this.bird.animations.play('fly');
        this.bird.body.gravity.y = 1000; 		//设置Bird重力属性,gravity
        this.bird.anchor.setTo(-0.2, 0.5);		//设置Bird重心
        
        this.merry_Christmas = this.game.add.sprite(game.world.width/2, game.world.height/2-150, 'merry');
        this.merry_Christmas.scale.x = game.world.width * 0.5 / this.merry_Christmas.width;
		this.merry_Christmas.scale.y = this.merry_Christmas.scale.x;
		this.merry_Christmas.anchor.setTo(0.5, 0.5);
        
        this.bras = game.add.group();
        //this.bras.createMultiple(3, 'diamond'); 
        game.physics.arcade.enable(this.bras, true);
        
        // Not 'this.score', but just 'score'
        score = 0; 
        bra_num = 0;
        
        var style = { font: "16px Arial", fill: "#ffffff" };
        this.score_label = this.game.add.text(game.world.width/2, 30, "分数", style);
        this.score_label.anchor.setTo(1, 0);
        
        this.score_text = this.game.add.text(game.world.width/2, 30, "0", style); 
        this.score_text.anchor.setTo(-1, 0);
        //game.physics.arcade.enable(this.score_text);
        this.score_box = this.game.add.sprite(20, 20);
        game.physics.arcade.enable(this.score_box);
        this.score_box.width = 50;
        this.score_box.height = 50;

        this.jump_sound = this.game.add.audio('jump');		//加载音效
		this.dead_sound = this.game.add.audio('dead');		//||
		
		this.holeIndex = 1;  //保留当前通道的索引，避免相邻两个管道的通道上下距离太远而无法通过游戏，最好保持在上下1.5个通道高度的距离
		
		this.start_game();
    },

    update: function() {
        if (this.bird.inWorld == false)
            this.restart_game(); 

        if (this.bird.angle < 20)
            this.bird.angle += 1;

        this.game.physics.arcade.overlap(this.bird, this.pipes, this.hit_pipe, null, this); 
        this.game.physics.arcade.overlap(this.bird, this.pipeups, this.hit_pipe, null, this); 
        this.game.physics.arcade.overlap(this.bird, this.pipedowns, this.hit_pipe, null, this); 
        
        this.pipeups.forEachExists(this.pass_score,this); //分数检测和更新
        this.game.physics.arcade.overlap(this.bird, this.bras, this.collect_bra, null, this);
        this.game.physics.arcade.overlap(this.score_box, this.bras, this.get_bra, null, this);
    },
    //告诉后台游戏开始
    start_game: function() {
    	$.ajax({
    		url: "/bird/game/start",
    		type: "post",
    		dataType: "json",
    		success: function(data) {
    			
    		},
    		error: function() {
    			
    		}
    	});
    },
    //告诉后台游戏结束
    end_game: function() {
    	var postData = {
    		score: score
    	};
    	$.ajax({
    		url: "/bird/game/end",
    		type: "post",
    		data: postData,
    		dataType: "json",
    		success: function(data) {
    			
    		},
    		error: function() {
    			
    		}
    	});
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
        	bra_num++;
        	this.game.physics.arcade.moveToObject(bra, this.score_text, 1000);
        }
    },
    //将bra转移到分值
    get_bra: function(label, bra) {
        if(bra.alive)
        {
        	this.score_text.text = score;
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
        	this.score_text.text = score;
        	pass.kill();
        	pass.isScored = true;
        }
    },
    //通过管子积分
    pass_score: function(pipe) {
    	if(!pipe.isScored && pipe.x < this.bird.x - this.bird.width/2 - pipe.width/2) 		{
    		score += 1; 
        	this.score_text.text = score;
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
        this.game.time.events.remove(this.bgtimer);

        this.bgs.forEachAlive(function(bg){
            bg.body.velocity.x = 0;
        }, this);
        
        this.pipes.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
        
        this.pipeups.forEachAlive(function(p){
            p.body.velocity.x = 0;
            p.isScored = false;
        }, this);
        
        this.pipedowns.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
        
        this.bras.forEachAlive(function(p){
            p.body.velocity.x = 0;
        }, this);
		this.dead_sound.play();
    },
	//重新开始函数
    restart_game: function() {
        this.game.time.events.remove(this.timer);
		this.end_game();
        this.game.state.start('gameover');
    },
    
	//增加游戏背景场景
    add_one_bg: function(x, y) {
    	x = x != null? x:game.world.width;
    	y = y != null? y:0;
        var bg = this.bgs.getFirstDead();
        if(!bg)
        {
        	bg = this.game.add.sprite(x, y, 'playbg');
        	game.physics.arcade.enable(bg);
        	bg.width = game.world.width;
			bg.height = game.world.height;
        	this.bgs.add(bg);
        }
        bg.reset(x, y);
        bg.body.velocity.x = -1*game.world.width/3; 
        bg.checkWorldBounds = true;
        bg.outOfBoundsKill = true;
    },
    
	//增加障碍肩带
    add_one_pipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();
        if(!pipe)
        {
        	pipe = this.game.add.sprite(x, y, 'pipe');
        	game.physics.arcade.enable(pipe);
        	this.pipes.add(pipe);
        }
        pipe.reset(x, y);
        pipe.body.velocity.x = -1*game.world.width/2; 
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
    },
    //增加肩带障碍上扣子
    add_one_pipe_up: function(x, y) {
        var pipeup = this.pipeups.getFirstDead();
        if(!pipeup)
        {
        	pipeup = this.game.add.sprite(x, y, 'pipeup');
        	game.physics.arcade.enable(pipeup);
        	pipeup.events.onKilled.add(function(){
        		this.isScored = false;
        	}, pipeup);
        	this.pipeups.add(pipeup);
        }
        pipeup.reset(x, y);
        pipeup.body.velocity.x = -1*game.world.width/2; 
        pipeup.checkWorldBounds = true;
        pipeup.outOfBoundsKill = true;
    },
	//增加障碍下肩带扣子
    add_one_pipe_down: function(x, y) {
        var pipedown = this.pipedowns.getFirstDead();
        if(!pipedown)
        {
        	pipedown = this.game.add.sprite(x, y, 'pipedown');
        	game.physics.arcade.enable(pipedown);
        	this.pipedowns.add(pipedown);
        }
        pipedown.reset(x, y);
        pipedown.body.velocity.x = -1*game.world.width/2; 
        pipedown.checkWorldBounds = true;
        pipedown.outOfBoundsKill = true;
    },
    
    //增加可收集的bra
    add_one_bra: function(x, y) {
        /*var bra = this.bras.getFirstDead();
        if(!bra)
        {
        	bra = this.game.add.sprite(x, y, 'diamond');
        	game.physics.arcade.enable(bra);
        	this.bras.add(bra);
        }*/
       	var braIndex = Math.floor(Math.random()*4);
        var bra = this.game.add.sprite(x, y, 'bra' + braIndex);
    	game.physics.arcade.enable(bra);
		bra.scale.x = game.world.width * 0.25 / bra.width;
		bra.scale.y = bra.scale.x;
    	this.bras.add(bra);
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
        
        //上肩带
        var upHeight = this.holeIndex*60;
        this.add_one_pipe_up(game.world.width, upHeight-60);
        var upPipeNum = Math.ceil((upHeight-60)/397);
        for (var i = upPipeNum; i > 0; i--)
        {
        	this.add_one_pipe(game.world.width, upHeight-60 - i*397);
        }
        
        //下肩带
        var downHeight = game.world.height - (this.holeIndex + 2)*60;
        this.add_one_pipe_down(game.world.width, (this.holeIndex + 2)*60);
        var downPipeNum = Math.ceil(downHeight/397);
        for (var i = 0; i < downPipeNum; i++)
        {
        	this.add_one_pipe(game.world.width, (this.holeIndex + 3)*60 + i*397);
        }
        /*score += 1; 
        this.score_text.text = score;  */
    },
};