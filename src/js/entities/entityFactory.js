define(['entities/soldierOne', 'entities/zombieOne', 'entities/zombieTwo', 'entities/bullet'],
  function(soldierOneEntity, zombieOneEntity, zombieTwoEntity, bulletEntity) {

    var createEntityFactory = function() {
      var baseEntity = function(entityType) {
        var e = {
          computeY: function() {
            var transformedBounds = e.displayObject.getTransformedBounds();
            var y = e.ground - (transformedBounds.height / 2);
            return y;
          },
          dead: false,
          displayObject: {},
          entityType: entityType,
          ground: 0,
          onTouchStart: function() {},
          physBody: {},
          update: function() {}
        };
        return e;
      };

      var factory = {
        decorators: {
          'soldierOne': soldierOneEntity,
          'zombieOne': zombieOneEntity,
          'zombieTwo': zombieTwoEntity,
          'bullet': bulletEntity
        },

        createEntity: function(entityDef) {
          var entity = baseEntity(entityDef.entityType);
          factory.decorators[entityDef.entityType].decorate(entity, entityDef);
          return entity;
        },

        init: function(loadQueue) {
          for(var entityType in factory.decorators) {
            if(factory.decorators.hasOwnProperty(entityType)) {
              factory.decorators[entityType].init(loadQueue);
            }
          }
        },
      };
      return factory;
    };
    return createEntityFactory();
});
