define(['entities/spriteCreator', 'spriteSheets/zombieOne',
	'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs', 'lib/box2dWeb'],
	function(spriteCreator, zombieOneSpriteSheet) {
		var b2Vec2 = Box2D.Common.Math.b2Vec2;

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

				  entity.onTouch = function(otherBody, impulse) {
				  	if(!otherBody) return;
				  	var physOwner = otherBody.GetUserData();
				  	if(!physOwner) return;
				  	if(physOwner.id === 'wall') {
				  		var pos = otherBody.GetPosition();
				  		if(pos.x === .5) {
				  			sprite.direction = 90;
				  			sprite.scaleX = Math.abs(sprite.scaleX);
				  		}
				  		else {
				  			sprite.direction = -90;
				  			sprite.scaleX = -Math.abs(sprite.scaleX);
				  		}
				  	}
				  }

				  entity.update = function(data) {
			    	if(sprite.currentAnimation === 'walk') {
					    // if (sprite.x >= data.maxX) {
					    //   sprite.direction = -90;
					    //   sprite.scaleX = -Math.abs(sprite.scaleX);
					    // }

					    // if (sprite.x < data.minX) {
					    //   sprite.direction = 90;
					    //   sprite.scaleX = Math.abs(sprite.scaleX);
					    // }

					    // if (sprite.direction === 90) {
					    //   sprite.x += entity.speed;
					    // }
					    // else {
					    //   sprite.x -= entity.speed;
					    // }

					    var velocity = entity.physBody.GetLinearVelocity();
					    entity.physBody.SetAwake(true);
					    if (sprite.direction === 90) {
					      velocity.x = entity.speed;
					    }
					    else {
					      velocity.x = -entity.speed;
					    }
					    entity.sprite.rotation = entity.physBody.GetAngle() * (180 / Math.PI);
					    entity.sprite.x = entity.physBody.GetWorldCenter().x * data.scale;
							entity.sprite.y = entity.physBody.GetWorldCenter().y * data.scale;

					  //   var force = 0;
					  //   if(sprite.direction === -90) {
				   //  		force = -50 * entity.speed;
				   //  	}
				   //  	else {
				   //  		force = 50 * entity.speed;
				   //  	}
				   //  	entity.physBody.ApplyForce(new b2Vec2(force, 0), entity.physBody.GetWorldCenter());
					  //   entity.sprite.rotation = entity.physBody.GetAngle() * (180 / Math.PI);
					  //   entity.sprite.x = entity.physBody.GetWorldCenter().x * data.scale;
							// entity.sprite.y = entity.physBody.GetWorldCenter().y * data.scale;
					  }
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
