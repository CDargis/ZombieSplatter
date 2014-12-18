require(['entities/entityFactory', 'engine/gameEngine', 'lib/easeljs'], function(entityFactory, gEngine) {
  var entities = entityFactory.createEntities([{type: 'zombie', data: { direction: 90, vX: 3, x: 16, y: 250 }}]);
  var stage = new createjs.Stage('gameCanvas');
	gEngine.init(stage, entities);
});
