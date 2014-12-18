define(['entities/entityFactory', 'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function(entityFactory) {
  var createGameEngine = function() {
    var engine = {
      width: 750,
      height: 400,
      entities: []
    };
    engine.init = function(stage, entities) {
      engine.stage = stage;
      for(var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        entity.init();
        engine.stage.addChild(entity.sprite);
        engine.entities.push(entity);
      }
    }
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
      // Check how many entities we have and spawn a new one if needed
      if(engine.entities.length === 0) {
        // entityFactory.createEntity({type: 'zombie', data: { direction: 90, vX: 3, x: 16, y: 250 }});
      }

      for(var i = 0; i < engine.entities.length; i++) {
        var entity = engine.entities[i];
        entity.update(event, { width: engine.width, height: engine.height });
      }
      engine.stage.update();
    };
    createjs.Ticker.addEventListener("tick", engine.onTick);
    return engine;
  }
  return createGameEngine()
});
