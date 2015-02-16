define(['entities/zombie', 'spriteSheets/zombieTwo',
  'engine/physics', 'include/box2d', 'lib/createjs'],
  function(zombie, zombieTwoSpriteSheet, physicsEngine, box2d) {
    var createEntityDecorator = function() {

      var entityDecorator = {

        decorate: function(entity, entityDef) {
          var spriteSheet = zombieTwoSpriteSheet.create();
          zombie.decorate(entity, entityDef, spriteSheet);
        },

        init: function(loadQueue) {
          zombieTwoSpriteSheet.init(loadQueue);
        },
      };
      return entityDecorator;
    };
    return createEntityDecorator();
});
