
SkeletonWar.Preloader = function (game) {

  this.background = null;
  this.preloadBar = null;

  //this.ready = false;

};

SkeletonWar.Preloader.prototype = {

  preload: function () {

    //  Show the loading progress bar asset we loaded in boot.js
    this.stage.backgroundColor = '#2d2d2d';

    this.preloadBar = this.add.sprite(this.game.width / 2 - 100, this.game.height / 2, 'preloaderBar');
    this.add.text(this.game.width / 2, this.game.height / 2 - 30, "Loading...", { font: "32px monospace", fill: "#fff" }).anchor.setTo(0.5, 0.5);

    //  This sets the preloadBar sprite as a loader sprite.
    //  What that does is automatically crop the sprite from 0 to full-width
    //  as the files below are loaded in.
    this.load.setPreloadSprite(this.preloadBar);

    //  Here we load the rest of the assets our game needs.
    this.load.image('darkPurple', 'assets/img/bg-static.png');
    this.load.spritesheet('player', 'assets/img/PLAYER-mockup.png', 64, 64);
    this.load.spritesheet('greenEnemy', 'assets/img/passiveskull_0.png', 64, 64);
    this.load.spritesheet('boss', 'assets/img/skeletonzeppelin-phase1.png', 512, 512)
    this.load.image('enemy2', 'assets/img/enemyRed1.png');
    this.load.image('bullet', 'assets/img/shot_16px_0.png');
    this.load.image('enemyBullet', 'assets/img/shot_16px_1.png');
    this.load.audio('bgmusic1', ['assets/audio/bg1.ogg']);
  },

  create: function () {

    //  Once the load has finished we disable the crop because we're going to sit in the update loop for a short while as the music decodes
    this.preloadBar.cropEnabled = false;

  },

  update: function () {    
      this.state.start('MainMenu');
  }

};
