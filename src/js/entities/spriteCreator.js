define(['include/createJS'], function() {
	var createSpriteCreator = function() {
		var spriteCreator = {
			create: function(spriteSheet, spriteDef) {
	      var sprite = new createjs.Sprite(spriteSheet, spriteDef.initialAnimation);
	      sprite.direction = spriteDef.direction;
	      sprite.scaleX = spriteDef.scaleX;
	      sprite.scaleY = spriteDef.scaleY;
	      
	      // Ground is where we want the bottom of the sprite
	      var transformedBounds = sprite.getTransformedBounds();
	      var y = spriteDef.pos.ground - (transformedBounds.height / 2);

	      sprite.x = spriteDef.pos.x;
	      sprite.y = y;

	      return sprite;
			},
		};
		return spriteCreator;
	};
	return createSpriteCreator();
});
