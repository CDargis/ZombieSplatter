define(['entities/entityFactory', 'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function(entityFactory) {
  var getRandomNumberBetween = function(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var createGameEngine = function() {
    var engine = {
      screenWidth: 750,
      screenHeight: 400,
      entities: []
    };

    engine.minSpawnX = 50;
    engine.maxSpawnX = engine.screenWidth - 50;

    engine.generateRandomZombieEntityData = function() {
      var x = getRandomNumberBetween(engine.minSpawnX, engine.maxSpawnX);
      var rand = getRandomNumberBetween(0, 1);
      var direction = 90;
      var scaleX = 1;
      if(rand === 1) {
        direction *= -1;
        scaleX *= -1;
      }
      return { entityType: 'zombieOne', spriteData:
                { direction: direction, scaleX: scaleX, vX: 3, x: x, y: 250 } };
    };

    engine.init = function(loadQueue, stage) {
      entityFactory.init(loadQueue);
      engine.stage = stage;
      var entityData = engine.generateRandomZombieEntityData();
      var entity = entityFactory.createEntity(entityData);
      engine.addEntity(entity);
      createjs.Ticker.addEventListener('tick', engine.onTick);
    };

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
    };

    engine.onTick = function() {
      var entitiesToRemove = [];
      var entity = {};

      for(var i = 0; i < engine.entities.length; i++) {
        entity = engine.entities[i];
        if(entity.dead === true) {
          entitiesToRemove.push(entity);
        }
        else {
          entity.update({ minX: engine.minSpawnX, maxX: engine.maxSpawnX, height: engine.screenHeight });
        }
      }

      for(i = 0; i < entitiesToRemove.length; i++) {
        engine.removeEntity(entitiesToRemove[i]);
      }

      // Check how many entities we have and spawn a new one if needed
      if(engine.entities.length === 0) {
        var entityData = engine.generateRandomZombieEntityData();
        entity = entityFactory.createEntity(entityData);
        engine.addEntity(entity);
      }

      engine.stage.update();
    };
    return engine;
  };
  return createGameEngine();
});
