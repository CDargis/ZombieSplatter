requirejs(['engine/gameEngine', 'entities/zombie', 'lib/easeljs'], function(gEngine, zEntity) {
	var createEntities = function() {
    var zombieEntity = zEntity.createZombie({ direction: 90, vX: 3, x: 16, y: 250 });
    return [zombieEntity];
  }

  var entities = createEntities();
  var stage = new createjs.Stage("demoCanvas");
	gEngine.init(stage, entities);
});
