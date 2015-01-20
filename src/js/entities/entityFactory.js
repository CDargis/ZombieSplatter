define(['entities/soldierOne', 'entities/zombieOne', 'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'],
	function(soldierOneEntity, zombieOneEntity) {

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
				decorators: {
					'soldierOne': soldierOneEntity,
					'zombieOne': zombieOneEntity
				},

				init: function(loadQueue) {
					for(var entityType in factory.decorators) {
						if(factory.decorators.hasOwnProperty(entityType)) {
							factory.decorators[entityType].init(loadQueue);
						}
					}
				},

				createEntity: function(entityData) {
					var entity = baseEntity(entityData.entityType);
					factory.decorators[entityData.entityType].decorate(entity, entityData.spriteData);
					return entity;
				},
			};
			return factory;
		};

	  return createEntityFactory();
});
