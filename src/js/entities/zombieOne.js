define(['entities/spriteCreator', 'spriteSheets/zombieOne',
	'engine/physics', 'include/box2d', 'include/createJS'],
	function(spriteCreator, zombieOneSpriteSheet, physicsEngine, box2d) {
		var createEntityDecorator = function() {

			var entityDecorator = {

				decorate: function(entity, entityDef) {
					var spriteDef = entityDef.spriteDef;
					var spriteSheet = zombieOneSpriteSheet.create();
					var sprite = spriteCreator.create(spriteSheet, spriteDef);
				  entity.displayObject = sprite;
				  entity.ground = spriteDef.pos.ground;
				  entity.hit = false;

				  // TODO: UNIT TEST!!
					bounds = sprite.getTransformedBounds();
					var physBodyDef = {
						density: 1.0,
            friction: 0,
            restitution: 0,
						halfWidth: bounds.width / 2,
						halfHeight: bounds.height / 2,
						groupIndex: 0,
						pos: { x: sprite.x, y: sprite.y},
						type: 'dynamic',
						userData: {
              'id': 'zombieOne',
              'entity': entity
            }
					};
					var body = physicsEngine.addBody(physBodyDef);
					body.SetSleepingAllowed(false);
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
				  			sprite.direction = -90;
				  			sprite.scaleX = -Math.abs(sprite.scaleX);
				  		}
				  		else {
				  			sprite.direction = 90;
				  			sprite.scaleX = Math.abs(sprite.scaleX);
				  		}
				  	}
				  	else if(physOwner.id === 'bullet' && !entity.hit) {
				  		entity.hit = true;
				  		sprite.gotoAndPlay('die');
				  	}
				  	else if(physOwner.id === 'soldierOne' && sprite.currentAnimation !== 'attack') {
				  		sprite.gotoAndPlay('attack');
				  		physOwner.entity.displayObject.gotoAndPlay('hurt');
				  	}
				  };

				  entity.update = function() {
				  	// TODO: UNIT TEST!!
				  	if(sprite.currentAnimation === 'walk') {
					    if (sprite.direction === 90) {
					    	sprite.x -= entity.speed;
					    }
					    else {
					      sprite.x += entity.speed;
					    }
					  }
					  var bounds = sprite.getTransformedBounds();
				  	var y = entity.ground - (bounds.height / 2);
				  	sprite.y = y;

	          var pos = new box2d.b2Vec2();
	          pos.x = sprite.x / box2d.SCALE;
	          pos.y = sprite.y / box2d.SCALE;
	          var transform = new box2d.b2Transform(pos, new box2d.b2Mat22(0));
	          entity.physBody.SetTransform(transform);
			    };

					sprite.on('animationend', function(event) {
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
