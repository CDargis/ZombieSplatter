define(['entities/entityFactory', 'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function(entityFactory) {
  var createGameEngine = function() {
    var engine = {
      screenWidth: 750,
      screenHeight: 400,
      entities: []
    };
    engine.init = function(stage, entities) {
      engine.stage = stage;
      for(var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        engine.addEntity(entity);
      }
    }
    engine.addEntity = function(entity) {
      entity.init();
      engine.stage.addChild(entity.sprite);
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
      var entitiesToRemove = [];

      for(var i = 0; i < engine.entities.length; i++) {
        var entity = engine.entities[i];
        if(entity.dead === true) {
          entitiesToRemove.push(entity);
        }
        else {
          entity.update(event, { width: engine.screenWidth, height: engine.screenHeight });
        }
      }

      for(var i = 0; i < entitiesToRemove.length; i++) {
        engine.removeEntity(entitiesToRemove[i]);
      }

      // Check how many entities we have and spawn a new one if needed
      if(engine.entities.length === 0) {
        var x = Math.floor(Math.random() * (engine.screenWidth - 50)) + 1;
        var entityModel = {type: 'zombie', data: { direction: 90, vX: 3, x: x, y: 250 }};
        var entity = entityFactory.createEntity(entityModel);
        engine.addEntity(entity);
      }

      engine.stage.update();
    };
    createjs.Ticker.addEventListener("tick", engine.onTick);
    return engine;
  }
  return createGameEngine()
});
