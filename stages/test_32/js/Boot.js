var BasicGame = {
    orientated: false,
    fullscreen: false,
    test: "hello hello"
};

/** add Single Global var. */
if (typeof window.HEPPOGAME == "undefined") {
    window.HEPPOGAME = BasicGame;
}

BasicGame.toggleFullscreen = function() {
    if (this.scale.isFullScreen) {
        this.scale.stopFullScreen(false);
    } else {
        this.scale.startFullScreen(false);
    }
}


BasicGame.Boot = function(game) {};

BasicGame.Boot.prototype = {

    init: function() {
        this.input.maxPointers = 1;
        this.stage.disableVisibilityChange = true;
        this.stage.backgroundColor = '#000';
    },

    preload: function() {
        this.load.image('preloader-bar', 'ui/preloadr_bar.png');
    },

    create: function() {
        this.state.start('Preloader');
    },

    enterIncorrectOrientation: function() {
        BasicGame.orientated = false;
        document.getElementById('orientation').style.display = 'block';
    },

    leaveIncorrectOrientation: function() {
        BasicGame.orientated = true;
        document.getElementById('orientation').style.display = 'none';
    }

};
