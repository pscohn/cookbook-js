var game = new Phaser.Game(320, 480, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var player;
var score = 0;
var scoreText;
var gravityNormal = true;
var jumpButton;
var diamonds;
var time = 0;

function playerDie(player, diamond) {
    player.kill();
    // switch screen state for game over
}

function newDiamond(x) {
    var diamond = diamonds.create(x, -50, 'diamond');
    diamond.scale.set(2, 2);
    diamond.body.gravity.y = 300;
    diamond.body.bounce.y = 0.7 + Math.random() * 0.2;
}

flipGravity = function() {
    var v = 500;
    player.body.gravity.y = -player.body.gravity.y;
    if (player.body.gravity.y > 0) {
        gravityNormal = true;
        player.body.velocity.y = -v;
    } else {
        gravityNormal = false;
        player.body.velocity.y = v;
    }
};

function preload() {
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('diamond', 'assets/diamond.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
}

function create() {
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0, 0, 'sky');
    platforms = game.add.group();
    platforms.enableBody = true;
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    ground.scale.setTo(2, 2);
    ground.body.immovable = true;

    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    jumpButton.onDown.add(flipGravity, this);
    scoreText = game.add.text(16, 16, 'score: 0', {fontSize: '32px', fill: '#000'});

    diamonds = game.add.group();
    diamonds.enableBody = true;
    newDiamond(Math.random() * game.world.width);

    player = game.add.sprite(32, game.world.height - 150, 'dude');
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0;
    player.body.gravity.y = 1400;
    player.body.collideWorldBounds = true;
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5,6,7,8], 10, true);
}

function update() {
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.overlap(player, diamonds, playerDie, null, this);
    player.body.velocity.x = 0;

    time++;
    if (time % 100 == 0) {
        newDiamond(Math.random() * game.world.width);
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
        if (gravityNormal) {
            player.body.velocity.y = -450;
        } else {
            player.body.velocity.y = 450;
        }
    }
}
