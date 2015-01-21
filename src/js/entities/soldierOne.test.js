define(['entities/spriteCreator', 'entities/soldierOne', 'spriteSheets/soldierOne'],
	function(spriteCreator, soldierOneEntity, soldierOneSpriteSheet) {
		
		var img = new Image();
		img.src = '/src/assets/soldierOne.png';
		var loadQueue = { getResult: function() { } };

		var spriteDef = { direction: 90, scaleX: 1, vX: 3, x: 250, y: 250 };
		module('Soldier One Entity - Decorate', {
			beforeEach: function() {
				this.entity = { type: 'soldierOne', dead: false, update: function() {} };
				this.loadQueueStub = sinon.stub(loadQueue, 'getResult');
				this.loadQueueStub.returns(img);
				soldierOneEntity.init(loadQueue);
			},
			afterEach: function() {
				this.loadQueueStub.restore();
			},
		});

		test('Should call create on spriteSheet module', function() {
			var spy = sinon.spy(soldierOneSpriteSheet, 'create');
			soldierOneEntity.decorate(this.entity, spriteDef);
			
			sinon.assert.calledOnce(spy);
			soldierOneSpriteSheet.create.restore();
		});

		test('Should create a sprite via sprite creator module and save result', function(assert) {
			var spriteSheet = soldierOneSpriteSheet.create();
			var sprite = spriteCreator.create(spriteSheet, spriteDef);
			var stub = sinon.stub(soldierOneSpriteSheet, 'create');
			stub.returns(spriteSheet);
			var mock = this.mock(spriteCreator);
			mock.expects('create').once().withExactArgs(spriteSheet, spriteDef).returns(sprite);
			
			soldierOneEntity.decorate(this.entity, spriteDef);

			assert.deepEqual(this.entity.sprite, sprite);
			stub.restore();
			mock.restore();
		});

		// NEED UPDATE() TESTS

		module('Soldier One Entity - Init');

		test('Should call init on sprite module', function() {
			var mock = this.mock(soldierOneSpriteSheet);
			mock.expects('init').once().withExactArgs(loadQueue);

			soldierOneEntity.init(loadQueue);
			mock.restore();
		});
	}
);
