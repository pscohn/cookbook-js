//var game = new Phaser.Game(480, 320, Phaser.AUTO, '', { preload: preload, create: create, update: update });

Game = {};

Game.prototype = {
    globals: {
        w: 640,
        h: 480,
    }
};

var w = 640;
var h = 480;
var player;
var playerAlive = true;
var score = 0;
var scoreText;
var jumpButton;
var diamonds;
var currentDiamonds = [];
var time = 0;



function newDiamond() {
    for (var i=0; i < 2; i++) {
        var x = Math.random() * (game.world.width - 64)
        var diamond = diamonds.create(x, -50, 'diamond');
        diamond.scale.set(1.6, 1.6);
        diamond.body.gravity.y = 300;
        diamond.body.bounce.y = 0.7 + Math.random() * 0.2;
        currentDiamonds.push(diamond);
    }
}

Game.Start = function(game) { };
Game.Start.prototype = {
    preload: function() {
        this.load.image('sky', 'assets/sky.png');
        this.load.spritesheet('dude', 'assets/dude.png', 32, 48);
        this.load.image('diamond', 'assets/diamond.png');
    },
    create: function() {
        game.add.sprite(0, 0, 'sky');
        var startText = 'press up to begin';
        // text is not centered
        var startLabel = this.game.add.text(w / 4, h / 6, startText, {fontSize: '32px', fill: '#000'});
        var playerStart = game.add.sprite(w / 2, h / 4, 'dude');
        this.cursor = this.game.input.keyboard.createCursorKeys();
    },
    update: function() {
        if (this.cursor.up.isDown) {
            this.game.state.start('Play');
        }
    }
};

Game.Play = function(game) { };
Game.Play.prototype = {

    playerDie: function(player, obj) {
        player.kill();
        playerAlive = false;
        this.game.state.start('Over');
    },
    addScore: function() {
        console.log('here');
        score += 1;
        scoreText.text = 'score: ' + score
    },

    preload: function() {
//        game.load.image('sky', 'assets/sky.png');
//        game.load.image('diamond', 'assets/diamond.png');
//        game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    },

    create: function() {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.sprite(0, 0, 'sky');

        cursors = game.input.keyboard.createCursorKeys();
        jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
        scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});

        diamonds = game.add.group();
        diamonds.enableBody = true;
        newDiamond();

        player = game.add.sprite(w / 2, h / 4, 'dude');
        game.physics.arcade.enable(player);
        player.body.bounce.y = 0;
        player.body.gravity.y = 1400;
        player.body.collideWorldBounds = true;
        player.animations.add('left', [0, 1, 2, 3], 10, true);
        player.animations.add('right', [5,6,7,8], 10, true);
    },

    update: function() {
        game.physics.arcade.overlap(player, diamonds, this.playerDie, null, this);
        player.body.velocity.x = 0;

        time++;
        if (time % 100 == 0) {
            newDiamond();
        }

        if ((player.x >= game.world.width - player.width)
        ||  (player.x <= player.width/2)
        ||  (player.y >= game.world.height - player.height)
        ||  (player.y <= player.height/2)) {
            this.playerDie(player);
        }

        for (var i=0; i<currentDiamonds.length; i++) {
            if (playerAlive && currentDiamonds[i].y > game.world.height) {
                this.addScore();
                currentDiamonds[i].kill()
                currentDiamonds.splice(i, 1);
            }
        }

        if (cursors.left.isDown) {
            player.body.velocity.x = -300;
            player.animations.play('left');
        } else if (cursors.right.isDown) {
            player.body.velocity.x = 300;
            player.animations.play('right');
        } else {
            player.animations.stop();
            player.frame = 5;
        }

        if (cursors.up.isDown) {// && player.body.touching.down) {
            player.body.velocity.y = -450;
        }
    }
};

Game.Over = function(game) { };
Game.Over.prototype = {
    preload: function() {
    },
    create: function() {
        game.add.sprite(0, 0, 'sky');
        game.add.sprite(w / 2, h / 4, 'dude');
        score = 0;
        playerAlive = true;
        this.cursor = this.game.input.keyboard.createCursorKeys();
        var startText = 'press up to begin';
        // text is not centered
        var startLabel = this.game.add.text(w / 4, h / 6, startText, {fontSize: '32px', fill: '#000'});
        var gameOverText = 'game over';
        // text is not centered
        var gameOverLabel = this.game.add.text(w / 4, h / 12, gameOverText, {fontSize: '32px', fill: '#000'});
        // text is not centered
        var gameOverScoreLabel = this.game.add.text(w / 4, h - 60, scoreText.text, {fontSize: '32px', fill: '#000'});
    },
    update: function() {
        if (this.cursor.up.isDown) {
            this.game.state.start('Play');
        }
    }
};

var game = new Phaser.Game(w, h, Phaser.AUTO, 'gameContainer');
game.state.add('Start', Game.Start);
game.state.add('Play', Game.Play);
game.state.add('Over', Game.Over);
game.state.start('Start');
