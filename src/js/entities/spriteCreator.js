define(['lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function() {
	var createSpriteCreator = function() {
		var spriteCreator = {
			create: function(spriteSheet, spriteDef) {
	      var sprite = new createjs.Sprite(spriteSheet, spriteDef.initialAnimation);
	      sprite.direction = spriteDef.direction;
	      sprite.scaleX = spriteDef.scaleX;
	      sprite.scaleY = spriteDef.scaleY;
	      
	      var bounds = sprite.getBounds();
	      sprite.regX = bounds.width / 2;
	      sprite.regY = bounds.height / 2;

	      // Assume y is where we want the bottom of the sprite
	      var transformedBounds = sprite.getTransformedBounds();
	      var y = spriteDef.pos.y - (transformedBounds.height / 2);

	      sprite.x = spriteDef.pos.x;
	      sprite.y = y;

	      return sprite;
			},
		};
		return spriteCreator;
	};
	return createSpriteCreator();
});
