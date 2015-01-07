define(['sprites/zombieOne', 'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function(zombieOneSprite) {

	var createEntityDecorator = function() {

		var entityDecorator = {

			// Decorate sprite?!?!
			decorate: function(entity, spriteData) {
				var sprite = zombieOneSprite.createSprite(spriteData);
			  entity.sprite = sprite;

			  entity.update = function(data) {
		    	if(sprite.currentAnimation === 'walk') {
				    if (sprite.x >= data.maxX) {
				      sprite.direction = -90;
				      sprite.scaleX = -1;
				    }

				    if (sprite.x < data.minX) {
				      sprite.direction = 90;
				      sprite.scaleX = 1;
				    }

				    // Moving the sprite based on the direction & the speed
				    if (sprite.direction === 90) {
				      sprite.x += sprite.vX;
				    }
				    else {
				      sprite.x -= sprite.vX;
				    }
				  }
		    };

		    // To be removed
		    var hit = new createjs.Shape();
        hit.graphics.beginFill("#000").rect(0, 0, 52, 100); 
        entity.sprite.hitArea = hit;
			  entity.sprite.addEventListener('click', function() {
					if(entity.sprite.currentAnimation === 'walk') {
			      entity.sprite.vX = 0;
			      entity.sprite.gotoAndPlay('dieByShot');
			    }
				});

				entity.sprite.on('animationend', function(event) {
					if(event.name === 'spawn') {
			      entity.sprite.gotoAndPlay('walk');
			    }
					if(event.name === 'dieByShot') {
			      entity.sprite.gotoAndPlay('dead');
			    }
			    if(event.name === 'dead') {
			    	entity.dead = true;
			    }
				});

				entity.init = function() {
		    	sprite.gotoAndPlay('spawn');
		    };
			},

			init: function(loadQueue) {
				zombieOneSprite.init(loadQueue);
			},
		};
		return entityDecorator;
	};
	return createEntityDecorator();
});
