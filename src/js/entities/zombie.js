define(['engine/physics', 'include/box2d', 'lib/createjs'],
  function(physicsEngine, box2d) {
    var createEntityDecorator = function() {

      var entityDecorator = {

        decorate: function(entity, entityDef, spriteSheet) {
          var spriteDef = entityDef.spriteDef;
          entity.ground = spriteDef.pos.ground;
          entity.speed = entityDef.speed;
          var sprite = new createjs.Sprite(spriteSheet, 'walk');
          sprite.direction = spriteDef.direction;
          sprite.scaleX = spriteDef.scaleX;
          sprite.scaleY = spriteDef.scaleY;

          entity.displayObject = sprite;
          sprite.x = spriteDef.pos.x;
          sprite.y = entity.computeY();

          // TODO: UNIT TEST!!
          var bounds = sprite.getTransformedBounds();
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
              'id': entityDef.entityType,
              'entity': entity
            }
          };
          var body = physicsEngine.addBody(physBodyDef);
          body.SetSleepingAllowed(false);
          entity.physBody = body;

          // TODO: UNIT TEST!!
          entity.onTouchStart = function(otherBody, worldPoints, cancelCb) {
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
            else if(physOwner.id === 'bullet' && sprite.currentAnimation !== 'die' &&
              sprite.currentAnimation !== 'dead') {
              var collisionPoint = entity.physBody.GetLocalPoint(worldPoints[0]);
              if(collisionPoint.x < 0) { // Left side
                sprite.direction = 90;
                sprite.scaleX = Math.abs(sprite.scaleX);
              }
              else {
                sprite.direction = -90;
                sprite.scaleX = -Math.abs(sprite.scaleX);
              }
              createjs.Sound.play('splatterOne');
              sprite.gotoAndPlay('die');
            }
            else if(physOwner.id === 'soldierOne' && sprite.currentAnimation !== 'attack' &&
              sprite.currentAnimation !== 'die' && sprite.currentAnimation !== 'dead') {
                sprite.gotoAndPlay('attack');
                physOwner.entity.displayObject.gotoAndPlay('hurt');
                cancelCb();
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

      };
      return entityDecorator;
    };
    return createEntityDecorator();
});