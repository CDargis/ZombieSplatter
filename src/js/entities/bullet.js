define(['bitmaps/bullet', 'engine/physics', 'include/box2d', 'lib/createjs'],
  function(bulletBitmap, physicsEngine, box2d) {
    var createEntityDecorator = function() {

      var entityDecorator = {
        decorate: function(entity, entityDef) {
          var bitmapDef = entityDef.bitmapDef;
          var bitmap = bulletBitmap.create();
          bitmap.x = bitmapDef.pos.x;
          bitmap.y = bitmapDef.pos.y;
          entity.displayObject = bitmap;

          var physBodyDef = {
            density: 0.1,
            friction: 0,
            restitution: 0,
            halfWidth: 2.5,
            halfHeight: 1,
            groupIndex: -1,
            isBullet: true,
            pos: { x: bitmap.x, y: bitmap.y },
            type: 'dynamic',
            userData: {
              'id': 'bullet',
              'entity': entity
            }
          };
          var body = physicsEngine.addBody(physBodyDef);
          var center = body.GetWorldCenter();
          body.ApplyImpulse(new box2d.b2Vec2(entityDef.dirVec.x, entityDef.dirVec.y), center);
          entity.physBody = body;

          entity.onTouchStart = function(otherBody, contactPoints, cancelCb) {
            if(!otherBody) {
              return;
            }
            var physOwner = otherBody.GetUserData();
            if(!physOwner) {
              return;
            }
            if(physOwner.id !== 'bullet') {
              entity.dead = true;
              cancelCb();
            }
          };

          entity.update = function() {
            bitmap.rotation = entity.physBody.GetAngle() * (180 / Math.PI);
            bitmap.x = (entity.physBody.GetWorldCenter().x * box2d.SCALE);
            bitmap.y = (entity.physBody.GetWorldCenter().y * box2d.SCALE);
          };
        },
        init: function(loadQueue) {
          bulletBitmap.init(loadQueue);
        },
      };
      return entityDecorator;
    };
  return createEntityDecorator();
});
