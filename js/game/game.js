SkeletonWar.Game = function (game) {
};
var dt, bullet;
SkeletonWar.Game.prototype = {
	create: function () {
		this.bg = this.add.tileSprite(0, 0, SkeletonWar.WIDTH, SkeletonWar.HEIGHT, 'darkPurple');

		this.player = this.add.sprite(SkeletonWar.WIDTH / 8, SkeletonWar.HEIGHT / 2, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		this.player.rotation = 1.571;
		this.player.scale = {x: 0.5, y: 0.5};
		this.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.speed = 200;
		this.player.body.collideWorldBounds = true;

		this.bulletPool = this.add.group();
		this.bulletPool.enableBody = true;
		this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.bulletPool.createMultiple(100, 'bullet');
		this.bulletPool.setAll('anchor.x', 0.5);
		this.bulletPool.setAll('anchor.y', 0.5);
		this.bulletPool.setAll('outOfBoundsKill', true);
		this.bulletPool.setAll('checkWorldBounds', true);
		this.nextShotAt = 0;
		this.shotDelay = 100;

		this.cursors = this.input.keyboard.createCursorKeys();
	},
	update: function () {
		dt = this.time.physicsElapsed;
		this.bg.tilePosition.x -= this.player.speed * dt;

		this.player.body.velocity.x = 0;
		this.player.body.velocity.y = 0;

		if (this.cursors.left.isDown) {
	      this.player.body.velocity.x = -this.player.speed;
	    } else if (this.cursors.right.isDown) {
	      this.player.body.velocity.x = this.player.speed;
	    }

	    if (this.cursors.up.isDown) {
	      this.player.body.velocity.y = -this.player.speed;
	    } else if (this.cursors.down.isDown) {
	      this.player.body.velocity.y = this.player.speed;
	    }

	    if (this.input.activePointer.isDown &&
	    	this.physics.arcade.distanceToPointer(this.player) > 15) {
	    	this.physics.arcade.moveToPointer(this.player, this.player.speed);
	    }

	    if (this.input.keyboard.isDown(Phaser.Keyboard.Z) ||
	    	this.input.activePointer.isDown) {
	    	this.fire();
	    }
	},
	fire: function () {
		if (this.nextShotAt > this.time.now) {
			return;
		}

		if (this.bulletPool.countDead() === 0) {
			return;
		}
		
		this.nextShotAt = this.time.now + this.shotDelay;

		bullet = this.bulletPool.getFirstExists(false);
		bullet.reset(this.player.x + 20, this.player.y);
		bullet.body.velocity.x = 500;
	},
	quitGame: function (pointer) {
		this.state.start('MainMenu');
	}
};