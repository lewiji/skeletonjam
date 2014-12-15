SkeletonWar.Game = function (game) {
};
// externalise vars for GC efficiency
var dt, bullet, enemy, explosion;
SkeletonWar.Game.prototype = {
	create: function () {
		SkeletonWar.setDefaults();
		this.score = 0;
		this.createBackground();
		this.createPlayer();
		this.createBullets();
		this.createEnemies();
		this.setupPlayerIcons();
		this.createText();
		this.cursors = this.input.keyboard.createCursorKeys();
		this.music = this.add.audio('bgmusic1');
		this.music.play('', 0, 1, true);
		this.bossMusic = this.add.audio('boss');
		this.sfx_playershoot = this.add.audio('playershoot');
		this.sfx_splode = this.add.audio('splode2');
		this.sfx_powerup = this.add.audio('powerup');
		this.sfx_hit = this.add.audio('hit');
		this.sfx_powerup_get = this.add.audio('powerup_get');
		this.sfx_boss_explode = this.add.audio('bossExplode');
		this.sfx_boss_approach = this.add.audio('bossApproach');
		this.sfx_player_die = this.add.audio('playerdie');
		this.sfx_enemy_shoot = this.add.audio('enemyshoot');
		this.sfx_boss_shoot = this.add.audio('bossShoot');
	},
	setupPlayerIcons: function () {
		this.powerUpPool = this.add.group();
	    this.powerUpPool.enableBody = true;
	    this.powerUpPool.physicsBodyType = Phaser.Physics.ARCADE;
	    this.powerUpPool.createMultiple(5, 'powerup');
	    this.powerUpPool.setAll('anchor.x', 0.5);
	    this.powerUpPool.setAll('anchor.y', 0.5);
	    this.powerUpPool.setAll('outOfBoundsKill', true);
	    this.powerUpPool.setAll('checkWorldBounds', true);
	    this.powerUpPool.setAll(
	      'reward', SkeletonWar.POWERUP_REWARD, false, false, 0, true
	    );

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
		this.player.animations.add('fly', [0, 1], 5, true);
		this.player.animations.add('ghost', [0, 2], 10, true);
		this.player.play('fly');
		this.weaponLevel = 0;
	},
	createBullets: function () {
		this.enemyBulletPool = this.add.group();
		this.enemyBulletPool.enableBody = true;
		this.enemyBulletPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.enemyBulletPool.createMultiple(100, 'enemyBullet');
		this.enemyBulletPool.setAll('anchor.x', 0.5);
		this.enemyBulletPool.setAll('anchor.y', 0.5);
		this.enemyBulletPool.setAll('scale.x', 0.5);
		this.enemyBulletPool.setAll('scale.y', 0.5);
		this.enemyBulletPool.setAll('outOfBoundsKill', true);
		this.enemyBulletPool.setAll('checkWorldBounds', true);
		this.enemyBulletPool.setAll('reward', 0, false, false, 0, true);

		this.enemyBulletPool.forEach(function (bullet) {
			bullet.animations.add('fly', [0, 1, 2, 3], 5, true);
		});

		this.bulletPool = this.add.group();
		this.bulletPool.enableBody = true;
		this.bulletPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.bulletPool.createMultiple(100, 'bullet');
		this.bulletPool.setAll('anchor.x', 0.5);
		this.bulletPool.setAll('anchor.y', 0.5);
		this.bulletPool.setAll('scale.y', 0.5);
		this.bulletPool.setAll('scale.x', 0.5);
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
		this.enemyPool.setAll(
		  'dropRate', SkeletonWar.ENEMY_DROP_RATE, false, false, 0, true
		);
		this.nextEnemyAt = 0;
		this.enemyDelay = SkeletonWar.SPAWN_ENEMY_DELAY;

		this.enemyPool.forEach(function (enemy) {
			enemy.animations.add('fly', [0, 1], 20, true);
		});
        
        this.enemyPool.forEach(function (enemy2) {
			enemy2.animations.add('fly', [0, 1], 20, true);
		});

		this.explosionPool = this.add.group();
		this.explosionPool.enableBody = true;
		this.explosionPool.physicsBodyType = Phaser.Physics.ARCADE;
		this.explosionPool.createMultiple(50, 'explosion');
		this.explosionPool.setAll('anchor.x', 0.5);
		this.explosionPool.setAll('anchor.y', 0.5);
		this.explosionPool.setAll('outOfBoundsKill', true);
		this.explosionPool.setAll('checkWorldBounds', true);

		this.explosionPool.forEach(function (explosion) {
			explosion.animations.add('explode', [0, 1, 2, 3], 10);
			explosion.events.onAnimationComplete.add(function (e) {
				e.kill();
			}, this);
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
		this.shooterPool.setAll(
		  'dropRate', SkeletonWar.SHOOTER_DROP_RATE, false, false, 0, true
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
	createText: function () {
		this.scoreText = this.add.text(
		  this.game.width / 2, 30, '' + this.score, 
		  { font: '20px monospace', fill: '#fff', align: 'center' }
		);
		this.scoreText.anchor.setTo(0.5, 0.5);

	},
	addToScore: function (score) {
		this.score += score;
		this.scoreText.text = this.score;
		if (this.score >= 250 && SkeletonWar.SPAWN_SHOOTER_DELAY > Phaser.Timer.SECOND / 4) {
			SkeletonWar.SPAWN_ENEMY_DELAY = Phaser.Timer.SECOND / 4;
			SkeletonWar.SPAWN_SHOOTER_DELAY = Phaser.Timer.SECOND;
		}

		if (this.score >= 500 && SkeletonWar.ENEMY_HEALTH < 5) {
			SkeletonWar.ENEMY_HEALTH = 5;
			SkeletonWar.SHOOTER_HEALTH = 8;
		}

		if (this.score >= 1000 && SkeletonWar.SHOOTER_SHOT_DELAY > Phaser.Timer.SECOND) {
			SkeletonWar.SHOT_DELAY = Phaser.Timer.SECOND * 0.1;
			SkeletonWar.SHOOTER_SHOT_DELAY = Phaser.Timer.SECOND * 1.5;
		}

		if (this.score >= 2000 && this.bossPool.countDead() == 1) {
			this.spawnBoss();
		}
	},
	spawnBoss: function () {
		this.sfx_boss_approach.play();
		this.bossApproaching = true;
		this.boss.reset(this.game.width + (this.boss.width / 2), this.game.height / 2, SkeletonWar.BOSS_HEALTH);
		this.physics.enable(this.boss, Phaser.Physics.ARCADE);
		this.boss.body.velocity.x = -SkeletonWar.BOSS_Y_VELOCITY;
		this.music.stop();
		this.bossMusic.play('', 0, 1, true);
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

		this.physics.arcade.overlap(
		  this.player, this.powerUpPool, this.playerPowerUp, null, this
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
	playerPowerUp: function (player, powerUp) {
		this.addToScore(powerUp.reward);
		powerUp.kill();
		this.sfx_powerup_get.play();
		if (this.weaponLevel < 2) {
			this.weaponLevel++;
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

			this.physics.arcade.moveToXY(
				shooter, 0, target, this.rnd.integerInRange(SkeletonWar.SHOOTER_MIN_VELOCITY, SkeletonWar.SHOOTER_MAX_VELOCITY)
			);

			shooter.nextShotAt = 0;
		}
	},
	enemyFire: function () {
		this.shooterPool.forEachAlive(function (enemy) {
			if (this.time.now > enemy.nextShotAt && this.enemyBulletPool.countDead() > 0) {
				var bullet = this.enemyBulletPool.getFirstExists(false);
				bullet.reset(enemy.x, enemy.y);
				bullet.play('fly');
				this.sfx_enemy_shoot.play();
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
		    this.sfx_boss_shoot.play();

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
			this.weaponLevel = 0;
			this.ghostUntil = this.time.now + SkeletonWar.PLAYER_GHOST_TIME;
			this.player.play('ghost');
			this.sfx_player_die.play();
            this.player.x = SkeletonWar.WIDTH / 8
            this.player.y = SkeletonWar.HEIGHT / 2
		} else {
			player.kill();
			this.quitGame();
		}
	},
	damageEnemy: function (enemy, damage) {
		enemy.damage(damage);
		this.sfx_hit.play();
		if (!enemy.alive) {
			this.spawnPowerUp(enemy);
			this.addToScore(enemy.reward);
			if (enemy.key === 'boss') {
				this.bossPool.destroy();
				this.bossMusic.stop();
				this.music.play('', 0, 1, true);
				this.sfx_boss_explode.play();
			} else {
				var explosion = this.explosionPool.getFirstExists(false);
				explosion.reset(enemy.x, enemy.y, 1);
				explosion.body.velocity.x = enemy.body.velocity.x;
				explosion.play('explode');
				this.sfx_splode.play();
			}
		}
	},
	spawnPowerUp: function (enemy) {
		if (this.powerUpPool.countDead() === 0 || this.weaponLevel === 5) { 
	        return;
	    }
	 
	    if (this.rnd.frac() < enemy.dropRate) {
	        var powerUp = this.powerUpPool.getFirstExists(false);
	        powerUp.reset(enemy.x, enemy.y);
	        powerUp.body.velocity.x = -SkeletonWar.POWERUP_VELOCITY;
	        this.sfx_powerup.play();
	    }
	},
	fire: function () {
		if (!this.player.alive || this.nextShotAt > this.time.now) {
			return;
		}
		this.sfx_playershoot.play('', 0, 0.5);
		this.nextShotAt = this.time.now + this.shotDelay;

		if (this.weaponLevel === 0) {
			if (this.bulletPool.countDead() === 0) {
				return;
			}
			bullet = this.bulletPool.getFirstExists(false);
			bullet.reset(this.player.x + 20, this.player.y);
			bullet.body.velocity.x = SkeletonWar.BULLET_VELOCITY;
		} else {
			if (this.bulletPool.countDead() < this.weaponLevel * 2) {
				return;
			}
			for (var i = 0; i < this.weaponLevel; i++) {
				bullet = this.bulletPool.getFirstExists(false);
				// spawn left bullet slightly left off center
				bullet.reset(this.player.x + (10 + i * 6), this.player.y);
				// the left bullets spread from -95 degrees to -135 degrees
				this.physics.arcade.velocityFromAngle(
				  5 - i * 5, SkeletonWar.BULLET_VELOCITY, bullet.body.velocity
				);

				bullet = this.bulletPool.getFirstExists(false);
				// spawn right bullet slightly right off center
				bullet.reset(this.player.x + (10 + i * 6), this.player.y);
				// the right bullets spread from -85 degrees to -45
				this.physics.arcade.velocityFromAngle(
				  -5 + i * 5, SkeletonWar.BULLET_VELOCITY, bullet.body.velocity
				);
			}
		}
	},
	quitGame: function (pointer) {
		this.state.start('MainMenu');
		this.music.stop();
		this.bossMusic.stop();
	}
};