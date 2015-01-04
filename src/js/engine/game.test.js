define(['engine/game', 'entities/entityFactory'], function(gameEngine, entityFactory) {
	
	module('Game Engine - Props');

	test('Should have the following props and/or values', function(assert) {
		assert.equal(gameEngine.screenWidth, 750, 'screen width');
		assert.equal(gameEngine.screenHeight, 400, 'screen height');
		assert.equal(gameEngine.minSpawnX, 50, 'min spawn x value');
		assert.equal(gameEngine.maxSpawnX, gameEngine.screenWidth - 50, 'max spawn x value');
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
			assert.ok(entityData.spriteData.x >= gameEngine.minSpawnX);
			assert.ok(entityData.spriteData.x <= gameEngine.maxSpawnX);
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
	module('Game Engine - Init');

	test('Should call init on entity factory and save stage', function(assert) {
		var fakeEntity = createFakeEntity(false, 'someType', 1);
		var createEntityStub = sinon.stub(entityFactory, 'createEntity');
		createEntityStub.returns(fakeEntity);
		var spy = sinon.spy(entityFactory, 'init');
		gameEngine.init(loadQueue, stage);

		sinon.assert.calledOnce(spy);
		sinon.assert.calledWith(spy, loadQueue);
		assert.equal(gameEngine.stage, stage);
		entityFactory.init.restore();
		createEntityStub.restore();
	});

	test('Should generateRandomZombieEntityData, createEntity and addEntity', function() {
		var entityData = { entityType: 'someType', spriteData: { direction: 90 } };
		var fakeEntity = createFakeEntity(false, 'someType', 1);
		var gameEntineMock = this.mock(gameEngine);
		gameEntineMock.expects('generateRandomZombieEntityData').once().returns(entityData);
		var entityFactoryMock = this.mock(entityFactory);
		entityFactoryMock.expects('createEntity').once().returns(fakeEntity);
		gameEntineMock.expects('addEntity').once().withArgs(fakeEntity);

		gameEngine.init(loadQueue, stage);
		gameEntineMock.restore();
		entityFactoryMock.restore();
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
		var fakeEntity = createFakeEntity(false, 'someType', 1);
		var createEntityStub = sinon.stub(entityFactory, 'createEntity');
		createEntityStub.returns(fakeEntity);
		var spy = sinon.spy(stage, 'removeChild');
		gameEngine.init(loadQueue, stage);

		gameEngine.removeEntity(fakeEntity);
		sinon.assert.calledOnce(spy);
		sinon.assert.calledWith(spy, fakeEntity.sprite);
		assert.deepEqual(gameEngine.entities, []);
		stage.removeChild.restore();
		createEntityStub.restore();
	});

	module('Game Engine - onTick', {
		beforeEach: function() {
			gameEngine.entities = [];
			gameEngine.stage = stage;
		},
	});

	test('Should remove dead entities', function(assert) {
		var fakeEntity = createFakeEntity(false, 'someType', 1);
		var anotherFakeEntity = createFakeEntity(true, 'someType', 1);
		gameEngine.entities = [fakeEntity, anotherFakeEntity];
		
		gameEngine.onTick();
		assert.deepEqual(gameEngine.entities, [fakeEntity]);
	});

	test('Should call update on entities that are not dead', function() {
		var fakeEntity = createFakeEntity(false, 'someType', 1);
		var anotherFakeEntity = createFakeEntity(false, 'someType', 1);
		var spyOne = sinon.spy(fakeEntity, 'update');
		var spyTwo = sinon.spy(anotherFakeEntity, 'update');
		gameEngine.entities = [fakeEntity, anotherFakeEntity];
		
		gameEngine.onTick();
		var expectedUpdateArg = { minX: gameEngine.minSpawnX, maxX: gameEngine.maxSpawnX,
															height: gameEngine.screenHeight };
		sinon.assert.calledOnce(spyOne);
		sinon.assert.calledWith(spyOne, expectedUpdateArg);
		sinon.assert.calledOnce(spyTwo);
		sinon.assert.calledWith(spyTwo, expectedUpdateArg);
		fakeEntity.update.restore();
		anotherFakeEntity.update.restore();
	});

	test('Should add an entity if all are dead', function(assert) {
		var fakeEntity = createFakeEntity(false, 'someType', 1);
		var createEntityStub = sinon.stub(entityFactory, 'createEntity');
		createEntityStub.returns(fakeEntity);

		gameEngine.onTick();
		assert.deepEqual(gameEngine.entities, [fakeEntity]);
		createEntityStub.restore();
	});

	test('Should update the stage', function() {
		var fakeEntity = createFakeEntity(false, 'someType', 1);
		gameEngine.entities = [fakeEntity];
		var spy = sinon.spy(stage, 'update');

		gameEngine.onTick();
		sinon.assert.calledOnce(spy);
		stage.update.restore();
	});
});
