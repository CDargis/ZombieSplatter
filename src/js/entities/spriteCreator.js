define(['lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function() {
	var createSpriteCreator = function() {
		var spriteCreator = {
			create: function(spriteSheet, spriteDef) {
	      var sprite = new createjs.Sprite(spriteSheet, spriteDef.initialAnimation);
	      sprite.direction = spriteDef.direction;
	      sprite.scaleX = spriteDef.scaleX;
	      sprite.scaleY = spriteDef.scaleY;
	      sprite.x = spriteDef.x;
	      sprite.y = spriteDef.y;
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
