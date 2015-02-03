define(['entities/soldierOne', 'entities/zombieOne'],
	function(soldierOneEntity, zombieOneEntity) {

		var createEntityFactory = function() {
			var baseEntity = function(entityType, speed) {
				return {
					dead: false,
					entityType: entityType,
					ontouch: function() {},
					physBody: {},
					speed: speed,
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

				createEntity: function(entityDef) {
					var entity = baseEntity(entityDef.entityType, entityDef.speed);
					factory.decorators[entityDef.entityType].decorate(entity, entityDef.spriteDef);
					return entity;
				},
			};
			return factory;
		};

	  return createEntityFactory();
});
