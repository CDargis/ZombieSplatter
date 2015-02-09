define(['bitmaps/bullet', 'engine/physics', 'include/box2d', 'include/createJS'],
	function(bulletBitmap, physicsEngine, box2d) {
		var createEntityDecorator = function() {

			var entityDecorator = {
				decorate: function(entity, bitmapDef) {
					var bitmap = bulletBitmap.create();
					bitmap.x = bitmapDef.pos.x;
					bitmap.y = bitmapDef.pos.y
					entity.displayObject = bitmap;

          var physBodyDef = {
            density: 0.1,
            friction: 0,
            restitution: 0,
            halfWidth: 1.5,
            halfHeight: 1.5,
            groupIndex: 0,
            isBullet: true,
            pos: { x: bitmap.x, y: bitmap.y },
            type: 'dynamic',
            userData: {
              'id': 'bullet',
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
				  	if(physOwner.id !== 'bullet') {
				  		entity.dead = true;
				  	}
				  };

          entity.update = function(data) {
          	var velocity = body.GetLinearVelocity();
	          velocity.x = entity.speed;
	          body.SetLinearVelocity(velocity);

	          bitmap.rotation = entity.physBody.GetAngle() * (180 / Math.PI);
					  bitmap.x = entity.physBody.GetWorldCenter().x * box2d.SCALE;
						bitmap.y = entity.physBody.GetWorldCenter().y * box2d.SCALE;
          }
				},
				init: function(loadQueue) {
					bulletBitmap.init(loadQueue);
				},
			};
			return entityDecorator;
		};
	return createEntityDecorator();
});
