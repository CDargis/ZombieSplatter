define(['engine/input', 'entities/entityFactory', 'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'],
  function(inputEngine, entityFactory) {
    var getRandomNumberBetween = function(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    var createGameEngine = function() {
      var engine = {
        screenWidth: 750,
        screenHeight: 400,
        entities: []
      };

      engine.minX = 75;
      engine.maxX = engine.screenWidth - 75;

      engine.generateRandomZombieEntityData = function() {
        var x = getRandomNumberBetween(engine.minX, engine.maxX);
        var rand = getRandomNumberBetween(0, 1);
        var direction = 90;
        var scaleX = 1.250;
        if(rand === 1) {
          direction *= -1;
          scaleX *= -1;
        }
        return { entityType: 'zombieOne', spriteData:
                  { direction: direction, scaleX: scaleX, scaleY: 1.2, vX: 3, x: x, y: 250 } };
      };

      engine.addPlayer = function() {
        var playerSpriteData = { direction: 90, scaleX: '.2', scaleY: '.2', vX: 6, x: 200, y: 250 };
        var playerData = { entityType: 'soldierOne', spriteData: playerSpriteData };
        var player = entityFactory.createEntity(playerData);
        engine.addEntity(player);
      };

      engine.init = function(loadQueue, stage) {
        engine.entities = [];
        inputEngine.init();
        entityFactory.init(loadQueue);
        engine.stage = stage;
        engine.addPlayer(); // Will always be index 0

        var zombieData = engine.generateRandomZombieEntityData();
        var zombie = entityFactory.createEntity(zombieData);
        engine.addEntity(zombie);
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
            var data = { minX: engine.minX, maxX: engine.maxX, height: engine.screenHeight,
              actions: inputEngine.actions};
            entity.update(data);
          }
        }

        for(i = 0; i < entitiesToRemove.length; i++) {
          engine.removeEntity(entitiesToRemove[i]);
        }

        // Check how many entities we have and spawn a new one if needed
        if(engine.entities.length === 1) {
          var zombieData = engine.generateRandomZombieEntityData();
          entity = entityFactory.createEntity(zombieData);
          engine.addEntity(entity);
        }

        engine.stage.update();
      };
      return engine;
    };
    return createGameEngine();
});
