BasicGame.Preloader = function(game) {

    this.preloadBar = null;

    this.ready = false;

};

BasicGame.Preloader.prototype = {

    preload: function() {

        // Create a progress bar based on cropping on image
        this.preloadBar =
            this.add.sprite(this.game.width / 2, this.game.height / 2, 'preloader-bar');
        this.preloadBar.pivot.x = this.preloadBar.width / 2;
        this.preloadBar.pivot.y = this.preloadBar.height / 2;

        this.load.setPreloadSprite(this.preloadBar);

        // Load game assets here...
        this.load.image('background', 'images/background.png');
        this.load.image('dialog', 'ui/dialog.png');

        this.load.spritesheet('bot', 'images/heppo.png', 32, 32);
        this.load.spritesheet('buttonImage', 'ui/button_dialog.png', 98, 43);
        this.load.image('dot', 'images/burstDot.png');

        this.load.tilemap('map', 'images/stage.json', null,Phaser.Tilemap.TILED_JSON)
        this.load.image('tiles', 'images/stageTileSet.png');
        this.load.image('energyBall', 'images/energyBall.png');

        this.load.audio('jumpSound', ['audio/GB-Action01-01(Jump).mp3']);
        this.load.audio('getSound', ['audio/GB-Action01-03(Throw).mp3']);
        this.load.audio('crashSound', ['audio/GB-Action01-10(Door).mp3']);

    },

    create: function() {

        this.preloadBar.cropEnabled = false;
        this.state.start('Game');

    },

};
