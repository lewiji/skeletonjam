SkeletonWar.Game = function (game) {
};
// externalise vars for GC efficiency
var dt, bullet, enemy;
SkeletonWar.Game.prototype = {
	create: function () {
		this.bg = this.add.tileSprite(0, 0, SkeletonWar.WIDTH, SkeletonWar.HEIGHT, 'darkPurple');

		this.player = this.add.sprite(SkeletonWar.WIDTH / 8, SkeletonWar.HEIGHT / 2, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		this.player.rotation = 1.571;
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

		this.enemyPool = this.add.group();
		this.enemyPool.enableBody = true;
		this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.enemyPool.createMultiple(50, 'greenEnemy');
		this.enemyPool.setAll('anchor.x', 0.5);
		this.enemyPool.setAll('anchor.y', 0.5);
		this.enemyPool.setAll('outOfBoundsKill', true);
		this.enemyPool.setAll('checkWorldBounds', true);

		this.nextEnemyAt = 0;
		this.enemyDelay = 1000;

		this.cursors = this.input.keyboard.createCursorKeys();
	},
	update: function () {
		dt = this.time.physicsElapsed;
		this.bg.tilePosition.x -= this.player.speed * dt;

		this.physics.arcade.overlap(
			this.bulletPool, this.enemyPool, this.enemyHit, null, this
		);

		if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {
			this.nextEnemyAt = this.time.now + this.enemyDelay;
			enemy = this.enemyPool.getFirstExists(false);
			enemy.reset(SkeletonWar.WIDTH + 16, this.rnd.integerInRange(32, SkeletonWar.HEIGHT));
			enemy.body.velocity.x = this.rnd.integerInRange(-30, -60);
		}

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
	enemyHit: function (bullet, enemy) {
		bullet.kill();
		enemy.kill();
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