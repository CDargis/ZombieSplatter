define(['entities/spriteCreator', 'spriteSheets/soldierOne',
	'engine/physics', 'include/box2d', 'include/createJS'],
	function(spriteCreator, soldierOneSpriteSheet, physicsEngine, box2d) {

		var createEntityDecorator = function() {

			var entityDecorator = {
				decorate: function(entity, entityDef) {
					var spriteDef = entityDef.spriteDef;
					var spriteSheet = soldierOneSpriteSheet.create();
					var sprite = spriteCreator.create(spriteSheet, spriteDef);
				  entity.displayObject = sprite;
				  entity.ground = spriteDef.pos.ground;
				  entity.onLeftWall = false;
				  entity.onRightWall = false;

				  // TODO: UNIT TEST!!
					var bounds = sprite.getTransformedBounds();
					var physBodyDef = {
						density: 1.0,
            friction: 0,
            restitution: 0,
						halfWidth: bounds.width / 2,
						halfHeight: bounds.height / 2,
						groupIndex: -1,
						pos: { x: sprite.x, y: sprite.y },
						type: 'dynamic',
						userData: {
              'id': 'soldierOne',
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
				  			entity.onLeftWall = true;
				  		}
				  		else {
				  			entity.onRightWall = true;
				  		}
				  	}
				  };

				  entity.update = function(data) {
				  	var currentAnimation = sprite.currentAnimation;
				  	var actions = data.actions;
				  	if(actions.LEFT) {
				  		entity.onRightWall = false;
				  		sprite.scaleX = -Math.abs(sprite.scaleX);
				  		sprite.direction = -90;
				  		if(sprite.currentAnimation !== 'run') {
				  			sprite.gotoAndPlay('run');
				  		}
				  	}
				  	else if(actions.RIGHT) {
				  		entity.onLeftWall = false;
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
				  		currentAnimation !== 'crouched' && currentAnimation !== 'shoot'
				  		&& currentAnimation !== 'die' && currentAnimation !== 'dead' &&
				  		currentAnimation !== 'hurt') {
				  		sprite.gotoAndPlay('idle');
				  	}

				  	// TODO: UNIT TEST!!
					  // Setting the linear velocity
					  var velocity = entity.physBody.GetLinearVelocity();
			    	if(currentAnimation === 'run') {
			    		if(sprite.direction === 90 && !entity.onRightWall) {
					    	sprite.x += entity.speed;
					    }
					    else if(sprite.direction === -90 && !entity.onLeftWall) {
					      sprite.x -= entity.speed;
					    }
					  }
					  var bounds = sprite.getTransformedBounds();
				  	var currentFrame = sprite.currentFrame;
				  	var y = entity.ground - (bounds.height / 2);
				  	sprite.y = y;

					  var pos = new box2d.b2Vec2();
	          pos.x = sprite.x / box2d.SCALE;
	          pos.y = sprite.y / box2d.SCALE;
	          var transform = new box2d.b2Transform(pos, new box2d.b2Mat22(0));
	          entity.physBody.SetTransform(transform);

	      //      var fixture = entity.physBody.GetFixtureList();
					  // entity.physBody.DestroyFixture(fixture);
					  // var fixtureDef = new box2d.b2FixtureDef();

					  // fixtureDef.density = 1;
	      //     fixtureDef.friction = 0;
	      //     fixtureDef.restitution = 0;
	      //     fixtureDef.shape = new box2d.b2PolygonShape();
	      //     fixtureDef.shape.SetAsBox(bounds.width / 2 / box2d.SCALE,
	      //     	bounds.height / 2 / box2d.SCALE);

	      //     var filter = new box2d.b2FilterData();
	      //     filter.groupIndex = -1;
	      //     fixtureDef.filter = filter;
	          
	      //     entity.physBody.CreateFixture(fixtureDef);

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
