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

var gameWidth = 900;
var gameHeight = 790;
var myloop;
var gameovervar;
var actualLevel = 1
var timer, timerEvent, text;
var enemies;
var enemie;
var game;
var bgmusic;
var collect_music;

window.onload = function() {
  // game = new Phaser.Game(gameWidth, gameHeight, Phaser.AUTO, "");
  game = new Phaser.Game(900, 660, Phaser.CANVAS, '');
  game.state.add("Boot", boot);
  game.state.add("GameOver", GameOver);
  game.state.add("PlayGame", playGame);
  game.state.add("GameWin", GameWin);
  game.state.add("Level2",Level2)
  //
  game.state.start("Boot");
};

var boot = function(game) {};
boot.prototype = {
  preload: function() {
    game.load.tilemap('level1', 'assets/games/starstruck/level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles-1', 'assets/games/starstruck/tiles-1.png');
    game.load.image('star', 'assets/games/starstruck/ring2.png');
    game.load.spritesheet('dude', 'assets/ninjagirl_spritesheet2.png', 36.8, 52);

    game.load.spritesheet('droid', 'assets/games/starstruck/droid.png', 32, 32);
    game.load.image('background', 'assets/games/starstruck/backgrounds/gamebackground4_2.jpg');
	game.load.image('background2', 'assets/games/starstruck/backgrounds/gamebackground 10.png');
    // game.load.audio('sfx', 'assets/audio/SoundEffects/fx_mixdown.ogg');
    game.load.image('menu', 'assets/buttons/number-buttons-90x90.png', 270, 180);
    game.load.image('youWinBg', 'img/youWin.jpg');

    game.load.image('obstacle', 'enemies/mace_64_64.png', 64, 64);

    game.load.audio('bgmusic', ['assets/audio/naruto.mp3', 'assets/audio/naruto.ogg']);
    game.load.audio('gomusic', ['assets/audio/gonaruto.mp3', 'assets/audio/gonaruto.ogg']);
    game.load.audio('collectmusic', ['assets/audio/ring_collect.mp3', 'assets/audio/ring_collect.ogg']);

  },
  create: function() {
    this.game.state.start("PlayGame");
    collect_music = game.add.audio('collectmusic',10);
  }
};

var playGame = function(game) {}; //preload
playGame.prototype = {
  preload: function() {

  },
  create: function() {
    if (bgmusic){bgmusic.destroy();}
    bgmusic = game.add.audio('bgmusic');
    bgmusic.allowMultiple = false;

    timer = game.time.create();

    // Create a delayed event 1m and 30s from now
    timerEvent = timer.add( Phaser.Timer.SECOND * 90, endTimer, this);

    // Start the timer
    timer.start();
    bgmusic.play();

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


    // player = game.add.sprite(32, 32, 'dude');

    player = game.add.sprite(36.8, 52,  'dude');
    // player.frame = 21;

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.2;
    //player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 35, 5, 16);
    game.camera.follow(player);

    // player.animations.add('left', [0, 1, 2, 3], 10, true);
    // player.animations.add('turn', [4], 20, true);
    // player.animations.add('right', [5, 6, 7, 8], 10, true);

    player.animations.add('turn', 1 , 10, true);
    player.animations.add('right', [2,3,4,5,6,7,8,9] , 40, true);
    player.animations.add('left', [12,13,14,15,16,17,18] , 40, true);

    player.animations.play('right');

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

    droidsprite = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite.animations.add('walk');
    this.physics.arcade.enable(droidsprite);
    droidsprite.enableBody = true;
    droidsprite.body.bounce.y = 0.2;
    droidsprite.body.gravity.y = 500;
    droidsprite.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 1/2, 1000, moveDroid, game, droidsprite);

    droidsprite1 = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite1.animations.add('walk');
    this.physics.arcade.enable(droidsprite1);
    droidsprite1.enableBody = true;
    droidsprite1.body.bounce.y = 0.2;
    droidsprite1.body.gravity.y = 500;
    droidsprite1.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, moveDroid, game, droidsprite1);

    droidsprite2 = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite2.animations.add('walk');
    this.physics.arcade.enable(droidsprite2);
    droidsprite2.enableBody = true;
    droidsprite2.body.bounce.y = 0.2;
    droidsprite2.body.gravity.y = 500;
    droidsprite2.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, moveDroid, game, droidsprite2);

    droidsprite3 = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite3.animations.add('walk');
    this.physics.arcade.enable(droidsprite3);
    droidsprite3.enableBody = true;
    droidsprite3.body.bounce.y = 0.2;
    droidsprite3.body.gravity.y = 500;
    droidsprite3.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, moveDroid, game, droidsprite3);

    droidsprite4 = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite4.animations.add('walk');
    this.physics.arcade.enable(droidsprite4);
    droidsprite4.enableBody = true;
    droidsprite4.body.bounce.y = 0.2;
    droidsprite4.body.gravity.y = 500;
    droidsprite4.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, moveDroid, game, droidsprite4);

    droidsprite5 = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite5.animations.add('walk');
    this.physics.arcade.enable(droidsprite5);
    droidsprite5.enableBody = true;
    droidsprite5.body.bounce.y = 0.2;
    droidsprite5.body.gravity.y = 500;
    droidsprite5.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, moveDroid, game, droidsprite5);

    droidsprite6 = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite6.animations.add('walk');
    this.physics.arcade.enable(droidsprite6);
    droidsprite6.enableBody = true;
    droidsprite6.body.bounce.y = 0.2;
    droidsprite6.body.gravity.y = 500;
    droidsprite6.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, moveDroid, game, droidsprite6);

    droidsprite7 = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite7.animations.add('walk');
    this.physics.arcade.enable(droidsprite7);
    droidsprite7.enableBody = true;
    droidsprite7.body.bounce.y = 0.2;
    droidsprite7.body.gravity.y = 500;
    droidsprite7.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, moveDroid, game, droidsprite7);

    droidsprite8 = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite8.animations.add('walk');
    this.physics.arcade.enable(droidsprite8);
    droidsprite8.enableBody = true;
    droidsprite8.body.bounce.y = 0.2;
    droidsprite8.body.gravity.y = 500;
    droidsprite8.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, moveDroid, game, droidsprite8);    

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
	
	/*var star = stars.create(700, 203, 'star');
    star.body.allowGravity = true; 
    star.body.bounce.y = 1;
    
    var star = stars.create(500, 700, 'star');
    star.body.allowGravity = true; 
    star.body.bounce.y = 1;

    var star = stars.create(75, 800, 'star');
    star.body.allowGravity = true; 
    star.body.bounce.y = 1;

    var star = stars.create(500, 800, 'star');
    star.body.allowGravity = true; 
    star.body.bounce.y = 1;*/

    /*------------------------------------------------------*/
    //  The score

    scoreText = game.add.text(20, 20, 'Score: 0', { fontSize: '32px', fill: '#fff' });
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
    menu = game.add.sprite(gameWidth/2, gameHeight/2, 'menu');
    menu.anchor.setTo(0.5, 0.5);

        // And a label to illustrate which menu item was chosen. (This is not necessary)
        choiseLabel = game.add.text(gameWidth/2, gameHeight-150, 'Click outside menu to continue', { font: '30px Arial', fill: '#fff' });
        choiseLabel.anchor.setTo(0.5, 0.5);
      });

    // Add a input listener that can help us return from being paused
    game.input.onDown.add(unpause, self);

    // And finally the method that handels the pause menu
  },
  update: function() {

    game.physics.arcade.collide(stars, layer);
    game.physics.arcade.collide(player, layer);

    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.collide(player, enemies, gameOver, null, this);

	
    game.physics.arcade.collide(droidsprite, layer);
    game.physics.arcade.collide(player, droidsprite, gameOver, null, this);
      game.physics.arcade.collide(droidsprite1, layer);
      game.physics.arcade.collide(player, droidsprite1, gameOver, null, this);
      	game.physics.arcade.collide(droidsprite2, layer);
        game.physics.arcade.collide(player, droidsprite2, gameOver, null, this);
            game.physics.arcade.collide(droidsprite3, layer);
            game.physics.arcade.collide(player, droidsprite3, gameOver, null, this);
                game.physics.arcade.collide(droidsprite4, layer);
                game.physics.arcade.collide(player, droidsprite4, gameOver, null, this);
                    game.physics.arcade.collide(droidsprite5, layer);
                    game.physics.arcade.collide(player, droidsprite5, gameOver, null, this);
                        game.physics.arcade.collide(droidsprite6, layer);
                        game.physics.arcade.collide(player, droidsprite6, gameOver, null, this);
                            game.physics.arcade.collide(droidsprite7, layer);
                            game.physics.arcade.collide(player, droidsprite7, gameOver, null, this);
                                game.physics.arcade.collide(droidsprite8, layer);
                                game.physics.arcade.collide(player, droidsprite8, gameOver, null, this);

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

    if(score == 1){
      //winPhase()
	  phase2()
    }
  },
  render: function(){
     if (timer.running) {
        game.debug.text(formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), 2, 14, "#ff0");
    } else {
        game.debug.text("Done!", 2, 14, "#0f0");
    }

  }

}

GameOver = function(game) {};
 GameOver.prototype = {  
 create: function() {
    bgmusic.destroy();
    bgmusic = game.add.audio('gomusic');
    bgmusic.allowMultiple = false;
    bgmusic.play();

   this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);    
   label = game.add.text(gameWidth / 2 , gameHeight / 2, 'Score: '+score+'\nGAME OVER\nPress SPACE to restart',{ font: '22px Lucida Console', fill: '#fff', align: 'center'});    
   label.anchor.setTo(0.5, 0.5);
   //game.add.tileSprite(0, 0, gameWidth, gameHeight, 'youWinBg');  
     },  
   update: function() {    
     score = 0;    
     if (this.spacebar.isDown) {     
		game.state.start('PlayGame');
		//game.state.start('Level2');
	 }
}};

GameWin = function(game) {};
 GameWin.prototype = {  
 create: function() {    
   this.spacebar = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);    
   label = game.add.text(gameWidth / 2 , gameHeight / 2, 'Score: '+score+'\nYOU WIN\nPress SPACE to restart',{ font: '22px Lucida Console', fill: '#fff', align: 'center'});    
   label.anchor.setTo(0.5, 0.5);  
   game.add.tileSprite(0, 0, gameWidth, gameHeight, 'youWinBg'); },  
   update: function() {    
     score = 0;    
     if (this.spacebar.isDown){      
		game.state.start('Level2');  
	 //game.state.start('PlayGame');
	 }
}};

  function collectStar (player, star) {

    collect_music.play();

    // Removes the star from the screen
    star.kill();

    //  Add and update the score
    score += 1;
    scoreText.text = 'Score: ' + score;

  }

  function unpause(event){
        // Only act if paused
        if(game.paused){
            // Calculate the corners of the menu
            var x1 = gameWidth/2 - 270/2, x2 = gameWidth/2 + 270/2,
            y1 = gameHeight/2 - 180/2, y2 = gameHeight/2 + 180/2;


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
          }

  
 
Level2 = function(game) {};
 Level2.prototype = {
 	preload: function() {
    	game.load.tilemap('level1', 'assets/games/starstruck/level1.json', null, Phaser.Tilemap.TILED_JSON);
    	game.load.image('tiles-1', 'assets/games/starstruck/tiles-1.png');
    	game.load.image('star', 'assets/games/starstruck/ring2.png');
		game.load.spritesheet('dude', 'assets/ninjagirl_spritesheet2.png', 36.8, 52);    	
		game.load.spritesheet('droid', 'assets/games/starstruck/droid.png', 32, 32);
    	
		game.load.image('background2', 'assets/games/starstruck/backgrounds/gamebackground 10.png');
    	game.load.image('menu', 'assets/buttons/number-buttons-90x90.png', 270, 180);
    	game.load.image('youWinBg', 'img/youWin.jpg');

    	game.load.image('obstacle', 'enemies/mace_64_64.png', 64, 64);
		
		game.load.audio('bgmusic', ['assets/audio/naruto.mp3', 'assets/audio/naruto.ogg']);
		game.load.audio('gomusic', ['assets/audio/gonaruto.mp3', 'assets/audio/gonaruto.ogg']);
		game.load.audio('collectmusic', ['assets/audio/ring_collect.mp3', 'assets/audio/ring_collect.ogg']);
  		},
  	create: function() {
    
	collect_music = game.add.audio('collectmusic',10);
	
	 if (bgmusic){bgmusic.destroy();}
    bgmusic = game.add.audio('bgmusic');
    bgmusic.allowMultiple = false;

    timer = game.time.create();

    // Create a delayed event 1m and 30s from now
    timerEvent = timer.add( Phaser.Timer.SECOND * 90, endTimer, this);

    // Start the timer
    timer.start();
    bgmusic.play();

     game.physics.startSystem(Phaser.Physics.ARCADE);
    game.stage.backgroundColor = '#000000';

    bg = game.add.tileSprite(0, 0, 1344, 1100, 'background2');    
    bg.fixedToCamera = true;


    map = game.add.tilemap('level1');
    map.addTilesetImage('tiles-1');
    map.setCollisionByExclusion([ 13, 14, 15, 16, 46, 47, 48, 49, 50, 51 ]);

    layer = map.createLayer('Tile Layer 1');

    layer.resizeWorld();

    game.physics.arcade.gravity.y = 250;


    player = game.add.sprite(36.8, 52,  'dude');
    // player.frame = 21;

    game.physics.enable(player, Phaser.Physics.ARCADE);
    player.body.bounce.y = 0.2;
    //player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 35, 5, 16);
    game.camera.follow(player);

    // player.animations.add('left', [0, 1, 2, 3], 10, true);
    // player.animations.add('turn', [4], 20, true);
    // player.animations.add('right', [5, 6, 7, 8], 10, true);

    player.animations.add('turn', 1 , 10, true);
    player.animations.add('right', [2,3,4,5,6,7,8,9] , 40, true);
    player.animations.add('left', [12,13,14,15,16,17,18] , 40, true);

    player.animations.play('right');


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

    droidsprite = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite.animations.add('walk');
    this.physics.arcade.enable(droidsprite);
    droidsprite.enableBody = true;
    droidsprite.body.bounce.y = 0.2;
    droidsprite.body.gravity.y = 500;
    droidsprite.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 1/2, 1000, moveDroid, game, droidsprite);

    droidsprite1 = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite1.animations.add('walk');
    this.physics.arcade.enable(droidsprite1);
    droidsprite1.enableBody = true;
    droidsprite1.body.bounce.y = 0.2;
    droidsprite1.body.gravity.y = 500;
    droidsprite1.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, moveDroid, game, droidsprite1);

    droidsprite2 = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite2.animations.add('walk');
    this.physics.arcade.enable(droidsprite2);
    droidsprite2.enableBody = true;
    droidsprite2.body.bounce.y = 0.2;
    droidsprite2.body.gravity.y = 500;
    droidsprite2.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, moveDroid, game, droidsprite2);

    droidsprite3 = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite3.animations.add('walk');
    this.physics.arcade.enable(droidsprite3);
    droidsprite3.enableBody = true;
    droidsprite3.body.bounce.y = 0.2;
    droidsprite3.body.gravity.y = 500;
    droidsprite3.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, moveDroid, game, droidsprite3);

    droidsprite4 = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite4.animations.add('walk');
    this.physics.arcade.enable(droidsprite4);
    droidsprite4.enableBody = true;
    droidsprite4.body.bounce.y = 0.2;
    droidsprite4.body.gravity.y = 500;
    droidsprite4.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, moveDroid, game, droidsprite4);

    droidsprite5 = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite5.animations.add('walk');
    this.physics.arcade.enable(droidsprite5);
    droidsprite5.enableBody = true;
    droidsprite5.body.bounce.y = 0.2;
    droidsprite5.body.gravity.y = 500;
    droidsprite5.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, moveDroid, game, droidsprite5);

    droidsprite6 = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite6.animations.add('walk');
    this.physics.arcade.enable(droidsprite6);
    droidsprite6.enableBody = true;
    droidsprite6.body.bounce.y = 0.2;
    droidsprite6.body.gravity.y = 500;
    droidsprite6.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, moveDroid, game, droidsprite6);

    droidsprite7 = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite7.animations.add('walk');
    this.physics.arcade.enable(droidsprite7);
    droidsprite7.enableBody = true;
    droidsprite7.body.bounce.y = 0.2;
    droidsprite7.body.gravity.y = 500;
    droidsprite7.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, moveDroid, game, droidsprite7);

    droidsprite8 = this.add.sprite((this.world.randomX + 200), 0, 'droid');
    droidsprite8.animations.add('walk');
    this.physics.arcade.enable(droidsprite8);
    droidsprite8.enableBody = true;
    droidsprite8.body.bounce.y = 0.2;
    droidsprite8.body.gravity.y = 500;
    droidsprite8.body.collideWorldBounds = true;
    game.time.events.repeat(Phaser.Timer.SECOND * 3, 10, moveDroid, game, droidsprite8);    

    // ----------------- anéis --------------------------

    stars = game.add.group();
    //  We will enable physics for any star that is created in this group
    stars.enableBody = true;
    //  Create a star inside of the 'stars' group
   /* var star = stars.create(800, 203, 'star');
    star.body.allowGravity = true; 
    star.body.bounce.y = 1;
    
    var star = stars.create(900, 700, 'star');
    star.body.allowGravity = true; 
    star.body.bounce.y = 1;

    var star = stars.create(45, 800, 'star');
    star.body.allowGravity = true; 
    star.body.bounce.y = 1;*/

//others
    var star = stars.create(800, 100, 'star');
    star.body.allowGravity = true; 
    star.body.bounce.y = 1;

    var star = stars.create(45, 500, 'star');
    star.body.allowGravity = true; 
    star.body.bounce.y = 1;

    var star = stars.create(500, 700, 'star');
    star.body.allowGravity = true; 
    star.body.bounce.y = 1;

     var ground = enemies.create(400,460,'obstacle');
    ground.body.immovable = true;
    ground.body.allowGravity = false; 
    /*------------------------------------------------------*/
    //  The score

    scoreText = game.add.text(20, 20, 'Score: 3', { fontSize: '32px', fill: '#fff' });
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
    menu = game.add.sprite(gameWidth/2, gameHeight/2, 'menu');
    menu.anchor.setTo(0.5, 0.5);

        // And a label to illustrate which menu item was chosen. (This is not necessary)
        choiseLabel = game.add.text(gameWidth/2, gameHeight-150, 'Click outside menu to continue', { font: '30px Arial', fill: '#fff' });
        choiseLabel.anchor.setTo(0.5, 0.5);
      });

    // Add a input listener that can help us return from being paused
    game.input.onDown.add(unpause, self);

    // And finally the method that handels the pause menu
  },
  update: function() {

	game.physics.arcade.collide(stars, layer);
    game.physics.arcade.collide(player, layer);

    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    game.physics.arcade.collide(player, enemies, gameOver, null, this);
	
	game.physics.arcade.collide(droidsprite, layer);
    game.physics.arcade.collide(player, droidsprite, gameOver, null, this);
      game.physics.arcade.collide(droidsprite1, layer);
      game.physics.arcade.collide(player, droidsprite1, gameOver, null, this);
      	game.physics.arcade.collide(droidsprite2, layer);
        game.physics.arcade.collide(player, droidsprite2, gameOver, null, this);
            game.physics.arcade.collide(droidsprite3, layer);
            game.physics.arcade.collide(player, droidsprite3, gameOver, null, this);
                game.physics.arcade.collide(droidsprite4, layer);
                game.physics.arcade.collide(player, droidsprite4, gameOver, null, this);
                    game.physics.arcade.collide(droidsprite5, layer);
                    game.physics.arcade.collide(player, droidsprite5, gameOver, null, this);
                        game.physics.arcade.collide(droidsprite6, layer);
                        game.physics.arcade.collide(player, droidsprite6, gameOver, null, this);
                            game.physics.arcade.collide(droidsprite7, layer);
                            game.physics.arcade.collide(player, droidsprite7, gameOver, null, this);
                                game.physics.arcade.collide(droidsprite8, layer);
                                game.physics.arcade.collide(player, droidsprite8, gameOver, null, this);

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
  },
  render: function(){
     if (timer.running) {
        game.debug.text(formatTime(Math.round((timerEvent.delay - timer.ms) / 1000)), 2, 14, "#ff0");
    } else {
        game.debug.text("Done!", 2, 14, "#0f0");
    }

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


function gameOver() {
    game.state.start("GameOver")
        
}
function phase2() {
    game.state.start("Level2")
        
}

function winPhase() {
  game.state.start("GameWin")
}

function moveDroid(droid) {    
  //randomise the movement            
  droidmover = game.rnd.integerInRange(1, 3);    
  //simple if statement to choose if and which way the droid moves


	  if (droidmover == 1) { 
	  console.log('DIR');
	  droid.body.velocity.x = 100;               
	  droid.animations.play('walk', 20, true);        
	  } 
	  else if(droidmover == 2) {    
		console.log('ESQ');
	  droid.body.velocity.x = -100;            
	  droid.animations.play('walk', 20, true);     
	  } 
	  else {        
	  console.log('STOP');
	  droid.body.velocity.x = 0;        
	  droid.animations.stop('walk', 20, true);    
	  }
     
} 