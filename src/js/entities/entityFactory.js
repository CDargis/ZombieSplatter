define(['entities/zombieOne', 'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function(zombieEntityOne) {

	var createEntityFactoryModel = function() {
		var baseEntity = function(type) {
			return {
				type: type,
				dead: false,
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
				var entity = baseEntity(entityData.type);
				factory.entityMap[entityData.type].decorate(entity, entityData.spriteData);
				return entity;
			},
		};
		return factory;
	};

  return createEntityFactoryModel();
});
