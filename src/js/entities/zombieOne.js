define(['entities/spriteCreator', 'spriteSheets/zombieOne',
	'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'],
	function(spriteCreator, zombieOneSpriteSheet) {

		var createEntityDecorator = function() {

			var entityDecorator = {

				decorate: function(entity, spriteData) {
					var spriteSheet = zombieOneSpriteSheet.create();
					var sprite = spriteCreator.create(spriteSheet, spriteData);

					 // Possibly remove ater removing click event listener
					var bounds = sprite.getBounds();
	        var hit = new createjs.Shape();
	        hit.graphics.beginFill('#000').rect(0, 0, bounds.width, bounds.height); 
	        sprite.hitArea = hit;

				  entity.sprite = sprite;

				  entity.update = function(data) {
			    	if(sprite.currentAnimation === 'walk') {
					    if (sprite.x >= data.maxX) {
					      sprite.direction = -90;
					      sprite.scaleX = -Math.abs(sprite.scaleX);
					    }

					    if (sprite.x < data.minX) {
					      sprite.direction = 90;
					      sprite.scaleX = Math.abs(sprite.scaleX);
					    }

					    if (sprite.direction === 90) {
					      sprite.x += sprite.vX;
					    }
					    else {
					      sprite.x -= sprite.vX;
					    }
					  }
			    };

			    // To be removed
				  entity.sprite.addEventListener('click', function() {
						if(entity.sprite.currentAnimation === 'walk') {
				      entity.sprite.vX = 0;
				      entity.sprite.gotoAndPlay('dieByShot');
				    }
					});

					entity.sprite.on('animationend', function(event) {
				    if(event.name === 'dead') {
				    	entity.dead = true;
				    }
					});

					entity.init = function() {
			    	sprite.gotoAndPlay('spawn');
			    };
				},

				init: function(loadQueue) {
					zombieOneSpriteSheet.init(loadQueue);
				},
			};
			return entityDecorator;
		};
		return createEntityDecorator();
});
