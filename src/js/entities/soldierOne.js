define(['entities/spriteCreator', 'spriteSheets/soldierOne',
	'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs', 'lib/box2dWeb'],
	function(spriteCreator, soldierOneSpriteSheet) {
		var b2Vec2 = Box2D.Common.Math.b2Vec2;

		var createEntityDecorator = function() {

			var entityDecorator = {

				decorate: function(entity, spriteDef) {
					var spriteSheet = soldierOneSpriteSheet.create();
					var sprite = spriteCreator.create(spriteSheet, spriteDef);
				  entity.sprite = sprite;

				  entity.onTouch = function(otherBody, impulse) {
				  	// console.log("sold" + otherBody);
				  }

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

				  	// Old implementaton
			    // 	if(currentAnimation === 'run') {
					  //   if (sprite.direction === 90) {
					  //     sprite.x += entity.speed;
					  //   }
					  //   else {
					  //     sprite.x -= entity.speed;
					  //   }
					  // }

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
					  entity.sprite.x = entity.physBody.GetWorldCenter().x * data.scale;
						entity.sprite.y = entity.physBody.GetWorldCenter().y * data.scale;

						// Forces
						// var force = 0;
			   //  	if(actions.LEFT) {
			   //  		force = -250 * entity.speed;
			   //  	}
			   //  	else if(actions.RIGHT) {
			   //  		force = 250 * entity.speed;
			   //  	}
			   //  	else {
			   //  		entity.physBody.SetLinearVelocity(new b2Vec2(0,0));
			   //  		entity.physBody.SetLinearDamping(12.0);
			   //  	}
			   //  	if(force !== 0) {
			   //  		entity.physBody.ApplyForce(new b2Vec2(force, 0), entity.physBody.GetWorldCenter());
			   //  	}
			   //  	entity.sprite.rotation = entity.physBody.GetAngle() * (180 / Math.PI);
					 //  entity.sprite.x = entity.physBody.GetWorldCenter().x * data.scale;
						// entity.sprite.y = entity.physBody.GetWorldCenter().y * data.scale;
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
