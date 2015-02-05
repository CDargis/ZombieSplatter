define(['entities/spriteCreator', 'spriteSheets/soldierOne',
	'engine/physics', 'include/createJS'],
	function(spriteCreator, soldierOneSpriteSheet, physicsEngine) {

		var createEntityDecorator = function() {

			var entityDecorator = {

				decorate: function(entity, spriteDef) {
					var spriteSheet = soldierOneSpriteSheet.create();
					var sprite = spriteCreator.create(spriteSheet, spriteDef);
				  entity.sprite = sprite;

				  // TODO: UNIT TEST!!
					var bounds = entity.sprite.getTransformedBounds();
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
              'id': 'soldierOne',
              'entity': entity
            }
					};
					var body = physicsEngine.addBody(physBodyDef);
					entity.physBody = body;

				  entity.update = function(data) {
				  	var currentAnimation = sprite.currentAnimation;
				  	var actions = data.actions;
				  	if(actions.LEFT) {
				  		sprite.scaleX = -Math.abs(sprite.scaleX);
				  		sprite.direction = -90;
				  		if(sprite.currentAnimation !== 'run') {
				  			sprite.gotoAndPlay('run');
				  		}
				  	}
				  	else if(actions.RIGHT) {
				  		sprite.scaleX = Math.abs(sprite.scaleX); 
				  		sprite.direction = 90; 
				  		if(sprite.currentAnimation !== 'run') {
				  			sprite.gotoAndPlay('run');
				  		}
				  	}
				  	else if(actions.SHOOT && currentAnimation !== 'shoot') {
				  		sprite.gotoAndPlay('shoot');
				  	}
				  	else if(actions.DOWN && currentAnimation !== 'crouch' &&
				  			currentAnimation !== 'crouched' && currentAnimation !== 'exitCrouch') {
				  		sprite.gotoAndPlay('crouch');
				  	}
				  	else if(actions.DOWN && currentAnimation === 'crouched') {
				  		sprite.gotoAndPlay('exitCrouch');
				  	}
				  	else if (currentAnimation !== 'crouch' && currentAnimation !== 'exitCrouch' &&
				  		currentAnimation !== 'crouched' && currentAnimation !== 'shoot') {
				  		sprite.gotoAndPlay('idle');
				  	}

				  	// TODO: UNIT TEST!!
					  // Setting the linear velocity
					  var velocity = entity.physBody.GetLinearVelocity();
			    	if(currentAnimation === 'run') {
			    		entity.physBody.SetAwake(true);
					    if (sprite.direction === 90) {
					      velocity.x = entity.speed;
					    }
					    else {
					      velocity.x = -entity.speed;
					    }
					  }
					  else {
					  	velocity.x = 0;
					  }
					  entity.physBody.SetLinearVelocity(velocity);
					 	entity.sprite.rotation = entity.physBody.GetAngle() * (180 / Math.PI);
					  entity.sprite.x = entity.physBody.GetWorldCenter().x * physicsEngine.SCALE;
						entity.sprite.y = entity.physBody.GetWorldCenter().y * physicsEngine.SCALE;
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
