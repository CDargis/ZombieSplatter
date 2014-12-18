require(['entities/entityFactory', 'engine/gameEngine', 'lib/easeljs'], function(entityFactory, gEngine) {
  var stage = new createjs.Stage('gameCanvas');
  gEngine.init(stage);
});
