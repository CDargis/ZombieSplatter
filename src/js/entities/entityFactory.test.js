define(['entities/entityFactory'], function(entityFactory) {
	var getSpies = function(methodName) {
		var spies = [];
		var entityMap = entityFactory.entityMap;
		for(var entityType in entityMap) {
			if(entityMap.hasOwnProperty(entityType)) {
				var spy = sinon.spy(entityMap[entityType], methodName);
				spies.push(spy);
			}
		}
		return spies;
	};

	var img = new Image();
	img.src = '../assets/zombieOne.png';
	var loadQueue = { getResult: function() { } };

	module('Entity Factory - Init');

	test('Should call init and pass the load queue for each entity', function() {
		var loadQueueStub = sinon.stub(loadQueue, 'getResult');
		loadQueueStub.returns(img);

		var spies = getSpies('init');

		entityFactory.init(loadQueue);
		for(var i = 0; i < spies.length; i++) {
			var spy = spies[i];
			sinon.assert.calledOnce(spy);
			sinon.assert.calledWith(spy, loadQueue);
		}

		var entityMap = entityFactory.entityMap;
		for(var entityType in entityMap) {
			if(entityMap.hasOwnProperty(entityType)) {
				entityMap[entityType].init.restore();
			}
		}
		loadQueueStub.restore();
	});

	module('Entity Factory - CreateEntity', {
		beforeEach: function() {
			this.loadQueueStub = sinon.stub(loadQueue, 'getResult');
			this.loadQueueStub.returns(img);
			entityFactory.init(loadQueue);
		},
		afterEach: function() {
			this.loadQueueStub.restore();
		},
	});

	var spriteData = { direction: 90, scaleX: 1, vX: 3, x: 50, y: 250 };
	test('Should call decorate for each entity type', function() {
		var entityMap = entityFactory.entityMap;
		for(var entityType in entityMap) {
			if(entityMap.hasOwnProperty(entityType)) {
				var spy = sinon.spy(entityMap[entityType], 'decorate');
				var entityData = {entityType: entityType, spriteData: spriteData};
				entityFactory.createEntity(entityData);

				sinon.assert.calledOnce(spy);
				sinon.assert.calledWith(spy, sinon.match.object, entityData.spriteData);
				entityMap[entityType].decorate.restore();
			}
		}
	});

	test('Should return correct entity for each entity type', function(assert) {
		var spy = sinon.spy(entityFactory, 'createEntity');
		var entityMap = entityFactory.entityMap;
		for(var entityType in entityMap) {
			if(entityMap.hasOwnProperty(entityType)) {
				var entityData = {entityType: entityType, spriteData: spriteData};
				entityFactory.createEntity(entityData);
				var expected = { dead: false, init: sinon.match.func, sprite: sinon.match.object,
															entityType: entityType, update: sinon.match.func };

				assert.ok(spy.returned(sinon.match(expected)));
				spy.reset();
			}
		}
	});
});
