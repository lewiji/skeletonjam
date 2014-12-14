
SkeletonWar.MainMenu = function (game) {

  this.music = null;
  this.playButton = null;

};

SkeletonWar.MainMenu.prototype = {

  create: function () {
    this.bg = this.add.sprite(0, 0, 'title');
    this.loadingText = this.add.text(this.game.width / 2, 64, "Press Z or tap/click game to start", { font: "20px monospace", fill: "#fff" });
    this.loadingText.anchor.setTo(0.5, 0.5);
      this.music = this.add.audio('title');
      this.music.play('', 0, 1, true);
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
    this.music.stop();

  }

};
