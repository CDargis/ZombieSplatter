define(['entities/spriteCreator', 'entities/zombieOne', 'spriteSheets/zombieOne'],
	function(spriteCreator, zombieOneEntity, zombieOneSpriteSheet) {
		var img = new Image();
		img.src = '/src/assets/zombieOne.png';
		var loadQueue = { getResult: function() { } };

		module('Zombie One Entity - Init');

		test('Should call init on sprite module', function() {
			var mock = this.mock(zombieOneSpriteSheet);
			mock.expects('init').once().withExactArgs(loadQueue);

			zombieOneEntity.init(loadQueue);
			mock.restore();
		});

		var spriteData = { direction: 90, scaleX: 1, vX: 3, x: 250, y: 250 };
		var entity = {};
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

		test('Should call create on spriteSheet module', function() {
			var spy = sinon.spy(zombieOneSpriteSheet, 'create');
			zombieOneEntity.decorate(entity, spriteData);
			
			sinon.assert.calledOnce(spy);
			zombieOneSpriteSheet.create.restore();
		});

		test('Should create a sprite via sprite creator module and save result', function(assert) {
			var spriteSheet = zombieOneSpriteSheet.create();
			var sprite = spriteCreator.create(spriteSheet, spriteData);
			var stub = sinon.stub(zombieOneSpriteSheet, 'create');
			stub.returns(spriteSheet);
			var mock = this.mock(spriteCreator);
			mock.expects('create').once().withExactArgs(spriteSheet, spriteData).returns(sprite);
			
			zombieOneEntity.decorate(entity, spriteData);

			assert.deepEqual(entity.sprite, sprite);
			stub.restore();
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

		test('Should die on animationend \'dead\' ', function(assert) {
			var createEvent = function(eventName) {
				var event = new createjs.Event('animationend');
				event.name = eventName;
				return event;
			};

			zombieOneEntity.decorate(entity, spriteData);
			
			var spy = sinon.spy(entity.sprite, 'gotoAndPlay');
			event = createEvent('dead');
			entity.sprite.dispatchEvent(event);
			assert.ok(entity.dead);

			entity.sprite.gotoAndPlay.restore();
		});

		test('Should gotoAndPlay(\'spawn\') on init', function() {
			zombieOneEntity.decorate(entity, spriteData);
			var spy = sinon.spy(entity.sprite, 'gotoAndPlay');

			entity.init();
			sinon.assert.calledOnce(spy);
			sinon.assert.calledWith(spy, 'spawn');
		});
});
