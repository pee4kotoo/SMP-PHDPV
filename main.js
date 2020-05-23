
'use strict'
const game = new Phaser.Game(1400, 650, Phaser.AUTO, 'game-canvas', { preload, create, update })

let cursors, player
let groundLayer //за взаимодействие на тази земя с играча
let groundLayer2
let groundLayer3
let ground
var jumpTimer = 0;
var jumpButton;
var key_blue
var key_yellow
var keys
var keys2
var score = 0;
var stateText
var setText
var text
var pickup_sound
var jump_sound
var win_sound
const playerSpeed = 150

function preload() {
    game.load.tilemap('tilemap', 'tilemap.json', null, Phaser.Tilemap.TILED_JSON)
    game.load.image('tileset', '32x32_tileset_mario.png')
    game.load.spritesheet("mario", "mario.png", 150/5, 123/3)
    game.load.image("background", "background.png")
    game.load.spritesheet("keys", "key.png", 81/1, 2443/18)
    game.load.audio("pickup_sound", "keypickup.wav")
    game.load.audio("jump","jump.wav")
    game.load.audio("win", "win.wav")
    game.load.image('playButton', 'Resources/button.png')
    game.load.image('tryAgainButton', 'Resources/tryAgainButton.png')
    game.load.image('nextLevelButton', 'Resources/nextLevelButton.png')
}


function createBlue_Key(){

key_blue = keys.create(100,0, "keys")
game.physics.enable(key_blue, Phaser.Physics.ARCADE);
key_blue.body.velocity.setTo(0, 200);
key_blue.body.collideWorldBounds = true;
key_blue.body.bounce.set(0.6);
key_blue.body.gravity.set(0, 500);
key_blue.scale.setTo(0.09);

}

function createYellow_Key(){

    key_yellow = keys2.create(1500,0, "keys")
    game.physics.enable(key_yellow, Phaser.Physics.ARCADE);
    key_yellow.body.velocity.setTo(0, 200);
    key_yellow.body.collideWorldBounds = true;
    key_yellow.body.bounce.set(0.6);
    key_yellow.body.gravity.set(0, 500);
    key_yellow.scale.setTo(0.09);
    
    }



function create() {
    let bg = game.add.image(0,0,"background")
    bg.scale.setTo(8, 8)
    game.physics.startSystem(Phaser.Physics.ARCADE);

    text = game.add.text(40, 25, score);
    text.fixedToCamera = true;

    pickup_sound = game.add.audio("pickup_sound");
    jump_sound = game.add.audio("jump")
    win_sound = game.add.audio("win")

//  Text
stateText = game.add.text(440, 200, "YOU WIN!", {
    font: "84px Arial",
    fill: "#fffffffffffffffffff"
});
stateText.scale.setTo(1);
stateText.anchor.setTo(0.5, 0.5);
stateText.visible = false;
stateText.fixedToCamera = true;


keys = game.add.physicsGroup();
for (var i = 0; i < 15; i++) {
    createBlue_Key();
}
  
keys2 = game.add.physicsGroup();
for (var i = 0; i < 15; i++) {
    createYellow_Key();
}
  
    //
    //
    //
    game.scale.pageAlignHorizontally = true
    game.stage.backgroundColor = "#fff"
    createMap()
    createPlayer()
    cursors = game.input.keyboard.createCursorKeys()


    key_blue.animations.add("still", [1,3,5,7,9,11,13,15,17], 7, true)
    key_yellow.animations.add("still2", [0,2,4,6,8,10,12,14,16], 7, true)
    key_blue.animations.play("still")
    key_yellow.animations.play("still2")
    key_blue.scale.setTo(0.4)
    key_yellow.scale.setTo(0.4)

    player.animations.add('Right', [3,8,11], 15, true);
    player.animations.add('Left', [2,7,10], 15, true);
    player.animations.add('Jump', [9], 12, true);
    player.animations.add('Still', [1], 12, true);
    player.animations.add('Crouch', [6], 12, true);
    player.scale.setTo(1.3)


    game.world.setBounds(0, 0, 1920, 1920);

    game.physics.startSystem(Phaser.Physics.P2JS)
    game.physics.p2.enable(player);
    game.physics.arcade.gravity.y = 600;
    game.physics.enable (player, Phaser.Physics.ARCADE);

    game.camera.follow(player);

    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)    

}
 //създаваме карта
const createMap = function () {
    const map = game.add.tilemap('tilemap') //създаваме я като променлива, името го взимаме от load
    map.addTilesetImage('mario4', 'tileset') //json файла в name, второто ключа на image.png 
    groundLayer = map.createLayer(0) //кой леър искам да нарисувам, сега е нулевия
    groundLayer2 = map.createLayer(1) //кой леър искам да нарисувам, сега първи
    
    map.setCollisionByExclusion([0, -1]) //




}

const createPlayer = function () {
    player = game.add.sprite(800, 1200, 'mario')
    player.anchor.setTo(0.5)
    player.scale.setTo(0.7)
    game.physics.enable(player) //това позволява на играча да има някаква включена физика, иначе не можем да ползваме body
    player.body.gravity.y = 900
    
    player.body.collideWorldBounds = true
}



function update() {
    var hitGround = game.physics.arcade.collide(player, groundLayer) //двата параметъра да си взаимодействат
    movePlayer()

    game.physics.arcade.collide(player, groundLayer2) //двата параметъра да си взаимодействат
    

//blue key collide
    game.physics.arcade.collide(
        keys,
        player,

        function(player, key_blue) {
            key_blue.kill();
            pickup_sound.play();
            score += 1;
            text.setText(score);
        },
        null,
        this
    );
   
   
    game.physics.arcade.collide(
        keys,
        groundLayer,

        function(groundLayer, keys) {},
        null,
        this
    );


    if (score == 2) {
        stateText.visible = true;
        win_sound.play()

    }

    //yellow key collide
    game.physics.arcade.collide(
        keys2,
        groundLayer,

        function(groundLayer, keys2) {},
        null,
        this
    );

    game.physics.arcade.collide(
        keys2,
        player,

        function(player, key_yellow) {
            key_yellow.kill();
            pickup_sound.play();
            score += 1;
            text.setText(score);
        },
        null,
        this
    );
   

    

}

const movePlayer = function () {
    if (game.input.keyboard.isDown(Phaser.Keyboard.D))
    {
        player.animations.play("Right")
    }
  else if (game.input.keyboard.isDown(Phaser.Keyboard.A)){
      player.animations.play("Left")
   } 
    
   
   else if (game.input.keyboard.isDown(Phaser.Keyboard.UP)){
    player.animations.play("Jump")
 } 
 else if (game.input.keyboard.isDown(Phaser.Keyboard.S)){
    player.animations.play("Crouch")
 } 
   else{
       player.animations.play("Still")
 
   }


   if (game.input.keyboard.isDown(Phaser.Keyboard.A))
   {
       player.x -= 4;
   }
   else if (game.input.keyboard.isDown(Phaser.Keyboard.D))
   {
       player.x += 4;
   }
  
   if (jumpButton.isDown && player.body.onFloor() && game.time.now > jumpTimer) {
    player.body.velocity.y = -690;
    jumpTimer = game.time.now + 750;
    jump_sound.play();
}

}

function render() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);
}