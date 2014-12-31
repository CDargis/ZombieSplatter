define(['entities/zombieOne', 'sprites/zombieOne'], function(zombieOneEntity, zombieOneSprite) {
	var img = new Image();
	img.src = '../assets/zombieOne.png';
	var loadQueue = { getResult: function() { } };

	module('Zombie One Entity - Init');
	test('Should call init on sprite module', function() {
		var mock = this.mock(zombieOneSprite);
		mock.expects('init').once().withExactArgs(loadQueue);

		zombieOneEntity.init(loadQueue);
		mock.restore();
	});

	var entity = {};
	var spriteData = { direction: 90, scaleX: 1, vX: 3, x: 250, y: 250 };
	module('Zombie One Entity - Decorate', {
		beforeEach: function() {
			entity = { type: 'zombieOne', dead: false, update: function() {} };
			this.loadQueueStub = sinon.stub(loadQueue, 'getResult');
			this.loadQueueStub.returns(img);
			zombieOneEntity.init(loadQueue);
		},
		afterEach: function() {
			this.loadQueueStub.restore();
		},
	});
	test('Should create a sprite via sprite module and save result', function(assert) {
		var mock = this.mock(zombieOneSprite);
		var sprite = zombieOneSprite.createSprite(spriteData);
		mock.expects('createSprite').once().withExactArgs(spriteData).returns(sprite);
		
		zombieOneEntity.decorate(entity, spriteData);

		assert.deepEqual(entity.sprite, sprite);
		mock.restore();
	});

	test('Should change direction and flip image on update when sprite is too far to the right',
			function(assert) {
		zombieOneEntity.decorate(entity, spriteData);
		entity.sprite.currentAnimation = 'walk';
		entity.sprite.x = 150;
		entity.update({minX: 50, maxX: 150});

		assert.ok(entity.sprite.direction === -90);
		assert.ok(entity.sprite.scaleX === -1);
	});

	test('Should change direction and flip image on update when sprite is too far to the left',
			function(assert) {
		zombieOneEntity.decorate(entity, spriteData);
		entity.sprite.currentAnimation = 'walk';
		entity.sprite.x = 49;
		entity.update({minX: 50, maxX: 150});

		assert.ok(entity.sprite.direction === 90);
		assert.ok(entity.sprite.scaleX === 1);
	});

	test('Should update x with a positive value when moving to the right', function(assert) {
		zombieOneEntity.decorate(entity, spriteData);
		entity.sprite.currentAnimation = 'walk';
		entity.sprite.x = 49;
		entity.update({minX: 50, maxX: 150});

		assert.ok(entity.sprite.x === 49 + spriteData.vX);
	});

	test('Should update x with a negative value when moving to the left', function(assert) {
		zombieOneEntity.decorate(entity, spriteData);
		entity.sprite.currentAnimation = 'walk';
		entity.sprite.x = 150;
		entity.update({minX: 50, maxX: 150});

		assert.ok(entity.sprite.x === 150 - spriteData.vX);
	});

	test('Should gotoAndPlay (walk, dead) or die respectively on animationend', function(assert) {
		var createEvent = function(eventName) {
			var event = new createjs.Event('animationend');
			event.name = eventName;
			return event;
		};

		zombieOneEntity.decorate(entity, spriteData);
		
		var spy = sinon.spy(entity.sprite, 'gotoAndPlay');
		var event = createEvent('spawn');
		entity.sprite.dispatchEvent(event);
		sinon.assert.calledOnce(spy);
		sinon.assert.calledWith(spy, 'walk');
		spy.reset();

		event = createEvent('dieByShot');
		entity.sprite.dispatchEvent(event);
		sinon.assert.calledOnce(spy);
		sinon.assert.calledWith(spy, 'dead');
		spy.reset();

		event = createEvent('dead');
		entity.sprite.dispatchEvent(event);
		assert.ok(entity.dead);
		spy.reset();
	});

	test('Should gotoAndPlay(\'spawn\') on init', function() {
		zombieOneEntity.decorate(entity, spriteData);
		var spy = sinon.spy(entity.sprite, 'gotoAndPlay');

		entity.init();
		sinon.assert.calledOnce(spy);
		sinon.assert.calledWith(spy, 'spawn');
	});
});
