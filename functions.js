function createYellow_Key(){

    key_yellow = keys2.create(1500,0, "keys")
    game.physics.enable(key_yellow, Phaser.Physics.ARCADE);
    key_yellow.body.velocity.setTo(0, 200);
    key_yellow.body.collideWorldBounds = true;
    key_yellow.body.bounce.set(0.6);
    key_yellow.body.gravity.set(0, 500);
    key_yellow.scale.setTo(0.09);
    
    }