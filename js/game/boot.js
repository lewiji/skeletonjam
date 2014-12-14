var SkeletonWar = {
  SEA_SCROLL_SPEED: 12,
  PLAYER_SPEED: 300,
  ENEMY_MIN_Y_VELOCITY: 30,
  ENEMY_MAX_Y_VELOCITY: 60,
  SHOOTER_MIN_VELOCITY: 30,
  SHOOTER_MAX_VELOCITY: 80,
  BOSS_Y_VELOCITY: 50,
  BOSS_X_VELOCITY: 15,
  BULLET_VELOCITY: 500,
  ENEMY_BULLET_VELOCITY: 150,
  POWERUP_VELOCITY: 100,

  SPAWN_ENEMY_DELAY: Phaser.Timer.SECOND,
  SPAWN_SHOOTER_DELAY: Phaser.Timer.SECOND * 3,

  SHOT_DELAY: Phaser.Timer.SECOND * 0.1,
  SHOOTER_SHOT_DELAY: Phaser.Timer.SECOND * 2,
  BOSS_SHOT_DELAY: Phaser.Timer.SECOND,

  ENEMY_HEALTH: 5,
  SHOOTER_HEALTH: 8,
  BOSS_HEALTH: 500,

  BULLET_DAMAGE: 1,
  CRASH_DAMAGE: 5,

  ENEMY_REWARD: 100,
  SHOOTER_REWARD: 400,
  BOSS_REWARD: 10000,
  POWERUP_REWARD: 100,

  ENEMY_DROP_RATE: 0.3,
  SHOOTER_DROP_RATE: 0.5,
  BOSS_DROP_RATE: 0,

  PLAYER_EXTRA_LIVES: 3,
  PLAYER_GHOST_TIME: Phaser.Timer.SECOND * 3,

  INSTRUCTION_EXPIRE: Phaser.Timer.SECOND * 10,
  RETURN_MESSAGE_DELAY: Phaser.Timer.SECOND * 2,

  WIDTH: 640,
  HEIGHT: 360
};

SkeletonWar.setDefaults = function () {
  SkeletonWar.SEA_SCROLL_SPEED = 12;
  SkeletonWar.PLAYER_SPEED = 400;
  SkeletonWar.ENEMY_MIN_Y_VELOCITY = 30;
  SkeletonWar.ENEMY_MAX_Y_VELOCITY = 100;
  SkeletonWar.SHOOTER_MIN_VELOCITY = 30;
  SkeletonWar.SHOOTER_MAX_VELOCITY = 120;
  SkeletonWar.BOSS_Y_VELOCITY = 50;
  SkeletonWar.BOSS_X_VELOCITY = 15;
  SkeletonWar.BULLET_VELOCITY = 500;
  SkeletonWar.ENEMY_BULLET_VELOCITY = 150;
  SkeletonWar.POWERUP_VELOCITY = 100;
  SkeletonWar.SPAWN_ENEMY_DELAY = Phaser.Timer.SECOND;
  SkeletonWar.SPAWN_SHOOTER_DELAY = Phaser.Timer.SECOND * 3;
  SkeletonWar.SHOT_DELAY = Phaser.Timer.SECOND * 0.1;
  SkeletonWar.SHOOTER_SHOT_DELAY = Phaser.Timer.SECOND * 2;
  SkeletonWar.BOSS_SHOT_DELAY = Phaser.Timer.SECOND;
  SkeletonWar.ENEMY_HEALTH = 5;
  SkeletonWar.SHOOTER_HEALTH = 8;
  SkeletonWar.BOSS_HEALTH = 500;
  SkeletonWar.BULLET_DAMAGE = 1;
  SkeletonWar.CRASH_DAMAGE = 5;
  SkeletonWar.ENEMY_REWARD = 10;
  SkeletonWar.SHOOTER_REWARD = 20;
  SkeletonWar.BOSS_REWARD = 10000;
  SkeletonWar.POWERUP_REWARD = 100;
  SkeletonWar.ENEMY_DROP_RATE = 0.3;
  SkeletonWar.SHOOTER_DROP_RATE = 0.5;
  SkeletonWar.BOSS_DROP_RATE = 0;
  SkeletonWar.PLAYER_EXTRA_LIVES = 3;
  SkeletonWar.PLAYER_GHOST_TIME = Phaser.Timer.SECOND * 3;
  SkeletonWar.INSTRUCTION_EXPIRE = Phaser.Timer.SECOND * 10;
  SkeletonWar.RETURN_MESSAGE_DELAY = Phaser.Timer.SECOND * 2;
  SkeletonWar.WIDTH = 640;
  SkeletonWar.HEIGHT = 360;
};

SkeletonWar.Boot = function (game) {

};

SkeletonWar.Boot.prototype = {

  init: function () {

    //  Unless you specifically know your game needs to support multi-touch I would recommend setting this to 1
    this.input.maxPointers = 1;

    //  Phaser will automatically pause if the browser tab the game is in loses focus. You can disable that here:
    // this.stage.disableVisibilityChange = true;

    if (this.game.device.desktop) {
      //  If you have any desktop specific settings, they can go in here
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(640, 360, 1024, 720);
    } else {
      //  Same goes for mobile settings.
      //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(640, 360, 1024, 720);
    }
    this.scale.pageAlignHorizontally = true;
    this.scale.pageAlignVertically = true;
  },

  preload: function () {

    //  Here we load the assets required for our preloader (in this case a loading bar)
    this.load.image('preloaderBar', 'assets/img/preloader-bar.png');

  },

  create: function () {

    //  By this point the preloader assets have loaded to the cache, we've set the game settings
    //  So now let's start the real preloader going
    this.state.start('Preloader');

  }

};
