define(['entities/zombieOne', 'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function(zombieEntityOne) {

	var createEntityFactory = function() {
		var baseEntity = function(entityType) {
			return {
				dead: false,
				entityType: entityType,
				sprite: {},
				update: function() {}
			};
		};

		var factory = {
			entityMap: {
				'zombieOne': zombieEntityOne
			},

			init: function(loadQueue) {
				for(var entityType in factory.entityMap) {
					if(factory.entityMap.hasOwnProperty(entityType)) {
						factory.entityMap[entityType].init(loadQueue);
					}
				}
			},

			createEntity: function(entityData) {
				var entity = baseEntity(entityData.entityType);
				factory.entityMap[entityData.entityType].decorate(entity, entityData.spriteData);
				return entity;
			},
		};
		return factory;
	};

  return createEntityFactory();
});
