define(['entities/spriteCreator', 'spriteSheets/soldierOne',
	'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'],
	function(spriteCreator, soldierOneSpriteSheet) {

		var createEntityDecorator = function() {

			var entityDecorator = {

				decorate: function(entity, spriteData) {
					var spriteSheet = soldierOneSpriteSheet.create();
					var sprite = spriteCreator.create(spriteSheet, spriteData);
				  entity.sprite = sprite;

				  entity.update = function(data) {
				  	var currentAnimation = sprite.currentAnimation;
				  	var actions = data.actions;
				  	if(actions.LEFT && sprite.x > data.minX) {
				  		sprite.scaleX = -Math.abs(sprite.scaleX);
				  		sprite.direction = -90;
				  		if(sprite.currentAnimation !== 'run') {
				  			sprite.gotoAndPlay('run');
				  		}
				  	}
				  	else if(actions.RIGHT && sprite.x < data.maxX) {
				  		sprite.scaleX = Math.abs(sprite.scaleX); 
				  		sprite.direction = 90;
				  		if(sprite.currentAnimation !== 'run') {
				  			sprite.gotoAndPlay('run');
				  		}
				  	}
				  	else if(actions.DOWN && currentAnimation !== 'crouch' &&
				  			currentAnimation !== 'crouched' && currentAnimation !== 'exitCrouch') {
				  		sprite.gotoAndPlay('crouch');
				  	}
				  	else if(actions.DOWN && currentAnimation === 'crouched') {
				  		sprite.gotoAndPlay('exitCrouch');
				  	}
				  	else if (currentAnimation !== 'jump' && currentAnimation !== 'crouch' &&
				  		currentAnimation !== 'crouched') {
				  		sprite.gotoAndPlay('idle');
				  	}

			    	if(currentAnimation === 'run') {
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
