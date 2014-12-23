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
			entityTypes: {
				'zombieOne': zombieEntityOne
			},

			createEntity: function(entityData) {
				var entity = baseEntity(entityData.type);
				factory.entityTypes[entityData.type].decorate(entity, entityData.spriteData);
				return entity;
			},

			createEntities: function(entityDataArray) {
				var entities = [];
				for(var i = 0; i < entityDataArray.length; i++) {
					var entityData = entityDataArray[i];
					var entity = factory.createEntity(entityData);
					entities.push(entity);
				}
				return entities;
			},

			init: function(loadQueue) {
				for(var entityType in factory.entityTypes) {
					if(factory.entityTypes.hasOwnProperty(entityType)) {
						factory.entityTypes[entityType].init(loadQueue);
					}
				}
			}
		};
		return factory;
	};

  return createEntityFactoryModel();
});
