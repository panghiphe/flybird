var play_state = {
    create: function() { 
        var t = this;
        // Not 'this.score', but just 'score'
        score = 0; 
        bra_num = 0;
        
        this.bgIntervals = [3,2.5,2,1.5,1]/*[5,4.5,4,3.5,3]*/;
        this.braIntervals = [3,2.5,2,1.5,1];
        this.scoreLevels = [20, 40, 60, 80]
        this.level = 0;
        this.pipeWidth = game.world.width * 0.15;
        
        this.comeBraIndex = 5;
        
		//载入所需资源
		this.bg = this.game.add.sprite(0, 0, 'playbg');
    	this.bg.width = game.world.width;
		this.bg.height = game.world.height;
		/*this.bgs = game.add.group();
		this.bgs.createMultiple(3, 'playbg'); 
        game.physics.arcade.enable(this.bgs, true);
        this.bgs.forEach(function (bg) {
        	bg.width = game.world.width;
			bg.height = game.world.height;
        });
        this.bgtimer = this.game.time.events.loop(this.bgIntervals[this.level]*1000-100, this.add_one_bg, this);*/           

		/*this.bo = this.game.add.sprite(0,0,'bo');
		this.bo.width = game.world.width;
		this.bo.height = game.world.height;*/
		
        this.trees = game.add.group();
		this.trees.createMultiple(3, 'tree'); 
        game.physics.arcade.enable(this.trees, true);
        this.trees.forEach(function (tree) {
        	//p.scale.x = this.pipeWidth / p.width;
        	//p.scale.y = p.scale.x;
        	tree.isScaled = false;
        });
		
        this.merry_Christmas = this.game.add.sprite(game.world.width/2, game.world.height/2-100*pixelRatio, 'merry');
        this.merry_Christmas.scale.x = game.world.width * 0.5 / this.merry_Christmas.width;
		this.merry_Christmas.scale.y = this.merry_Christmas.scale.x;
		this.merry_Christmas.anchor.setTo(0.5, 0.5);
        
        var space_key = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        space_key.onDown.add(this.jump, this); 
        this.game.input.touch.onTouchStart = function(ev){
            t.jump();
        }

        this.pipes = game.add.group();
        this.pipes.createMultiple(20, 'pipe'); 
        game.physics.arcade.enable(this.pipes, true);
        this.pipes.forEach(function (p) {
        	//p.scale.x = this.pipeWidth / p.width;
        	//p.scale.y = p.scale.x;
        	p.isScaled = false;
        });
        this.pipe = this.game.add.sprite(-1*game.world.width, 0, 'pipe');
        this.pipe.scale.x = this.pipeWidth / this.pipe.width;
        this.pipe.scale.y = this.pipe.scale.x;
        
        this.pipeups = game.add.group();
        this.pipeups.createMultiple(3, 'pipeup'); 
        game.physics.arcade.enable(this.pipeups, true);
        this.pipeups.forEach(function (p) {
        	p.isScaled = false;
        	p.events.onKilled.add(function(){
        		this.isScored = false;
        	}, p);
        });
        this.pipeup = this.game.add.sprite(-1*game.world.width, 0, 'pipeup');
        this.pipeup.scale.x = this.pipeWidth / this.pipeup.width;
        this.pipeup.scale.y = this.pipeup.scale.x;
        
        this.pipedowns = game.add.group();
        this.pipedowns.createMultiple(3, 'pipedown'); 
        game.physics.arcade.enable(this.pipedowns, true);
        this.pipedowns.forEach(function (p) {
        	//p.scale.x = this.pipeWidth / p.width;
        	//p.scale.y = p.scale.x;
        	p.isScaled = false;
        });
        this.pipedown = this.game.add.sprite(-1*game.world.width, 0, 'pipedown');
        this.pipedown.scale.x = this.pipeWidth / this.pipedown.width;
        this.pipedown.scale.y = this.pipedown.scale.x;
        
        this.bras = game.add.group();
        game.physics.arcade.enable(this.bras, true);
        
        this.grounds = game.add.group();
		this.grounds.createMultiple(3, 'ground'); 
        game.physics.arcade.enable(this.grounds, true);
        this.grounds.forEach(function (g) {
        	//p.scale.x = this.pipeWidth / p.width;
        	//p.scale.y = p.scale.x;
        	g.isScaled = false;
        });
        
        this.ground = this.game.add.sprite(-1*game.world.width, 0, 'ground');
        this.ground.scale.x = game.world.width / this.ground.width;
        this.ground.scale.y = this.ground.scale.x;
        
        this.add_one_tree(game.world.width/2);
		
        this.bird = this.game.add.sprite(100, 245, 'bird');
        game.physics.arcade.enable(this.bird);
        this.bird.scale.x = game.world.width * 0.12 / this.bird.width;
		this.bird.scale.y = this.bird.scale.x;
        this.bird.animations.add('fly', [0, 1, 2, 3], 10, true);
        this.bird.animations.play('fly');
        this.bird.body.gravity.y = 1000*pixelRatio; 		//设置Bird重力属性,gravity
        this.bird.anchor.setTo(-0.2, 0.5);		//设置Bird重心
        
        this.timer = this.game.time.events.loop(this.braIntervals[this.level]*0.75*1000, this.add_row_of_pipes, this);       
        this.add_row_of_pipes();
        
        this.bgtimer = this.game.time.events.loop(this.bgIntervals[this.level]*1000-100, this.add_one_ground, this);
        this.add_one_ground(0);
        this.add_one_ground();
        
        var fontSize = 18 * pixelRatio;
        var style = { font: "bold " + fontSize + "px Arial", fill: "#ffffff" };
        this.score_label = this.game.add.text(game.world.width/2, 50*pixelRatio, "分数", style);
        this.score_label.anchor.setTo(1, 0);
        
        this.score_text = this.game.add.text(game.world.width/2, 50*pixelRatio, "0", style); 
        this.score_text.anchor.setTo(-1, 0);
        //game.physics.arcade.enable(this.score_text);
        this.score_box = this.game.add.sprite(game.world.width/2, 50*pixelRatio);
        game.physics.arcade.enable(this.score_box);
        this.score_box.width = 30 * pixelRatio;
        this.score_box.height = 20 * pixelRatio;

        this.jump_sound = this.game.add.audio('jump');		//加载音效
		this.dead_sound = this.game.add.audio('dead');		//||
		this.coin_sound = this.game.add.audio('get_bra');
		
		this.holeIndex = 1;  //保留当前通道的索引，避免相邻两个管道的通道上下距离太远而无法通过游戏，最好保持在上下1.5个通道高度的距离
		
		this.start_game();
    },

    update: function() {
        if (this.bird.inWorld == false)
            this.restart_game(); 
		
		if(this.bird.alive == false)
		{
			this.bird.animations.stop();
        	this.bird.frame = 3;
        	//this.game.add.tween(this.bird).to({angle: 360}, 50, null, false, 0, -1).start();
        	//this.bird.angle = -180;
		}
        if (this.bird.angle < 20)
            this.bird.angle += 1;

        this.game.physics.arcade.overlap(this.bird, this.pipes, this.hit_pipe, null, this); 
        this.game.physics.arcade.overlap(this.bird, this.pipeups, this.hit_pipe, null, this); 
        this.game.physics.arcade.overlap(this.bird, this.pipedowns, this.hit_pipe, null, this); 
        this.game.physics.arcade.overlap(this.bird, this.grounds, this.restart_game, null, this); 
        
        this.pipeups.forEachExists(this.pass_score,this); //分数检测和更新
        
        this.trees.forEachExists(this.check_kill_tree, this);
        
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
	//每次按下空格调用的函数
    jump: function() {
        if (this.bird.alive == false)
            return; 

        this.bird.body.velocity.y = -250*pixelRatio;
        this.game.add.tween(this.bird).to({angle: -10}, 50).start();
        this.jump_sound.play();
    },
    //收集bra
    collect_bra: function(bird, bra) {
    	if (this.bird.alive == false)
            return;
        if(!bra.isCount)
        {
        	this.coin_sound.play();
        	bra.isCount = true;
        	score += 2; 
        	bra.body.velocity.x = 0;
        	bra_num++;
        	this.game.physics.arcade.moveToObject(bra, this.score_text, 1000);
        }
    },
    //将bra转移到分值
    get_bra: function(label, bra) {
        if(bra.alive && bra.isCount)
        {
        	this.coin_sound.stop();
        	this.score_text.text = score;
        	bra.kill();
        	bra.alive = false;
        	bra.destroy();
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
        var x = this.bird.position.x;
        var y = this.bird.position.y;
		this.bird.kill();
		this.bird = this.game.add.sprite(x, y, 'bird_die');
        game.physics.arcade.enable(this.bird);
        this.bird.scale.x = game.world.width * 0.12 / this.bird.width;
		this.bird.scale.y = this.bird.scale.x;
        this.bird.body.gravity.y = 1000*pixelRatio; 		//设置Bird重力属性,gravity
        this.bird.anchor.setTo(-0.2, 0.5);		//设置Bird重心
        this.bird.alive = false;
        this.game.time.events.remove(this.timer);
        this.game.time.events.remove(this.bgtimer);

        /*this.bgs.forEachAlive(function(bg){
            bg.body.velocity.x = 0;
        }, this);
        */
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
        
        this.grounds.forEachAlive(function(g){
            g.body.velocity.x = 0;
        }, this);
        
        this.trees.forEachAlive(function(tree){
            tree.body.velocity.x = 0;
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
    //更新游戏关卡（速度变化）
    checkAndUpdateLevel: function() {
    	var level = this.level;
    	if (this.bird.alive != false)
        {
        	if(score < this.scoreLevels[0])
	    	{
	    		level = 0;
	    	}
	    	else if(score >= this.scoreLevels[0] && score < this.scoreLevels[1])
	    	{
	    		level = 1;
	    	}
	    	else if(score >= this.scoreLevels[1] && score < this.scoreLevels[2])
	    	{
	    		level = 2;
	    	}
	    	else if(score >= this.scoreLevels[2] && score < this.scoreLevels[3])
	    	{
	    		level = 3;
	    	}
	    	else 
	    	{
	    		level = 4;
	    	}
	    	if(level != this.level)
	    	{
	    		this.level = level;
	    		
		        this.game.time.events.remove(this.bgtimer);
		        this.bgtimer = this.game.time.events.loop(this.bgIntervals[this.level]*1000-100, this.add_one_ground, this); 
		        this.add_one_ground();
		        //this.add_one_bg();
		        
		        this.game.time.events.remove(this.timer);
	    		this.timer = this.game.time.events.loop(this.braIntervals[this.level]*0.75*1000, this.add_row_of_pipes, this);
	    		/*
		        this.bgs.forEach(function(bg){
		            bg.body.velocity.x = -1*game.world.width/this.bgIntervals[this.level]; 
		        }, this);
	        	*/
		        this.pipes.forEach(function(pipe){
		        	pipe.body.velocity.x = -1*game.world.width/this.braIntervals[this.level];
		        }, this);
		        
		        this.pipeups.forEach(function(pipeup){
		        	pipeup.body.velocity.x = -1*game.world.width/this.braIntervals[this.level];
		        }, this);
		        
		        this.pipedowns.forEach(function(pipeDown){
		        	pipeDown.body.velocity.x = -1*game.world.width/this.braIntervals[this.level];
		        }, this);
		        
		        this.bras.forEach(function(bra) {
		        	bra.body.velocity.x = -1*game.world.width/this.braIntervals[this.level]; 
		        }, this);
		        
		        this.trees.forEach(function(tree) {
		        	tree.body.velocity.x = -1*game.world.width/this.braIntervals[this.level]; 
		        }, this);
		        
		        this.grounds.forEach(function(ground){
		        	ground.body.velocity.x = -1*game.world.width/this.bgIntervals[this.level];
		        }, this);
		        
	    	}
        }
    },
    
    check_kill_tree: function(tree) {
    	if(tree.x <= -1 * tree.width)
    	{
    		tree.kill();
    	}
    },
    
    //增加一棵背景树
    add_one_tree: function(x, y) {
    	x = x != null? x:game.world.width*3/2;
    	y = y != null? y:game.world.height-this.ground.height*0.73;
        var tree = this.trees.getFirstDead();
        if(!tree)
        {
        	tree = this.game.add.sprite(x, y, 'tree');
        	game.physics.arcade.enable(tree);
        	tree.isScaled = false;
        	this.trees.add(tree);
        }
        tree.reset(x, y);
        if(!tree.isScaled)
        {
        	tree.scale.x = game.world.width * 0.4 / tree.width;
	        tree.scale.y = tree.scale.x;
	        tree.anchor.setTo(0.5, 1);
	        tree.isScaled = true;
        }
        
        //tree.checkWorldBounds = true;
        //tree.outOfBoundsKill = true;
        tree.body.velocity.x = -1*game.world.width/this.braIntervals[this.level];
    },
    
    //增加地面背景
    add_one_ground: function(x, y) {
    	x = x != null? x:game.world.width;
    	y = y != null? y:game.world.height;
        var ground = this.grounds.getFirstDead();
        if(!ground)
        {
        	ground = this.game.add.sprite(x, y, 'ground');
        	game.physics.arcade.enable(ground);
        	this.grounds.add(ground);
        	ground.isScaled = false;
        }
        ground.reset(x, y);
        if(!ground.isScaled)
        {
        	ground.scale.x = game.world.width / ground.width;
	        ground.scale.y = ground.scale.x;
	        ground.anchor.setTo(0, 1);
	        ground.isScaled = true;
        }
        
        ground.checkWorldBounds = true;
        ground.outOfBoundsKill = true;
        ground.body.velocity.x = -1*game.world.width/this.bgIntervals[this.level];
        this.checkAndUpdateLevel();
    },
    
	//增加游戏背景场景
    /*add_one_bg: function(x, y) {
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
        bg.checkWorldBounds = true;
        bg.outOfBoundsKill = true;
        bg.body.velocity.x = -1*game.world.width/this.bgIntervals[this.level];
        this.checkAndUpdateLevel();
    },*/
    
	//增加障碍肩带
    add_one_pipe: function(x, y) {
        var pipe = this.pipes.getFirstDead();
        if(!pipe)
        {
        	pipe = this.game.add.sprite(x, y, 'pipe');
        	game.physics.arcade.enable(pipe);
        	pipe.isScaled = false;
        	this.pipes.add(pipe);
        }
        pipe.reset(x, y);
    	if(!pipe.isScaled)
    	{
    		pipe.scale.x = this.pipeWidth / pipe.width;
    		pipe.scale.y = pipe.scale.x;
    		pipe.isScaled = true;
    	}
        pipe.checkWorldBounds = true;
        pipe.outOfBoundsKill = true;
        pipe.body.velocity.x = -1*game.world.width/this.braIntervals[this.level];
    },
    //增加肩带障碍上扣子
    add_one_pipe_up: function(x, y) {
        var pipeup = this.pipeups.getFirstDead();
        if(!pipeup)
        {
        	pipeup = this.game.add.sprite(x, y, 'pipeup');
        	game.physics.arcade.enable(pipeup);
        	pipeup.isScaled = false;
        	pipeup.events.onKilled.add(function(){
        		this.isScored = false;
        	}, pipeup);
        	this.pipeups.add(pipeup);
        }
        pipeup.reset(x, y);
    	if(!pipeup.isScaled)
    	{
    		pipeup.scale.x = this.pipeWidth / pipeup.width;
    		pipeup.scale.y = pipeup.scale.x;
    		pipeup.isScaled = true;
    	}
        pipeup.checkWorldBounds = true;
        pipeup.outOfBoundsKill = true;
        pipeup.body.velocity.x = -1*game.world.width/this.braIntervals[this.level];
    },
	//增加障碍下肩带扣子
    add_one_pipe_down: function(x, y) {
        var pipedown = this.pipedowns.getFirstDead();
        if(!pipedown)
        {
        	pipedown = this.game.add.sprite(x, y, 'pipedown');
        	game.physics.arcade.enable(pipedown);
        	pipedown.isScaled = false;
        	this.pipedowns.add(pipedown);
        }
        pipedown.reset(x, y);
        if(!pipedown.isScaled)
    	{
    		pipedown.scale.x = this.pipeWidth / pipedown.width;
    		pipedown.scale.y = pipedown.scale.x;
    		pipedown.isScaled = true;
    	}
    	
        pipedown.checkWorldBounds = true;
        pipedown.outOfBoundsKill = true;
        pipedown.body.velocity.x = -1*game.world.width/this.braIntervals[this.level];
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
		bra.scale.x = game.world.width * 0.15 / bra.width;
		bra.scale.y = bra.scale.x;
    	this.bras.add(bra);
        bra.reset(x, y);
        bra.body.velocity.x = -1*game.world.width/this.braIntervals[this.level];
    },

    add_row_of_pipes: function() {
        this.checkAndUpdateLevel();
        
        this.add_one_tree();
        
        var pipeHeight = this.pipe.height;
        var holeHeight = this.bird.height * 3.3;
        var holePosY = Math.floor(Math.random()*(game.world.height * 0.8 - this.ground.height - holeHeight)) + game.world.height * 0.10;
        
        var comeBra = Math.floor(Math.random() * 3) + 2;
        if(this.comeBraIndex >= comeBra)
        {
        	var braPosY = Math.floor(Math.random()*(game.world.height * 0.75 - this.ground.height)) + game.world.height * 0.15;
       		this.add_one_bra(game.world.width*(/*2*Math.round(Math.random())+10*/11)/8, braPosY );
       		this.comeBraIndex = 0;
        }
        else
        {
        	this.comeBraIndex++;
        }
        
        //上肩带
        var pipeupHeight = this.pipeup.height;
        this.add_one_pipe_up(game.world.width, holePosY-pipeupHeight);
        var upPipeNum = Math.ceil((holePosY-pipeupHeight)/pipeHeight);
        for (var i = upPipeNum; i > 0; i--)
        {
        	this.add_one_pipe(game.world.width, holePosY-pipeupHeight - i*pipeHeight);
        }
        
        //下肩带
        var pipedownHeight = this.pipedown.height;
        var downpipePosY = holePosY + holeHeight + pipedownHeight;
        this.add_one_pipe_down(game.world.width, holePosY + holeHeight);
        var downPipeNum = Math.ceil((game.world.height - downpipePosY)/pipeHeight);
        for (var i = 0; i < downPipeNum; i++)
        {
        	this.add_one_pipe(game.world.width, downpipePosY + i*pipeHeight);
        }
        
        //this.ground.reset(0, game.world.height);
    	/*var pipeNum = Math.ceil(game.world.height / 60);
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
        this.add_one_bra(game.world.width*(11)/8, this.holeIndex*60 + (Math.round(Math.random())==1? -50:130) );
        
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
        }*/
        /*score += 1; 
        this.score_text.text = score;  */
    },
};