define(['engine/input', 'engine/physics', 'entities/entityFactory',
  'include/createJS'],
    function(inputEngine, physicsEngine, entityFactory) {
      var getRandomNumberBetween = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
      };

      var createGameEngine = function() {
        var engine = {
          screenWidth: 750,
          screenHeight: 400,
          entities: [],
          framerate: 60,
          leftSpawnX: 100,
          rightSpawnX: 650
        };

        engine.generateRandomZombieEntityDef = function() {
          var pos = { x: engine.leftSpawnX, y: 375 };
          var rand = getRandomNumberBetween(0, 1);
          if(rand === 1) {
            pos.x = engine.rightSpawnX;
          }
          rand = getRandomNumberBetween(0, 1);
          var direction = 90;
          var scaleX = 1.250;
          if(rand === 1) {
            direction *= -1;
            scaleX *= -1;
          }
          var spriteDef =
            { direction: direction, scaleX: scaleX, scaleY: 1.2,
                pos: pos, initialAnimation: 'spawn'};
          var entityDef = { entityType: 'zombieOne', speed: 2, spriteDef: spriteDef};
          return entityDef;
        };

        engine.addPlayer = function() {
          var pos = { x: 375, y: 375 };
          var spriteDef =
            { direction: 90, scaleX: '.2', scaleY: '.2',
              pos: pos, initialAnimation: 'idle'};
          var entityDef = { entityType: 'soldierOne', speed: 9, spriteDef: spriteDef };
          var player = entityFactory.createEntity(entityDef);
          engine.addEntity(player, 'dynamic');
        };

        // Unit test!!
        engine.addZombie = function() {
          var zombieData = engine.generateRandomZombieEntityDef();
          var zombie = entityFactory.createEntity(zombieData);
          engine.addEntity(zombie, 'dynamic');
        };

        engine.init = function(loadQueue, stage) {
          engine.entities = [];
          inputEngine.init();
          physicsEngine.init();
          entityFactory.init(loadQueue);
          engine.stage = stage;
          engine.addPlayer(); // Will always be index 0
          engine.addZombie();

          createjs.Ticker.framerate = engine.framerate;
          createjs.Ticker.addEventListener('tick', engine.onTick);
        };

        engine.addEntity = function(entity, type) {
          engine.stage.addChild(entity.sprite);
          engine.entities.push(entity);
        };

        engine.removeEntity = function(entity) {
          var index = engine.entities.indexOf(entity);
          if(index !== -1) {
            engine.entities.splice(index, 1);
          }
          if(entity.physBody) {
            physicsEngine.removeBody(entity.physBody);
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
          }

          for(i = 0; i < entitiesToRemove.length; i++) {
            engine.removeEntity(entitiesToRemove[i]);
          }

          // Check how many entities we have and spawn a new zombie if needed
          if(engine.entities.length === 1) {
            engine.addZombie();
          }

          physicsEngine.update(inputEngine.actions);
          engine.stage.update();
        };
        return engine;
      };
    return createGameEngine();
  }
);
