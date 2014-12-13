SkeletonWar.Game = function (game) {
};
// externalise vars for GC efficiency
var dt, bullet, enemy, explosion;
SkeletonWar.Game.prototype = {
	create: function () {
		this.createBackground();
		this.createPlayer();
		this.createBullets();
		this.createEnemies();
		this.setupPlayerIcons();
		this.cursors = this.input.keyboard.createCursorKeys();
		
	},
	setupPlayerIcons: function () {
		this.lives = this.add.group();
		var firstLifeIconX = this.game.width - 10 - (SkeletonWar.PLAYER_EXTRA_LIVES * 30);
		for (var i = 0; i < SkeletonWar.PLAYER_EXTRA_LIVES; i++) {
			var life = this.lives.create(firstLifeIconX + (30 * i), 30, 'player');
			life.scale.setTo(0.5, 0.5);
			life.anchor.setTo(0.5, 0.5);
		}
	},
	createBackground: function () {
		this.bg = this.add.tileSprite(0, 0, SkeletonWar.WIDTH, SkeletonWar.HEIGHT, 'darkPurple');
	},
	createPlayer: function () {
		this.player = this.add.sprite(SkeletonWar.WIDTH / 8, SkeletonWar.HEIGHT / 2, 'player');
		this.player.anchor.setTo(0.5, 0.5);
		this.player.rotation = 1.571;
		this.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.speed = 200;
		this.player.body.setSize(20, 20, -5, 0);
		this.player.body.collideWorldBounds = true;
	},
	createBullets: function () {
		this.enemyBulletPool = this.add.group();
		this.enemyBulletPool.enableBody = true;
		this.enemyBulletPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.enemyBulletPool.createMultiple(100, 'enemyBullet');
		this.enemyBulletPool.setAll('anchor.x', 0.5);
		this.enemyBulletPool.setAll('anchor.y', 0.5);
		this.enemyBulletPool.setAll('outOfBoundsKill', true);
		this.enemyBulletPool.setAll('checkWorldBounds', true);
		this.enemyBulletPool.setAll('reward', 0, false, false, 0, true);

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
	},
	createEnemies: function () {
		this.enemyPool = this.add.group();
		this.enemyPool.enableBody = true;
		this.enemyPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.enemyPool.createMultiple(50, 'greenEnemy');
		this.enemyPool.setAll('anchor.x', 0.5);
		this.enemyPool.setAll('anchor.y', 0.5);
		this.enemyPool.setAll('outOfBoundsKill', true);
		this.enemyPool.setAll('checkWorldBounds', true);
		this.nextEnemyAt = 0;
		this.enemyDelay = SkeletonWar.SPAWN_ENEMY_DELAY;

		this.shooterPool = this.add.group();
		this.shooterPool.enableBody = true;
		this.shooterPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.shooterPool.createMultiple(20, 'enemy2');
		this.shooterPool.setAll('anchor.x', 0.5);
		this.shooterPool.setAll('anchor.y', 0.5);
		this.shooterPool.setAll('outOfBoundsKill', true);
		this.shooterPool.setAll('checkWorldBounds', true);
		this.shooterPool.setAll(
			'reward', SkeletonWar.SHOOTER_REWARD, false, false, 0, true
		);

		this.nextShooterAt = this.time.now + Phaser.Timer.SECOND * 5;
		this.shooterDelay = SkeletonWar.SPAWN_SHOOTER_DELAY;
	},
	render: function () {
		//this.game.debug.body(this.player);
	},
	update: function () {
		dt = this.time.physicsElapsed;
		this.bg.tilePosition.x -= this.player.speed * dt;

		this.checkCollisions();
		this.spawnEnemies();
		this.enemyFire();
		this.processInput();
		this.processDelayedEffects();
		
	},
	checkCollisions: function () {
		this.physics.arcade.overlap(
			this.bulletPool, this.enemyPool, this.enemyHit, null, this
		);

		this.physics.arcade.overlap(
			this.bulletPool, this.shooterPool, this.enemyHit, null, this
		);

		this.physics.arcade.overlap(
			this.player, this.enemyPool, this.playerHit, null, this
		);

		this.physics.arcade.overlap(
			this.player, this.shooterPool, this.playerHit, null, this
		);

		this.physics.arcade.overlap(
			this.player, this.enemyBulletPool, this.playerHit, null, this
		);
	},
	spawnEnemies: function () {
		if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {
			this.nextEnemyAt = this.time.now + this.enemyDelay;
			enemy = this.enemyPool.getFirstExists(false);
			enemy.reset(SkeletonWar.WIDTH + 16, this.rnd.integerInRange(32, SkeletonWar.HEIGHT), SkeletonWar.ENEMY_HEALTH);
			enemy.body.velocity.x = this.rnd.integerInRange(-60, -100);
		}

		if (this.nextShooterAt < this.time.now && this.shooterPool.countDead() > 0) {
			this.nextShooterAt = this.time.now + this.shooterDelay;
			var shooter = this.shooterPool.getFirstExists(false);
			shooter.reset(
				SkeletonWar.WIDTH + 32, this.rnd.integerInRange(32, SkeletonWar.HEIGHT - 32), SkeletonWar.SHOOTER_HEALTH
			);

			var target = this.rnd.integerInRange(32, SkeletonWar.HEIGHT - 32);

			shooter.rotation = this.physics.arcade.moveToXY(
				shooter, 0, target, this.rnd.integerInRange(SkeletonWar.SHOOTER_MIN_VELOCITY, SkeletonWar.SHOOTER_MAX_VELOCITY)
			) - Math.PI / 2;

			shooter.nextShotAt = 0;
		}
	},
	enemyFire: function () {
		this.shooterPool.forEachAlive(function (enemy) {
			if (this.time.now > enemy.nextShotAt && this.enemyBulletPool.countDead() > 0) {
				var bullet = this.enemyBulletPool.getFirstExists(false);
				bullet.reset(enemy.x, enemy.y);
				this.physics.arcade.moveToObject(
					bullet, this.player, SkeletonWar.ENEMY_BULLET_VELOCITY
				);
				enemy.nextShotAt = this.time.now + SkeletonWar.SHOOTER_SHOT_DELAY;
			}
		}, this);
	},
	processInput: function () {
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
	processDelayedEffects: function () {
		if (this.ghostUntil && this.ghostUntil < this.time.now) {
			this.ghostUntil = null;
			this.player.alpha = 1;
		}
	},
	enemyHit: function (bullet, enemy) {
		bullet.kill();
		this.damageEnemy(enemy, SkeletonWar.BULLET_DAMAGE);
	},
	playerHit: function (player, enemy) {
		if (this.ghostUntil && this.ghostUntil > this.time.now) {
			return;
		}
		this.damageEnemy(enemy, SkeletonWar.CRASH_DAMAGE);
		var life = this.lives.getFirstAlive();
		if (life !== null) {
			life.kill();
			this.ghostUntil = this.time.now + SkeletonWar.PLAYER_GHOST_TIME;
			this.player.alpha = 0.5;
		} else {
			player.kill();
			this.quitGame();
		}
	},
	damageEnemy: function (enemy, damage) {
		enemy.damage(damage);
		if (!enemy.alive) {
			//explode?
		}
	},
	fire: function () {
		if (!this.player.alive || this.nextShotAt > this.time.now) {
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