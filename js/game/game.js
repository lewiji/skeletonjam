SkeletonWar.Game = function (game) {
};
var dt;
SkeletonWar.Game.prototype = {
	create: function () {
		this.bg = this.add.tileSprite(0, 0, SkeletonWar.WIDTH, SkeletonWar.HEIGHT, 'darkPurple');

		this.player = this.add.sprite(SkeletonWar.WIDTH / 8, SkeletonWar.HEIGHT / 2, 'player');
		this.player.anchor = {x: 0.5, y: 0.5};
		this.player.rotation = 1.571;
		this.player.scale = {x: 0.5, y: 0.5};
	},
	update: function () {
		dt = this.time.physicsElapsed;
		this.bg.tilePosition.x -= 200 * dt;
	},
	quitGame: function (pointer) {
		this.state.start('MainMenu');
	}
};