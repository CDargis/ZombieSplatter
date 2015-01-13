define(['engine/game', 'engine/input', 'entities/entityFactory'],
	function(gameEngine, inputEngine, entityFactory) {
	
		module('Game Engine - Props');

		test('Should have the following props and/or values', function(assert) {
			assert.equal(gameEngine.screenWidth, 750, 'screen width');
			assert.equal(gameEngine.screenHeight, 400, 'screen height');
			assert.equal(gameEngine.minX, 75, 'min spawn x value');
			assert.equal(gameEngine.maxX, gameEngine.screenWidth - 75, 'max spawn x value');
			assert.ok(gameEngine.hasOwnProperty('entities'), 'has an entities property'); // Validate is array?
		});

		module('Game Engine - generateRandomZombieEntityData');

		test('Should generate data for the \'zombieOne\' entityType', function(assert) {
			var spy = sinon.spy(gameEngine, 'generateRandomZombieEntityData');
			gameEngine.generateRandomZombieEntityData();
			var expected = { entityType: 'zombieOne', spriteData:
					{ direction: sinon.match.number, scaleX: sinon.match.number, vX: sinon.match.number,
						x: sinon.match.number, y: sinon.match.number} };
			assert.ok(spy.returned(sinon.match(expected)));
			gameEngine.generateRandomZombieEntityData.restore();
		});

		test('Should generate sprite\'s x value between bounds', function(assert) {
			// Generate 10 values
			for(var i = 0; i < 10; i++) {
				var entityData = gameEngine.generateRandomZombieEntityData();
				assert.ok(entityData.spriteData.x >= gameEngine.minX);
				assert.ok(entityData.spriteData.x <= gameEngine.maxX);
			}
		});

		test('The sprite\'s direction and scaleX value should have the same sign', function(assert) {
			var entityData = gameEngine.generateRandomZombieEntityData();
			// Should always be positive
			var product = entityData.spriteData.direction * entityData.spriteData.scaleX;
			assert.ok(product >= 1);
		});

		var createFakeEntity = function(dead, type, spriteId) {
			return {
				dead: dead,
				entityType: type,
				update: function(){},
				init: function(){},
				sprite: { id: spriteId },
			};
		};

		var loadQueue = { getResult: function() { } };
		var stage = { addChild: function() {}, removeChild: function() {}, update: function(){} };
		module('Game Engine - AddPlayer');

		test('Should call createEntiy and addEntity', function() {
			gameEngine.stage = stage;
			var fakeEntity = createFakeEntity(false, 'someType', 1);
			var entityFactoryMock = this.mock(entityFactory);
			entityFactoryMock.expects('createEntity').once().returns(fakeEntity);
			var gameEngineSpy = sinon.spy(gameEngine, 'addEntity');
			gameEngine.addPlayer();

			sinon.assert.calledOnce(gameEngineSpy);
			sinon.assert.calledWith(gameEngineSpy, fakeEntity);
			gameEngine.stage = undefined;
			entityFactoryMock.restore();
			gameEngine.addEntity.restore();
		});

		module('Game Engine - Init');

		test('Should call init on entity factory, input engine and save stage', function(assert) {
			var fakeEntity = createFakeEntity(false, 'someType', 1);
			var createEntityStub = sinon.stub(entityFactory, 'createEntity');
			createEntityStub.returns(fakeEntity);
			var inputEngineSpy = sinon.spy(inputEngine, 'init');
			var factorySpy = sinon.spy(entityFactory, 'init');
			gameEngine.init(loadQueue, stage);

			sinon.assert.calledOnce(inputEngineSpy);
			sinon.assert.calledOnce(factorySpy);
			sinon.assert.calledWith(factorySpy, loadQueue);
			assert.equal(gameEngine.stage, stage);
			inputEngine.init.restore();
			entityFactory.init.restore();
			createEntityStub.restore();
		});

		test('Should call addPlayer', function() {
			var fakeEntity = createFakeEntity(false, 'someType', 1);
			var createEntityStub = sinon.stub(entityFactory, 'createEntity');
			createEntityStub.returns(fakeEntity);
			var spy = sinon.spy(gameEngine, 'addPlayer');
			gameEngine.init(loadQueue, stage);

			sinon.assert.calledOnce(spy);
			createEntityStub.restore();
		});

		test('Should generateRandomZombieEntityData', function() {
			var entityData = { entityType: 'someType', spriteData: { direction: 90 } };
			var fakeZombieEntity = createFakeEntity(false, 'someType', 1);
			var fakePlayerEntity = createFakeEntity(false, 'someOtherType', 2);
			
			var entityFactoryStub = sinon.stub(entityFactory, 'createEntity');
			entityFactoryStub.onFirstCall().returns(fakePlayerEntity);
			entityFactoryStub.onSecondCall().returns(fakeZombieEntity);

			var gameEngineMock = this.mock(gameEngine);
			gameEngineMock.expects('generateRandomZombieEntityData').once().returns(entityData);

			gameEngine.init(loadQueue, stage);
			entityFactoryStub.restore();
			gameEngineMock.restore();
		});

		test('Should createEntity twice for player and first zombie', function() {
			var fakeZombieEntity = createFakeEntity(false, 'someType', 1);
			var entityFactoryMock = this.mock(entityFactory);
			entityFactoryMock.expects('createEntity').twice().returns(fakeZombieEntity);

			gameEngine.init(loadQueue, stage);
			entityFactoryMock.restore();
		});

		test('Should addEntity twice for player and first zombie', function(assert) {
			var fakeZombieEntity = createFakeEntity(false, 'someType', 1);
			var fakePlayerEntity = createFakeEntity(false, 'someOtherType', 2);
			var entityFactoryStub = sinon.stub(entityFactory, 'createEntity');
			entityFactoryStub.onFirstCall().returns(fakePlayerEntity);
			entityFactoryStub.onSecondCall().returns(fakeZombieEntity);

			var spy = sinon.spy(gameEngine, 'addEntity');
			gameEngine.init(loadQueue, stage);
			assert.equal(fakePlayerEntity, spy.getCall(0).args[0]);
			assert.equal(fakeZombieEntity, spy.getCall(1).args[0]);

			gameEngine.addEntity.restore();
			entityFactoryStub.restore();
		});

		test('Should add onTick event listener', function() {
			var fakeEntity = createFakeEntity(false, 'someType', 1);
			var createEntityStub = sinon.stub(entityFactory, 'createEntity');
			createEntityStub.returns(fakeEntity);
			var spy = sinon.spy(createjs.Ticker, 'addEventListener');
			
			gameEngine.init(loadQueue, stage);
			sinon.assert.calledOnce(spy);
			sinon.assert.calledWith(spy, 'tick', gameEngine.onTick);

			createjs.Ticker.addEventListener.restore();
			createEntityStub.restore();
		});

		module('Game Engine - addEntity');

		test('Should init entity, add child to stage and push entity to array', function() {
			var fakeEntity = createFakeEntity(false, 'someType', 1);
			var createEntityStub = sinon.stub(entityFactory, 'createEntity');
			createEntityStub.returns(fakeEntity);
			gameEngine.init(loadQueue, stage);

			var anotherFakeEntity = createFakeEntity(false, 'someType', 2);
			var entitySpy = sinon.spy(anotherFakeEntity, 'init');
			var stageSpy = sinon.spy(stage, 'addChild');

			gameEngine.addEntity(anotherFakeEntity);
			sinon.assert.calledOnce(entitySpy);
			sinon.assert.calledOnce(stageSpy);
			sinon.assert.calledWith(stageSpy, anotherFakeEntity.sprite);

			anotherFakeEntity.init.restore();
			stage.addChild.restore();
			createEntityStub.restore();
		});

		module('Game Engine - removeEntity');

		test('Should remove entity from stage and array', function(assert) {
			var fakeZombieEntity = createFakeEntity(false, 'someType', 1);
			var fakePlayerEntity = createFakeEntity(false, 'someOtherType', 2);
			var entityFactoryStub = sinon.stub(entityFactory, 'createEntity');
			entityFactoryStub.onFirstCall().returns(fakePlayerEntity);
			entityFactoryStub.onSecondCall().returns(fakeZombieEntity);
			var spy = sinon.spy(stage, 'removeChild');
			gameEngine.init(loadQueue, stage);

			gameEngine.removeEntity(fakeZombieEntity);
			sinon.assert.calledOnce(spy);
			sinon.assert.calledWith(spy, fakeZombieEntity.sprite);
			assert.deepEqual([fakePlayerEntity], gameEngine.entities);
			stage.removeChild.restore();
			entityFactoryStub.restore();
		});

		module('Game Engine - onTick', {
			beforeEach: function() {
				gameEngine.entities = [];
				gameEngine.stage = stage;
			},
		});

		test('Should remove dead entities', function(assert) {
			var fakeEntity = createFakeEntity(false, 'someType', 1);
			var anotherFakeEntity = createFakeEntity(true, 'someOtherType', 1);
			var yetAnoterFakeEntity = createFakeEntity(true, 'yetAnotherType', 2);
			var createEntityStub = sinon.stub(entityFactory, 'createEntity');
			createEntityStub.returns(yetAnoterFakeEntity);
			gameEngine.entities = [fakeEntity, anotherFakeEntity];
			
			gameEngine.onTick();
			assert.notDeepEqual([fakeEntity, anotherFakeEntity], gameEngine.entities);
			createEntityStub.restore();
		});

		test('Should call update on entities that are not dead', function() {
			var fakeEntity = createFakeEntity(false, 'someType', 1);
			var anotherFakeEntity = createFakeEntity(false, 'someType', 1);
			var spyOne = sinon.spy(fakeEntity, 'update');
			var spyTwo = sinon.spy(anotherFakeEntity, 'update');
			gameEngine.entities = [fakeEntity, anotherFakeEntity];
			
			gameEngine.onTick();
			var expectedUpdateArg = { minX: gameEngine.minX, maxX: gameEngine.maxX,
																height: gameEngine.screenHeight, actions: inputEngine.actions };
			sinon.assert.calledOnce(spyOne);
			sinon.assert.calledWith(spyOne, expectedUpdateArg);
			sinon.assert.calledOnce(spyTwo);
			sinon.assert.calledWith(spyTwo, expectedUpdateArg);
			fakeEntity.update.restore();
			anotherFakeEntity.update.restore();
		});

		test('Should add an entity if all zombies are dead', function(assert) {
			var fakePlayer = createFakeEntity(false, 'thePlayer', 1);
			var fakeEntity = createFakeEntity(false, 'someType', 2);
			var createEntityStub = sinon.stub(entityFactory, 'createEntity');
			createEntityStub.returns(fakeEntity);
			gameEngine.entities = [fakePlayer];

			gameEngine.onTick();
			assert.deepEqual([fakePlayer, fakeEntity], gameEngine.entities);
			createEntityStub.restore();
		});

		test('Should update the stage', function() {
			var fakeEntity = createFakeEntity(false, 'someType', 0);
			var createEntityStub = sinon.stub(entityFactory, 'createEntity');
			createEntityStub.returns(fakeEntity);

			var anotherFakeEntity = createFakeEntity(false, 'someTOtherype', 1);
			gameEngine.entities = [anotherFakeEntity];
			var spy = sinon.spy(stage, 'update');

			gameEngine.onTick();
			sinon.assert.calledOnce(spy);
			stage.update.restore();
		});
});
