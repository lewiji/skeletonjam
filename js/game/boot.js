var SkeletonWar = {};

SkeletonWar.setDefaults = function () {
  SkeletonWar.SEA_SCROLL_SPEED = 12;
  SkeletonWar.PLAYER_SPEED = 400;
  SkeletonWar.ENEMY_MIN_Y_VELOCITY = 60;
  SkeletonWar.ENEMY_MAX_Y_VELOCITY = 120;
  SkeletonWar.SHOOTER_MIN_VELOCITY = 60;
  SkeletonWar.SHOOTER_MAX_VELOCITY = 180;
  SkeletonWar.BOSS_Y_VELOCITY = 50;
  SkeletonWar.BOSS_X_VELOCITY = 15;
  SkeletonWar.BULLET_VELOCITY = 500;
  SkeletonWar.ENEMY_BULLET_VELOCITY = 140;
  SkeletonWar.POWERUP_VELOCITY = 100;
  SkeletonWar.SPAWN_ENEMY_DELAY = Phaser.Timer.SECOND * 2;
  SkeletonWar.SPAWN_SHOOTER_DELAY = Phaser.Timer.SECOND * 2.5;
  SkeletonWar.SHOT_DELAY = Phaser.Timer.SECOND * 0.2;
  SkeletonWar.SHOOTER_SHOT_DELAY = Phaser.Timer.SECOND * 3;
  SkeletonWar.BOSS_SHOT_DELAY = Phaser.Timer.SECOND * 2;
  SkeletonWar.ENEMY_HEALTH = 5;
  SkeletonWar.SHOOTER_HEALTH = 10;
  SkeletonWar.BOSS_HEALTH = 500;
  SkeletonWar.BULLET_DAMAGE = 1;
  SkeletonWar.CRASH_DAMAGE = 5;
  SkeletonWar.ENEMY_REWARD = 10;
  SkeletonWar.SHOOTER_REWARD = 20;
  SkeletonWar.BOSS_REWARD = 10000;
  SkeletonWar.POWERUP_REWARD = 100;
  SkeletonWar.ENEMY_DROP_RATE = 0.07;
  SkeletonWar.SHOOTER_DROP_RATE = 0.05;
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
      this.scale.setMinMax(640, 360, 1280, 720);
    } else {
      //  Same goes for mobile settings.
      //  In this case we're saying "scale the game, no lower than 480x260 and no higher than 1024x768"
      this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
      this.scale.setMinMax(640, 360, 1280, 720);
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
