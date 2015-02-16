define(['entities/zombie', 'spriteSheets/zombieOne'],
  function(zombie, zombieOneSpriteSheet) {
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
