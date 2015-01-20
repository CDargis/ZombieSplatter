define(['lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function() {
	var createSpriteCreator = function() {
		var spriteCreator = {
			create: function(spriteSheet, data) {
	      var sprite = new createjs.Sprite(spriteSheet, data.initialAnimation);
	      sprite.direction = data.direction;
	      sprite.scaleX = data.scaleX;
	      sprite.scaleY = data.scaleY;
	      sprite.vX = data.vX;
	      sprite.x = data.x;
	      sprite.y = data.y;
	      sprite.currentFrame = 0;
	      var bounds = sprite.getBounds();
	      sprite.regX = bounds.width / 2;
	      sprite.regY = bounds.height / 2;
	      return sprite;
			},
		};
		return spriteCreator;
	};
	return createSpriteCreator();
});
