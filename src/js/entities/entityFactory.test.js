define(['entities/entityFactory'], function(entityFactory) {
	var getSpies = function(methodName) {
		var spies = [];
		var decorators = entityFactory.decorators;
		for(var entityType in decorators) {
			if(decorators.hasOwnProperty(entityType)) {
				var spy = sinon.spy(decorators[entityType], methodName);
				spies.push(spy);
			}
		}
		return spies;
	};

	var img = new Image();
	img.src = '/src/assets/zombieOne.png';
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

		var decorators = entityFactory.decorators;
		for(var entityType in decorators) {
			if(decorators.hasOwnProperty(entityType)) {
				decorators[entityType].init.restore();
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
		var decorators = entityFactory.decorators;
		for(var entityType in decorators) {
			if(decorators.hasOwnProperty(entityType)) {
				var spy = sinon.spy(decorators[entityType], 'decorate');
				var entityData = {entityType: entityType, spriteData: spriteData};
				entityFactory.createEntity(entityData);

				sinon.assert.calledOnce(spy);
				sinon.assert.calledWith(spy, sinon.match.object, entityData.spriteData);
				decorators[entityType].decorate.restore();
			}
		}
	});

	test('Should return correct entity for each entity type', function(assert) {
		var spy = sinon.spy(entityFactory, 'createEntity');
		var decorators = entityFactory.decorators;
		for(var entityType in decorators) {
			if(decorators.hasOwnProperty(entityType)) {
				var entityData = {entityType: entityType, spriteData: spriteData};
				entityFactory.createEntity(entityData);
				var expected = { dead: false, sprite: sinon.match.object,
															entityType: entityType, update: sinon.match.func };

				assert.ok(spy.returned(sinon.match(expected)));
				spy.reset();
			}
		}
		entityFactory.createEntity.restore();
	});
});
