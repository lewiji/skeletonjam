
SkeletonWar.MainMenu = function (game) {

  this.music = null;
  this.playButton = null;

};

SkeletonWar.MainMenu.prototype = {

  create: function () {

    this.loadingText = this.add.text(this.game.width / 2, this.game.height / 2 + 80, "Press Z or tap/click game to start", { font: "20px monospace", fill: "#fff" });
    this.loadingText.anchor.setTo(0.5, 0.5);
    if (!this.music) {
      /*this.music = this.add.audio('bgmusic1');
      this.music.play();*/
    }
  },

  update: function () {

    if (this.input.keyboard.isDown(Phaser.Keyboard.Z) || this.input.activePointer.isDown) {
      this.startGame();
    }
    //  Do some nice funky main menu effect here

  },

  startGame: function (pointer) {

    //  Ok, the Play Button has been clicked or touched, so let's stop the music (otherwise it'll carry on playing)
    // this.music.stop();

    //  And start the actual game
    this.state.start('Game');

  }

};
