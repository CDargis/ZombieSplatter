define(['entities/zombie', 'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function(zombieEntity) {

	var baseEntityModel = function(type) {
		return {
			type: type,
			dead: false,
			update: function() {}
		}
	}

	var decoratorFactory = { 'zombie': zombieEntity }
	var createEntity = function(entityModel) {
		var entity = baseEntityModel(entityModel.type);
		decoratorFactory[entityModel.type].decorate(entity, entityModel.data);
		return entity;
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
