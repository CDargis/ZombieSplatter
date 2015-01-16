define(['lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function() {
	var createSpriteCreator = function() {
		var spriteCreator = {
			create: function(spriteSheet, data) {
	      var sprite = new createjs.Sprite(spriteSheet);
	      sprite.direction = data.direction;
	      sprite.scaleX = data.scaleX;
	      sprite.scaleY = data.scaleY;
	      sprite.vX = data.vX;
	      sprite.x = data.x;
	      sprite.y = data.y;
	      var bounds = sprite.getBounds();
	      sprite.regX = bounds.width / 2;
	      sprite.regY = bounds.height / 2;
	      sprite.currentFrame = 0;
	      return sprite;
			},
		};
		return spriteCreator;
	};
	return createSpriteCreator();
});
