var game = new Phaser.Game(480, 320, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player;
var playerAlive = true;
var score = 0;
var scoreText;
var jumpButton;
var diamonds;
var currentDiamonds = [];
var time = 0;

function playerDie(player, diamond) {
    player.kill();
    playerAlive = false;
    // switch screen state for game over
}

function addScore() {
    score += 1;
    scoreText.text = 'score: ' + score
}

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

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('diamond', 'assets/diamond.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});

    diamonds = game.add.group();
    diamonds.enableBody = true;
    newDiamond();

    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0;
    player.body.gravity.y = 1400;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5,6,7,8], 10, true);
}

function update() {
    game.physics.arcade.overlap(player, diamonds, playerDie, null, this);
    player.body.velocity.x = 0;

    time++;
    if (time % 100 == 0) {
        newDiamond();
    }

    for (var i=0; i<currentDiamonds.length; i++) {
        if (playerAlive && currentDiamonds[i].y > game.world.height) {
            addScore();
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
