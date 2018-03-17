
BasicGame.Game = function (game) {

    //  When a State is added to Phaser it automatically has the following properties set on it, even if they already exist:

    this.game;      //  a reference to the currently running game (Phaser.Game)
    this.add;       //  used to add sprites, text, groups, etc (Phaser.GameObjectFactory)
    this.camera;    //  a reference to the game camera (Phaser.Camera)
    // this.cache;     //  the game cache (Phaser.Cache)
    this.input;     //  the global input manager. You can access this.input.keyboard, this.input.mouse, as well from it. (Phaser.Input)
    // this.load;      //  for preloading assets (Phaser.Loader)
    // this.math;      //  lots of useful common math operations (Phaser.Math)
    // this.sound;     //  the sound manager - add a sound, play one, set-up markers, etc (Phaser.SoundManager)
    // this.stage;     //  the game stage (Phaser.Stage)
    this.time;      //  the clock (Phaser.Time)
    // this.tweens;    //  the tween manager (Phaser.TweenManager)
    this.state;     //  the state manager (Phaser.StateManager)
    this.world;     //  the game world (Phaser.World)
    // this.particles; //  the particle manager (Phaser.Particles)
    this.physics;   //  the physics manager (Phaser.Physics)
    this.rnd;       //  the repeatable random number generator (Phaser.RandomDataGenerator)

	this._background = null;
    this._groundBarrier = null;
    this._map = null;
    this._ground = null;
    this._energy = null;
    this._energyCount = 0;

	this._player = null;
    this._radarBall = null;
    this._radarBallID = null;
    this._radarWall = null;
    this._radarWallID = null;
	this._input = null;

	this._scoreText = null;
    this._goalDistance = 4800;
    this._state = null;

    this._dialog = null;
    this._dialog_start = null;
    this._dialog_goal = null;
    this._dialog_stop = null;
    this._emitter;
    this._emitter_flag = true;

    this._exec;

    this.debug = null;
};

BasicGame.Game.prototype = {

    create: function () {
        this.forceSingleUpdate = false;
        this.physics.startSystem(Phaser.Physics.ARCADE);

		// background plate
		this._background = this.add.tileSprite(0, 0, 1024, 576, 'background');

        //  Create our map & layer
 		this._map = this.add.tilemap('map');
        this._map.addTilesetImage('tileset', 'tiles');
        this._map.setCollisionBetween(1, 3, true, 0, true);
		this._ground = this._map.createLayer('ground');
		this._ground.resizeWorld();

        // create energy group
        this._energy = this.add.group();
        this._energy.enableBody = true;
        this._map.createFromObjects('energy', 4, 'energyBall', 0, true, false, this._energy);

        // ** The player settings **
        this._player = this.add.sprite(500, this.world.height - 400, 'bot');
        this.physics.enable(this._player);
		this._player.body.bounce.y = 0.15;
		this._player.body.gravity.y = 600;
		this._player.body.collideWorldBounds = true;

        // ** radar for check Energy-Ball **
        this._radarBall = this.add.sprite(481, this.world.height - 300, 'radarBall');
        this.physics.enable(this._radarBall);
		// this._radarBall.body.collideWorldBounds = true;

        // ** radar for check Wall **
        this._radarWall = this.add.sprite(481, this.world.height - 300, 'radarWall');
        this.physics.enable(this._radarWall);
		// this._radarWall.body.collideWorldBounds = true;

        // ** FPS & score
		this.time.advancedTiming = true;
		this._scoreText = this.add.text(5, 16, 'Distance: 0m', { font: '32px  pixelmplus10regular', fill: '#000' });

        // enable physics on emitter for crash
        this._emitter = this.add.emitter(0, 0, 10);
        this._emitter.makeParticles('dot');
        this._emitter.gravity = 500;
        this._emitter.setXSpeed(-50, 50);
        this._emitter.setYSpeed(-300, -100);
        this._emitter.setRotation(0, 0);

		// set animations, walking right.
		this._player.animations.add('right', [0, 1, 2, 3,], 10, true);
		// this.input.onDown.add(this.jumpPlayer, this);

		this.getSound = this.add.audio('getSound');
		this.jumpSound = this.add.audio('jumpSound');

        // add dialog-boxies
        this.initDialogs();

        this._state = "start";
    },

    update: function () {
        if (this._state == "start") {
            this.loadCodeBlock();
            this.collideBot();
            this._dialog_start.visible = true;
        }
        else if (this._state == "goal") {
            this.collideBot();
            this.execCodeBlock();
            this._dialog_goal.x = this.camera.x;
            this._dialog_goal.visible = true;

            // Wining Run
            if ((this.camera.x - this._goalDistance) % 320 <= 2) {
                this.moveBackPlane(this._goalDistance);

                this._dialog_goal.x = this._goalDistance;
                this._player.body.x = this.camera.x + 500;
            }
        }
        else if (this._state == "crash") {
            this.collideBot();

            if (this._emitter_flag = true) {
                this._emitter.x = this._player.body.x + 15;
                this._emitter.y = this._player.body.y;
                this._player.visible = false;
                this._emitter_flag = false;
                this.particleBurst();
            }

            this._dialog_stop.x = this.camera.x;
            this.time.events.add(Phaser.Timer.SECOND * 1, function(){this._dialog_stop.visible = true}, this);

        }
        // main loop
        else {
            this.execCodeBlock();
            this.collideBot();
            this.setStatus();
            this._scoreText.text = 'Distance:' + this.camera.x + 'm';
        }
    },

    /** Update method **/
    startLoop: function () {
        this._dialog_start.visible = false;

        this._player.body.y = this.world.height - 100;
        this._state = "loop";
    },

    setStatus: function () {
        // check crash
        // if(this._player.body.x <= this.camera.x + 10) {
        if(this._player.body.blocked.right) {
            this._state = "crash";
        }

        // check goal
        if(this.camera.x >= this._goalDistance) {
            this._state = "goal";
        }
    },

    //  Collide the player and the blocks with the platforms
    collideBot: function () {
        this.physics.arcade.TILE_BIAS = 40;
        this.physics.arcade.collide(this._player, this._ground);
        this.physics.arcade.overlap(this._player, this._energy, this.collectBall, null, this);
    },

	jumpPlayer: function(player) {
		if (this._player.body.touching.down || this._player.body.blocked.down) {
			this.jumpSound.play();
			this._player.body.velocity.y = -260;
		}
	},

    // Removes the ball from the screen
    collectBall: function(player, ball) {
        ball.kill();
        this._energyCount += 1;
    },

    quitGame: function () {
        this._dialog_goal.visible = false;
        this._dialog_stop.visible = false;
        this.game.paused = false;
        this.state.start('Preloader');
    },

    backtoMenu: function () {
        this._dialog_goal.visible = false;
        this._dialog_stop.visible = false;
        this.game.paused = false;
        window.location.href = "..";
    },

    render: function() {
        this.game.debug.text('FPS:' + this.game.time.fps , 16, 70, "#00ff00", "16px Courier");
        this.game.debug.text('State:' + this._state , 16, 85, "#00ff00", "16px Courier");
        this.game.debug.text('Energy:' + this._energyCount , 16, 100, "#00ff00", "16px Courier");
        // this.game.debug.text('X:' + this._player.body.x, 16, 115, "#00ff00", "16px Courier");
        // this.game.debug.text('Y:' + this._player.body.y, 16, 130, "#00ff00", "16px Courier");
    },

    /**
        Bot's action
    */

    runFoward: function (move_step) {
        this._player.body.x += move_step;
        this._player.animations.play('right');
        this.moveBackPlane(this.camera.x + move_step);
        this._background.tilePosition.x -= move_step / 2;
    },

    jumpFoward: function () {
        this.physics.arcade.collide(this._player, this._ground);
        this.jumpPlayer(this);
    },

    isBall: function () {
        this._radarBallID = null;
        this._radarBall.body.x = this._player.body.x + 32;
        this._radarBall.body.y = this._player.body.y - 32;
        this.physics.arcade.overlap(this._radarBall, this._energy, function() {this._radarBallID = 1;}, null, this);
        return this._radarBallID;
    },

    isWall: function () {
        var tile_x = Math.round(this._player.body.x / 32) + 2;
        var tile_y = Math.round(this._player.body.y / 32);
        return this._map.getTile(tile_x, tile_y, 0);
    },

    moveBackPlane: function (position) {
        this.camera.x = position;
        this._background.x = position;
        this._scoreText.x = this.camera.x + 16;
    },

    loadCodeBlock: function () {
        window.LoopTrap = 1000;
        Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
        var codeText = HEPPO.getCode().replace( /_self/g , "HEPPO2.state.states.Game");

        // HEPPO2.state.states.Game
        this._exec = new Function(codeText);
    },

    execCodeBlock: function () {
        this._exec();
    },

    /**
        Particles for crash
    */

    particleBurst: function () {
        this._emitter.start(true, 0, null, 10);
        this.time.events.add(2000, function() {
            this._emitter.kill();
        }, this);
    },


    /**
        Dialog for stage state
    */

    initDialogs: function () {
        var dialogBG;
        var button_x;
        var button_y;
        var captionText;
        var buttonMessage;

        /** Start! dialogbox **/
        captionText = "ゴールまで、ロボットを走らせろ";
        buttonMessage = ['Start','Menu'];
        this._dialog_start = this.setDialogLayout('Stage10', captionText);

        dialogBG = this._dialog_start.getAt(0);
        button_y = dialogBG.y + dialogBG.height * 0.28;

        // button right
        button_x = dialogBG.x + 140;
        this.setButton(this._dialog_start, button_x, button_y, buttonMessage[0], this.startLoop);
        // button left
        button_x = dialogBG.x - 140;
        this.setButton(this._dialog_start, button_x, button_y, buttonMessage[1], this.backtoMenu);


        /** Crash dialogbox **/
        captionText = " おしい！あとちょっと！";
        buttonMessage = ['Retry','Menu'];
        this._dialog_stop = this.setDialogLayout('Crash!', captionText);

        dialogBG = this._dialog_stop.getAt(0);
        button_y = dialogBG.y + dialogBG.height * 0.28;

        // button center
        button_x = dialogBG.x;
        this.setButton(this._dialog_stop, button_x, button_y, buttonMessage[0], this.quitGame);
        // button left
        button_x = dialogBG.x - 140;
        this.setButton(this._dialog_stop, button_x, button_y, buttonMessage[1], this.backtoMenu);


        /** Goal! dialogbox **/
        captionText = " ゴールクリア！おめでとう！";
        buttonMessage = ['Retry','Menu','Next'];
        this._dialog_goal = this.setDialogLayout('Goal!', captionText);

        dialogBG = this._dialog_goal.getAt(0);
        button_y = dialogBG.y + dialogBG.height * 0.28;

        // button right
        button_x = dialogBG.x + 140;
        this.setButton(this._dialog_goal, button_x, button_y, buttonMessage[2], function(){alert("go to next stage")});
        // button center
        button_x = dialogBG.x;
        this.setButton(this._dialog_goal, button_x, button_y, buttonMessage[0], this.quitGame);
        // button left
        button_x = dialogBG.x - 140;
        this.setButton(this._dialog_goal, button_x, button_y, buttonMessage[1], this.backtoMenu);
    },

    setDialogLayout: function (title, caption) {
        var dialog = this.add.group();

        var background = this.add.image(this.camera.width / 2, this.world.centerY, 'dialog');
        background.anchor.setTo(0.5);
        dialog.add(background); // set index = 0

        var titleText = this.add.text(
            background.x, background.y - background.height * 0.2, title,
            { font: '48px pixelmplus10regular', fill: '#fff'}
        );
        titleText.anchor.setTo(0.5);
        dialog.add(titleText);

        var tagline = this.add.text(
            background.x, background.y, caption,
            { font: '24px pixelmplus10regular', fill: '#fff'}
        );
        tagline.anchor.setTo(0.5);
        dialog.add(tagline);

        dialog.visible = false;
        return dialog;
    },

    setButton: function (dialog, x, y, message, action) {
        var button = this.add.button(x, y, 'buttonImage', action, this, 1, 0);
        button.anchor.setTo(0.5);
        dialog.add(button);

        var buttonText = this.add.text(
            x + 3, y + 3, message + "!",
            { font: '24px pixelmplus10regular', fill: '#fff'}
        );
        buttonText.anchor.setTo(0.5);
        dialog.add(buttonText);
    }

};
