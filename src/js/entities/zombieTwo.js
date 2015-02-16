define(['entities/zombie', 'spriteSheets/zombieTwo'],
  function(zombie, zombieTwoSpriteSheet) {
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
