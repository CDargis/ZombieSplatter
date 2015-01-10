define(['spriteSheets/soldierOne', 'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'],
	function(soldierOneSpriteSheet) {

		var createEntityDecorator = function() {

			var entityDecorator = {

				createSprite: function(data) {
					var spriteSheet = soldierOneSpriteSheet.create();
	        var sprite = new createjs.Sprite(spriteSheet);
	        sprite.direction = data.direction;
	        sprite.scaleX = data.scaleX;
	        sprite.scaleY = data.scaleY;
	        sprite.vX = data.vX;
	        sprite.x = data.x;
	        sprite.y = data.y;
	        sprite.currentFrame = 0;
	        return sprite;
	      },

				decorate: function(entity, spriteData) {
					var spriteSheet = soldierOneSpriteSheet.create();
					var sprite = entityDecorator.createSprite(spriteData);
				  entity.sprite = sprite;

				  entity.update = function(data) {
			    	if(sprite.currentAnimation === 'run') {
					    // Moving the sprite based on the direction & the speed
					    if (sprite.direction === 90) {
					      sprite.x += sprite.vX;
					    }
					    else {
					      sprite.x -= sprite.vX;
					    }
					  }
			    };

					entity.init = function() {
			    	sprite.gotoAndPlay('idle');
			    };
				},

				init: function(loadQueue) {
					soldierOneSpriteSheet.init(loadQueue);
				},
			};
			return entityDecorator;
		};
		return createEntityDecorator();
});