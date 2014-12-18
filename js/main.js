require(['entities/entityFactory', 'engine/gameEngine', 'lib/easeljs'], function(entityFactory, gEngine) {
  var entities = entityFactory.createEntities([{type: 'zombieOne', spriteData: { direction: 90, scaleX: 1, vX: 3, x: 16, y: 250 }}]);
  var stage = new createjs.Stage('gameCanvas');
	gEngine.init(stage, entities);
});
