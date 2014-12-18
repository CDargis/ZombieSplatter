define(['entities/zombie', 'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function(zombieEntity) {
	
	var typesFactory = { 'zombie': zombieEntity }
	var createEntity = function(entityModel) {
		return typesFactory[entityModel.type].createEntity(entityModel.data);
	}

	var createEntities = function(entityModels) {
		var entities = [];
		for(var i = 0; i < entityModels.length; i++) {
			var entityModel = entityModels[i];
			var entity = createEntity(entityModel);
			entities.push(entity);
		}
		return entities;
	}

  return {
  	createEntities: createEntities,
  	createEntity: createEntity
  }
});
