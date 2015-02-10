define(['entities/soldierOne', 'entities/zombieOne', 'entities/zombieTwo', 'entities/bullet'],
	function(soldierOneEntity, zombieOneEntity, zombieTwoEntity, bulletEntity) {

		var createEntityFactory = function() {
			var baseEntity = function(entityType, speed) {
				return {
					bitmap: {},
					dead: false,
					entityType: entityType,
					onTouchStart: function() {},
					physBody: {},
					speed: speed,
					displayObject: {},
					update: function() {}
				};
			};

			var factory = {
				decorators: {
					'soldierOne': soldierOneEntity,
					'zombieOne': zombieOneEntity,
					'zombieTwo': zombieTwoEntity,
					'bullet': bulletEntity
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
					factory.decorators[entityDef.entityType].decorate(entity, entityDef);
					return entity;
				},
			};
			return factory;
		};
	  return createEntityFactory();
});
