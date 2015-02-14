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
          var pos = { x: engine.leftSpawnX, ground: 375 };
          var direction = -90;
          var scaleX = -1.7;
          var rand = getRandomNumberBetween(0, 1);
          if(rand === 1) {
            pos.x = engine.rightSpawnX;
            direction *= -1;
            scaleX *= -1;
          }
          var zombieType = 'zombieOne';
          rand = getRandomNumberBetween(0, 1);
          if(rand === 1) {
            zombieType = 'zombieTwo';
          }
          var spriteDef =
            { direction: direction, scaleX: scaleX, scaleY: 1.7, pos: pos};
          var entityDef = { entityType: zombieType, speed: 0.5, spriteDef: spriteDef};
          return entityDef;
        };

        engine.addPlayer = function() {
          var pos = { x: 375, ground: 375 };
          var spriteDef =
            { direction: 90, scaleX: 0.2, scaleY: 0.2, pos: pos};
          var entityDef = { entityType: 'soldierOne', speed: 7, spriteDef: spriteDef };
          var player = entityFactory.createEntity(entityDef);
          engine.addEntity(player);
        };

        // TODO: UNIT TEST!!
        engine.addZombie = function() {
          var zombieData = engine.generateRandomZombieEntityDef();
          var zombie = entityFactory.createEntity(zombieData);
          engine.addEntity(zombie);
        };

        engine.init = function(loadQueue, stage) {
          engine.entities = [];
          inputEngine.init();
          physicsEngine.init(); // TODO: UNIT TEST!!
          entityFactory.init(loadQueue);
          engine.stage = stage;
          engine.addPlayer(); // Will always be index 0
          engine.addZombie();

          createjs.Ticker.framerate = engine.framerate;
          createjs.Ticker.addEventListener('tick', engine.onTick);
        };

        engine.addEntity = function(entity) {
          engine.stage.addChild(entity.displayObject);
          engine.entities.push(entity);
        };

        engine.removeEntity = function(entity) {
          var index = engine.entities.indexOf(entity);
          if(index !== -1) {
            engine.entities.splice(index, 1);
          }
          physicsEngine.removeBody(entity.physBody); // TODO: UNIT TEST!!
          engine.stage.removeChild(entity.displayObject);
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

          if(inputEngine.actions.SHOOT) {
            var playerEntity = engine.entities[0];
            var direction = playerEntity.displayObject.direction;
            var bounds = playerEntity.displayObject.getTransformedBounds();
            var speed = 0.04;
            var x = playerEntity.displayObject.x + (bounds.width / 2);
            if(direction !== 90) {
              speed = -0.04;
              x = playerEntity.displayObject.x - (bounds.width / 2);
            }
            var pos = { x: x, y: playerEntity.displayObject.y + 5 };
            var bitmapDef = { direction: direction, pos: pos};
            var entityDef = { entityType: 'bullet', speed: speed, bitmapDef: bitmapDef };
            var bullet = entityFactory.createEntity(entityDef);
            engine.addEntity(bullet);
          }

          physicsEngine.update(inputEngine.actions); // TODO: UNIT TEST!!
          engine.stage.update();
        };
        return engine;
      };
    return createGameEngine();
  }
);
