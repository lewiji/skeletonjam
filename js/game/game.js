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
		this.music = this.add.audio('bgmusic1');
		this.music.play('', 0, 1, true);
		this.score = 0;
		SkeletonWar.setDefaults();
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
		this.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.speed = 200;
		this.player.body.setSize(20, 20, -5, 0);
		this.player.body.collideWorldBounds = true;
		this.player.animations.add('fly', [0], 20);
		this.player.animations.add('ghost', [0, 1], 10, true);
		this.player.play('fly');
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
		this.enemyPool.setAll(
			'reward', SkeletonWar.ENEMY_REWARD, false, false, 0, true
		);
		this.nextEnemyAt = 0;
		this.enemyDelay = SkeletonWar.SPAWN_ENEMY_DELAY;

		this.enemyPool.forEach(function (enemy) {
			enemy.animations.add('fly', [0, 1], 20, true);
		});

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

		this.bossPool = this.add.group();
	    this.bossPool.enableBody = true;
	    this.bossPool.physicsBodyType = Phaser.Physics.ARCADE;
	    this.bossPool.createMultiple(1, 'boss');
	    this.bossPool.setAll('anchor.x', 0.5);
	    this.bossPool.setAll('anchor.y', 0.5);
	    this.bossPool.setAll('scale.x', 0.65);
	    this.bossPool.setAll('scale.y', 0.65);
	    this.bossPool.setAll('checkWorldBounds', true);
	    this.bossPool.setAll('reward', SkeletonWar.BOSS_REWARD, false, false, 0, true);
	    this.bossPool.setAll(
	      'dropRate', SkeletonWar.BOSS_DROP_RATE, false, false, 0, true
	    );

	    this.boss = this.bossPool.getTop();
	    this.boss.body.setSize(282, 135);
	    this.boss.animations.add('fly', [0], 20, true);
	    this.boss.animations.add('stage2', [1], 20, true);
	    this.boss.play('fly');
    	this.bossApproaching = false;
	},
	addToScore: function (score) {
		this.score += score;
		if (this.score >= 250 && SkeletonWar.SPAWN_SHOOTER_DELAY < Phaser.Timer.SECOND * 2) {
			SkeletonWar.SPAWN_SHOOTER_DELAY = Phaser.Timer.SECOND * 2;
		}

		if (this.score >= 500 && SkeletonWar.ENEMY_HEALTH < 8) {
			SkeletonWar.ENEMY_HEALTH = 8;
			SkeletonWar.SHOOTER_HEALTH = 12;
		}

		if (this.score >= 1000 && SkeletonWar.ENEMY_DROP_RATE > 0.15) {
    		SkeletonWar.ENEMY_DROP_RATE = 0.15;
		}

		if (this.score >= 1500 && SkeletonWar.SHOOTER_DROP_RATE > 0.3) {
			SkeletonWar.SHOOTER_DROP_RATE = 0.3;
		}

		if (this.score >= 2000 && this.bossPool.countDead() == 1) {
			this.spawnBoss();
		}
	},
	spawnBoss: function () {
		this.bossApproaching = true;
		this.boss.reset(this.game.width + (this.boss.width / 2), this.game.height / 2, SkeletonWar.BOSS_HEALTH);
		this.physics.enable(this.boss, Phaser.Physics.ARCADE);
		this.boss.body.velocity.x = -SkeletonWar.BOSS_Y_VELOCITY;
	},
	render: function () {
		//this.game.debug.body(this.boss);
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

		if (this.bossApproaching === false) {
	      this.physics.arcade.overlap(
	        this.bulletPool, this.bossPool, this.enemyHit, null, this
	      );

	      this.physics.arcade.overlap(
	        this.player, this.bossPool, this.playerHit, null, this
	      );
	    }

	},
	spawnEnemies: function () {
		if (this.boss.alive) {
			return;
		}
		if (this.nextEnemyAt < this.time.now && this.enemyPool.countDead() > 0) {
			this.nextEnemyAt = this.time.now + this.enemyDelay;
			enemy = this.enemyPool.getFirstExists(false);
			enemy.reset(SkeletonWar.WIDTH + 16, this.rnd.integerInRange(64, SkeletonWar.HEIGHT - 64), SkeletonWar.ENEMY_HEALTH);
			enemy.body.velocity.x = this.rnd.integerInRange(-60, -100);
			enemy.play('fly');
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

		if (this.bossApproaching === false && this.boss.alive && 
		    this.boss.nextShotAt < this.time.now &&
		    this.enemyBulletPool.countDead() >= 10) {

		  this.boss.nextShotAt = this.time.now + SkeletonWar.BOSS_SHOT_DELAY;

		  for (var i = 0; i < 5; i++) {
		    // process 2 bullets at a time
		    var leftBullet = this.enemyBulletPool.getFirstExists(false);
		    leftBullet.reset(this.boss.x - 10 - i * 10, this.boss.y + 20);
		    var rightBullet = this.enemyBulletPool.getFirstExists(false);
		    rightBullet.reset(this.boss.x + 10 + i * 10, this.boss.y + 20);

		    if (this.boss.health > 250) {
		      // aim directly at the player
		      this.physics.arcade.moveToObject(
		        leftBullet, this.player, SkeletonWar.ENEMY_BULLET_VELOCITY
		      );
		      this.physics.arcade.moveToObject(
		        rightBullet, this.player, SkeletonWar.ENEMY_BULLET_VELOCITY
		      );
		    } else {
		      this.boss.play('stage2');
		      // aim slightly off center of the player
		      this.physics.arcade.moveToXY(
		        leftBullet, this.player.x - i * 100, this.player.y,
		        SkeletonWar.ENEMY_BULLET_VELOCITY
		      );
		      this.physics.arcade.moveToXY(
		        rightBullet, this.player.x + i * 100, this.player.y,
		        SkeletonWar.ENEMY_BULLET_VELOCITY
		      );
		    }
		  }
		}
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
			this.player.play('fly');
		}

		if (this.bossApproaching && this.boss.x < this.game.width / 2 + this.boss.width / 2) {
	      this.bossApproaching = false;
	      this.boss.nextShotAt = 0;

	      this.boss.body.velocity.y = SkeletonWar.BOSS_X_VELOCITY;
	      this.boss.body.velocity.x = 0;
	      // allow bouncing off world bounds
	      this.boss.body.bounce.y = 1;
	      this.boss.body.collideWorldBounds = true;
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
			this.player.play('ghost');
		} else {
			player.kill();
			this.quitGame();
		}
	},
	damageEnemy: function (enemy, damage) {
		enemy.damage(damage);
		if (!enemy.alive) {
			this.addToScore(enemy.reward);
			if (enemy.key === 'boss') {
				this.bossPool.destroy();
			}
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
		this.music.stop();
	}
};