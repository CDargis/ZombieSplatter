define(['lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function() {
  var createGameEngine = function() {
    var engine = {
      width: 750,
      height: 400,
      entities: []
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
    engine.init = function(stage, entities) {
      engine.stage = stage;
      for(var i = 0; i < entities.length; i++) {
        var entity = entities[i];
        entity.init();
        engine.stage.addChild(entity.sprite);
        engine.entities.push(entity);
      }
    }
    createjs.Ticker.addEventListener("tick", engine.onTick);
    return engine;
  }
  return createGameEngine()
});
