define(['entities/zombie', 'spriteSheets/zombieOne',
  'engine/physics', 'include/box2d', 'lib/createjs'],
  function(zombie, zombieOneSpriteSheet, physicsEngine, box2d) {
    var createEntityDecorator = function() {

      var entityDecorator = {

        decorate: function(entity, entityDef) {
          var spriteSheet = zombieOneSpriteSheet.create();
          zombie.decorate(entity, entityDef, spriteSheet);
        },

        init: function(loadQueue) {
          zombieOneSpriteSheet.init(loadQueue);
        },
      };
      return entityDecorator;
    };
    return createEntityDecorator();
});
