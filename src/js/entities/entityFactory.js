define(['entities/zombieOne', 'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function(zombieEntityOne) {

	var baseEntity = function(type) {
		return {
			type: type,
			dead: false,
			update: function() {}
		};
	};

	var entityTypes = { 
		'zombieOne': zombieEntityOne
	};

	var createEntity = function(entityData) {
		var entity = baseEntity(entityData.type);
		entityTypes[entityData.type].decorate(entity, entityData.spriteData);
		return entity;
	};

	var createEntities = function(entityDataArray) {
		var entities = [];
		for(var i = 0; i < entityDataArray.length; i++) {
			var entityData = entityDataArray[i];
			var entity = createEntity(entityData);
			entities.push(entity);
		}
		return entities;
	};

	var init = function(loadQueue) {
		for(var entityType in entityTypes) {
			if(entityTypes.hasOwnProperty(entityType)) {
				entityTypes[entityType].init(loadQueue);
			}
		}
	};

  return {
  	init: init,
  	createEntities: createEntities,
  	createEntity: createEntity
  };
});
