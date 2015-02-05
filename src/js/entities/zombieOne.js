define(['entities/spriteCreator', 'spriteSheets/zombieOne',
	'engine/physics', 'include/createJS', 'lib/box2dWeb'],
	function(spriteCreator, zombieOneSpriteSheet, physicsEngine) {

		var createEntityDecorator = function() {

			var entityDecorator = {

				decorate: function(entity, spriteDef) {
					var spriteSheet = zombieOneSpriteSheet.create();
					var sprite = spriteCreator.create(spriteSheet, spriteDef);

					 // Possibly remove ater removing click event listener
					var bounds = sprite.getBounds();
	        var hit = new createjs.Shape();
	        hit.graphics.beginFill('#000').rect(0, 0, bounds.width, bounds.height); 
	        sprite.hitArea = hit;

				  entity.sprite = sprite;

				  // TODO: UNIT TEST!!
					bounds = entity.sprite.getTransformedBounds();
					var physBodyDef = {
						density: 1.0,
            friction: 0,
            restitution: 0,
						halfWidth: bounds.width / 2,
						halfHeight: bounds.height / 2,
						groupIndex: -1,
						pos: { x: entity.sprite.x, y: entity.sprite.y},
						type: 'dynamic',
						userData: {
              'id': 'zombieOne',
              'entity': entity
            }
					};
					var body = physicsEngine.addBody(physBodyDef);
					entity.physBody = body;

					// TODO: UNIT TEST!!
				  entity.onTouch = function(otherBody) {
				  	if(!otherBody) {
				  		return;
				  	}
				  	var physOwner = otherBody.GetUserData();
				  	if(!physOwner) {
				  		return;
				  	}
				  	if(physOwner.id === 'wall') {
				  		var pos = otherBody.GetPosition();
				  		if(pos.x === 0.5) {
				  			sprite.direction = 90;
				  			sprite.scaleX = Math.abs(sprite.scaleX);
				  		}
				  		else {
				  			sprite.direction = -90;
				  			sprite.scaleX = -Math.abs(sprite.scaleX);
				  		}
				  	}
				  };

				  entity.update = function() {
				  	// TODO: UNIT TEST!!
			    	if(sprite.currentAnimation === 'walk') {
					    var velocity = entity.physBody.GetLinearVelocity();
					    entity.physBody.SetAwake(true);
					    if (sprite.direction === 90) {
					      velocity.x = entity.speed;
					    }
					    else {
					      velocity.x = -entity.speed;
					    }
					    // TODO: UNIT TEST!!
					    entity.physBody.SetLinearVelocity(velocity);
					  }
					  entity.sprite.rotation = entity.physBody.GetAngle() * (180 / Math.PI);
				    entity.sprite.x = entity.physBody.GetWorldCenter().x * physicsEngine.SCALE;
						entity.sprite.y = entity.physBody.GetWorldCenter().y * physicsEngine.SCALE;
			    };

			    // To be removed
				  entity.sprite.addEventListener('click', function() {
						if(entity.sprite.currentAnimation === 'walk') {
				      entity.sprite.gotoAndPlay('dieByShot');
				    }
					});

					entity.sprite.on('animationend', function(event) {
				    if(event.name === 'dead') {
				    	entity.dead = true;
				    }
					});
				},

				init: function(loadQueue) {
					zombieOneSpriteSheet.init(loadQueue);
				},
			};
			return entityDecorator;
		};
		return createEntityDecorator();
});
