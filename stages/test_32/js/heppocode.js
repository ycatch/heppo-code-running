var heppo = {};

var blocklyArea = document.getElementById('blocklyArea');
// var blocklyDiv = document.getElementById('blocklyDiv');
var blocklyDiv = document.getElementById('blocklyDiv');
var toolboxText = document.getElementById('toolbox').outerHTML;
var toolboxXml = Blockly.Xml.textToDom(toolboxText);
var workspace = Blockly.inject(blocklyDiv, {
    media: '../../media/',
    toolbox: toolboxXml,
    collapse: true,
    comments: true,
    disable: false,
    maxBlocks: Infinity,
    trashcan: true,
    horizontalLayout: false,
    toolboxPosition: 'start',
    css: true,
    media: 'https://blockly-demo.appspot.com/static/media/',
    rtl: false,
    scrollbars: true,
    sounds: true,
    oneBasedIndex: true,
    grid: {
        spacing: 20,
        length: 1,
        colour: '#888',
        snap: true
    },
    zoom: {
        controls: true,
        wheel: false,
        startScale: 1,
        maxScale: 3,
        minScale: 0.3,
        scaleSpeed: 1.2
    }
});

Blockly.Xml.domToWorkspace(document.getElementById('startBlocks'), workspace);

/* Get code text*/
heppo.getCode = function() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var codeText = Blockly.JavaScript.workspaceToCode(workspace);
    return codeText;
};

/* Run code text */
heppo.execCodeBlock = function() {
    window.LoopTrap = 1000;
    Blockly.JavaScript.INFINITE_LOOP_TRAP = 'if (--window.LoopTrap == 0) throw "Infinite loop.";\n';
    var codeText = heppo.getCode();
    var exec = new Function(codeText);
    exec();
};

// Generate JavaScript code and display it.
var setCode = function() {
    var codeText = heppo.getCode();
    var codeDiv = $("#codeDiv");
    codeDiv.text(codeText);
    codeDiv.each(function(i, block) {
        hljs.highlightBlock(block);
    });
};

var init = function() {
    // smooth scroll for navibar
    $('a[href^="#edit"]').click(function() {
        var speed = 500;
        var href = $(this).attr("href");
        var target = $(href == "#" || href == "" ? 'html' : href);
        var position = target.offset().top;
        $("html, body").animate({
            scrollTop: position
        }, speed, "swing");
        return false;
    });

    $('a[href^="#top"]').click(function() {
        $('html,body').animate({scrollTop:0}, 'swing' ) ;
    });

    /** add Single Global var. */
    if (typeof window.HEPPO == "undefined") {
        window.HEPPO = heppo;
    }

    // setting for phaser.js
    var game = new Phaser.Game(1024, 576, Phaser.AUTO, 'gameContainer');

    game.state.add('Boot', BasicGame.Boot);
    game.state.add('Preloader', BasicGame.Preloader);
    game.state.add('MainMenu', BasicGame.MainMenu);
    game.state.add('Game', BasicGame.Game);

    game.state.start('Boot');

    /** add Single Global var. */
    if (typeof window.HEPPO2 == "undefined") {
        window.HEPPO2 = game;
    }

    //rshow to Code tab
    $("#blockly_code_tab").click(function() {
        setCode();
    });

    $(window).scrollTop(0);
    workspace.resizeContents();
    setCode();
}

init();
