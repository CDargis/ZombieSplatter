var createEntities = function(gameEngine) {
  var zombieEntity = createZombieEntity({ direction: 90, vX: 3, x: 16, y: 250 });
  gameEngine.addEntity(zombieEntity);
}

var createGameEngine = function(stage) {
  var engine = {
    width: 750,
    height: 400,
    entities: [],
    stage: stage
  };
  engine.addEntity = function(entity) {
    engine.entities.push(entity);
  };
  engine.removeEntity = function(entity) {
    var index = engine.entities.indexOf(entity);
    if(index !== -1) {
      engine.entities.splice(index, 1);
    }
    engine.stage.removeChild(entity.sprite);
  }
  engine.onTick = function(event) {
    for(var i = 0; i < engine.entities.length; i++) {
      var entity = engine.entities[i];
      entity.update(event, { width: engine.width, height: engine.height });
    }
    engine.stage.update();
  };
  engine.init = function() {
    for(var i = 0; i < engine.entities.length; i++) {
      var entity = engine.entities[i];
      entity.init();
      engine.stage.addChild(entity.sprite);
    }
  }
  createjs.Ticker.addEventListener("tick", engine.onTick);
  return engine;
}

function initGame() {
  var stage = new createjs.Stage("demoCanvas");
  var gameEngine = createGameEngine(stage);

  createEntities(gameEngine);

  gameEngine.init();
}
