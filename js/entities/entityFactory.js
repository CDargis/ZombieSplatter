define(['entities/zombie', 'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function(zombieEntity) {

	var baseEntityModel = function(type) {
		return {
			type: type,
			dead: false,
			update: function() {}
		}
	}

	var decoratorFactory = { 'zombie': zombieEntity }
	
	var createEntity = function(entityData) {
		var entity = baseEntityModel(entityData.type);
		decoratorFactory[entityData.type].decorate(entity, entityData.spriteData);
		return entity;
	}

	var createEntities = function(entityDataArray) {
		var entities = [];
		for(var i = 0; i < entityDataArray.length; i++) {
			var entityData = entityDataArray[i];
			var entity = createEntity(entityData);
			entities.push(entity);
		}
		return entities;
	}

  return {
  	createEntities: createEntities,
  	createEntity: createEntity
  }
});
