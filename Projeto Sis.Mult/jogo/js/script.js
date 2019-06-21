(function(){
    var game = new Phaser.Game(900, 790, Phaser.CANVAS, '', { preload: preload, create: create, update: update,render: render });
	game.state.add('')
var map;
var tileset;
var layer;
var player;
var facing = 'left';
var jumpTimer = 0;
var cursors;
var jumpButton;
var bg;
var stars;
var score = 0;
var scoreText;
var stateText;
var button;//var time = 15000;

var w = 800, h = 600;
var myloop;
var gameovervar;
var actualLevel = 1
var timer, timerEvent, text;
var enemies;
var enemie;


	function preload() {


	game.load.tilemap('level1', 'assets/games/starstruck/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'assets/games/starstruck/tiles-1.png');
    game.load.image('star', 'assets/games/starstruck/ring2.png');
    game.load.spritesheet('dude', 'assets/games/starstruck/dude.png', 32, 48);
    // game.load.spritesheet('dude', 'assets/games/starstruck/ninjagirl_resize3.png', 47, 68);
    game.load.spritesheet('droid', 'assets/games/starstruck/droid.png', 32, 32);
    //game.load.image('background', 'assets/games/starstruck/background2.png');
    game.load.image('background', 'assets/games/starstruck/backgrounds/gameBackground_10.png');
    // game.load.audio('sfx', 'assets/audio/SoundEffects/fx_mixdown.ogg');
    game.load.image('menu', 'assets/buttons/number-buttons-90x90.png', 270, 180);

    game.load.image('obstacle', 'enemies/mace_64_64.png', 64, 64);
   
	}

	function create(){

	 timer = game.time.create(false);
        
    // Create a delayed event 1m and 30s from now
    timerEvent = timer.add( Phaser.Timer.SECOND * 80, endTimer, this);
        
    // Start the timer
    timer.start();

	game.physics.startSystem(Phaser.Physics.ARCADE);
	game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 1344, 1100, 'background');    
    bg.fixedToCamera = true;
	
	 
	map = game.add.tilemap('level1');
    map.addTilesetImage('tiles-1');
    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('Tile Layer 1');

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 250;


    player = game.add.sprite(32, 32, 'dude');
    //player = game.add.sprite(58, 61,  'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.09;
    //player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 30, 5, 16);
    game.camera.follow(player);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);


    // ---------------- obstáculos ----------------------

    enemies = game.add.group();
    enemies.enableBody = true;
    game.physics.arcade.enable(enemies);

    var ground = enemies.create(707,127,'obstacle');
    ground.body.immovable = true;
    ground.body.allowGravity = false;
     
    var ground = enemies.create(244,93,'obstacle');
    ground.body.immovable = true;
    ground.body.allowGravity = false; 

    var ground = enemies.create(400,460,'obstacle');
    ground.body.immovable = true;
    ground.body.allowGravity = false; 
  
 
// ------------------ enemies bot --------------------- 
 
 
    droidsprite = this.add.sprite(this.world.randomX, 450, 'droid');
    droidsprite.animations.add('walk');
    this.physics.arcade.enable(droidsprite);
    droidsprite.enableBody = true;
    droidsprite.body.bounce.y = 0.2;
    droidsprite.body.gravity.y = 500;
    droidsprite.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, moveDroid, game);
 
  

// ----------------- anéis --------------------------

    stars = game.add.group();
    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;
    //  Create a star inside of the 'stars' group
    var star = stars.create(800, 203, 'star');
    star.body.allowGravity = true; 
    star.body.bounce.y = 1;
    
    var star = stars.create(900, 700, 'star');
    star.body.allowGravity = true; 
    star.body.bounce.y = 1;

    var star = stars.create(45, 800, 'star');
    star.body.allowGravity = true; 
    star.body.bounce.y = 1;

/*------------------------------------------------------*/
    //  The score
	
    scoreText = game.add.text(20, 20, 'score: 0', { fontSize: '32px', fill: '#fff' });
	scoreText.fixedToCamera = true;


    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	

	 // Create a label to use as a button
    pause_label = game.add.text(200, 20, 'Pause', { font: '24px Arial', fill: '#fff' });
    pause_label.inputEnabled = true;
	pause_label.fixedToCamera = true;
    pause_label.events.onInputUp.add(function () {
        // When the paus button is pressed, we pause the game
        game.paused = true;
       // clearInterval(inter)

		// Then add the menu
        menu = game.add.sprite(w/2, h/2, 'menu');
        menu.anchor.setTo(0.5, 0.5);

        // And a label to illustrate which menu item was chosen. (This is not necessary)
        choiseLabel = game.add.text(w/2, h-150, 'Click outside menu to continue', { font: '30px Arial', fill: '#fff' });
        choiseLabel.anchor.setTo(0.5, 0.5);
    });

    // Add a input listener that can help us return from being paused
    game.input.onDown.add(unpause, self);

    // And finally the method that handels the pause menu
    function unpause(event){
        // Only act if paused
        if(game.paused){
            // Calculate the corners of the menu
            var x1 = w/2 - 270/2, x2 = w/2 + 270/2,
                y1 = h/2 - 180/2, y2 = h/2 + 180/2;
				

            // Check if the click was inside the menu
            if(event.x > x1 && event.x < x2 && event.y > y1 && event.y < y2 ){
                // The choicemap is an array that will help us see which item was clicked
                var choisemap = ['one', 'two', 'three', 'four'];

                // Get menu local coordinates for the click
                var x = event.x - x1,
                    y = event.y - y1;

                // Calculate the choice 
                var choise = Math.floor(x / 90) + 3*Math.floor(y / 90);
                //timer.stop();

                // Display the choice
                //choiseLabel.text = 'You chose menu item: ' + choisemap[choise];
            }
            else{
                // Remove the menu and the label
                menu.destroy();
                choiseLabel.destroy();
                //timer.start();


                // Unpause the game
                game.paused = false;
                
            }
        }
    };
	
	}

    function moveDroid() {    
        //randomise the movement            
        droidmover = game.rnd.integerInRange(1, 3);    
        
        //simple if statement to choose if and which way the droid moves    
        if (droidmover == 1) {        
        droidsprite.body.velocity.x = 100;               
        droidsprite.animations.play('walk', 20, true);        
        } 
        else if(droidmover == 2) {           
        droidsprite.body.velocity.x = -100;            
        droidsprite.animations.play('walk', 20, true);     
        } 
        else {        
        droidsprite.body.velocity.x = 0;        
        droidsprite.animations.stop('walk', 20, true);    
        }   
    }     

	function update(){

    game.physics.arcade.collide(stars, layer);
    game.physics.arcade.collide(player, layer);

    game.physics.arcade.overlap(player, stars, collectStar, null, this);

    game.physics.arcade.collide(player, enemies, gameOver, null, this);    
    game.physics.arcade.collide(player, droidsprite, gameOver, null, this);


    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        player.body.velocity.x = -150;

        if (facing != 'left')
        {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (cursors.right.isDown)
    {
        player.body.velocity.x = 150;

        if (facing != 'right')
        {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else
    {
        if (facing != 'idle')
        {
            player.animations.stop();

            if (facing == 'left')
            {
                player.frame = 0;
            }
            else
            {
                player.frame = 0;
            }

            facing = 'idle';
        }
    }
    
    if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer)
    {
        player.body.velocity.y = -250;
        jumpTimer = game.time.now + 750;
    }
	
	if(score == 7){
		winPhase()
	}
}
	
	function collectStar (player, star) {
    
    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 1;
    scoreText.text = 'Score: ' + score;


}

function render(){

	//game.debug.text("Time: " + game.time.events.duration, 82, 82);

	if (timer.running) {
            game.debug.text(formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), 2, 14, "#ff0");
            console.log('time running', timer.ms)
    } else {
            game.debug.text("Done!", 2, 14, "#0f0");
    }

}

function endTimer() {
        // Stop the timer when the delayed event triggers      
        gameOver()
        console.log('time stopping', timer)
        
 }

function formatTime(s) {
        // Convert seconds (s) to a nicely formatted and padded time string
        var minutes = "0" + Math.floor(s / 60);
        var seconds = "0" + (s - minutes * 60);
        return minutes.substr(-2) + ":" + seconds.substr(-2);   
 }

function restart () {
	console.log('called restart')
 	gameOver.visible = false;
	game.paused = false;
    game.state.start(create);

	score = 0;
	 //scoreText = game.add.text(20, 20, 'score: 0', { fontSize: '32px', fill: '#fff' });
    //  And brings the aliens back from the dead :)
  
    //revives the player
    player.revive();
    //timer.refresh()
}

function gameOver() {
		gameOver = game.add.text(310, 100, 'GAME OVER', { font: '40px Arial', fill: '#fff', margin: '0 auto' });
		game.paused = true;
        game.input.onTap.addOnce(restart,this);
        
}

function winPhase() {
	game.add.text(310, 120, 'YOU WIN', { font: '40px Arial', fill: '#fff', margin: '0 auto' });		
	game.paused = true
	game.input.onTap.addOnce(restart,this);
	//game.state.start('')
	//actualLevel++;
}
// Game.Over = function(game) {};
// 	Game.Over.prototype = {  
// 	create: function() {    
// 		this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);    
// 		label = game.add.text(width / 2 , height / 2, 'Score: '+score+'\nGAME OVER\nPress SPACE to restart',{ font: '22px Lucida Console', fill: '#fff', align: 'center'});    
// 		label.anchor.setTo(0.5, 0.5);  },  
// 		update: function() {    
// 			score = 0;    
// 			if (this.spacebar.isDown)      
// 				game.state.start('Play'); 
// 		}};

}());