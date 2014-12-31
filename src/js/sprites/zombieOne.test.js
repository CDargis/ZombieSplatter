define(['sprites/zombieOne'], function(zombieOne) {
	var img = new Image();
	img.src = '../assets/zombieOne.png';
	var loadQueue = { getResult: function() { } };

	module('sprite model - init');
	test('Should get zombieOne image from the load queue', function() {
		var mock = this.mock(loadQueue);
		mock.expects('getResult').once().withExactArgs('zombieOne');

		zombieOne.init(loadQueue);
		mock.restore();
	});

	test('Should save image from load queue', function(assert) {
		var stub = sinon.stub(loadQueue, 'getResult');
		stub.returns(img);

		zombieOne.init(loadQueue);
		assert.deepEqual(zombieOne.img, img);
		stub.restore();
	});

	var stub = {};
	module('sprite model - createSpriteSheet', {
		beforeEach: function() {
			stub = sinon.stub(loadQueue, 'getResult');
			stub.returns(img);
			zombieOne.init(loadQueue);
		},
		afterEach: function() {
			stub.restore();
		},
	});
	test('Should use image from load queue in sprite sheet', function(assert) {
		var spriteSheet = zombieOne.createSpriteSheet();
		assert.deepEqual(spriteSheet._images, [img]);
	});

	test('Should have 4 animations', function(assert) {
		var spriteSheet = zombieOne.createSpriteSheet();
		assert.deepEqual(spriteSheet._animations, ['spawn', 'walk', 'dieByShot', 'dead']);
	});

	var spriteData = { direction: 90, scaleX: 1, vX: 3, x: 250, y: 250 };
	module('sprite model - createSprite', {
		beforeEach: function() {
			stub = sinon.stub(loadQueue, 'getResult');
			stub.returns(img);
			zombieOne.init(loadQueue);
		},
		afterEach: function() {
			stub.restore();
		},
	});
	test('Should use all data passed to initialize sprite', function(assert) {
		var sprite = zombieOne.createSprite(spriteData);
		assert.deepEqual( { direction: sprite.direction, scaleX: sprite.scaleX,
												vX: sprite.vX, x: sprite.x, y: sprite.y }, spriteData);
	});

	test('Should start current frame at 0', function(assert) {
		var sprite = zombieOne.createSprite(spriteData);
		assert.ok(sprite.currentFrame === 0);
	});

	test('Should call createSpriteSheet', function() {
		var spy = sinon.spy(zombieOne, 'createSpriteSheet');
		zombieOne.createSprite(spriteData);
		
		sinon.assert.calledOnce(spy);
		zombieOne.createSpriteSheet.restore();
	});

	test('Should call Sprite constructor with sprite sheet', function() {
		var spriteSheet = { _animations: [], _data: {}, _frames: [], _images: [img] };
		var spriteSheetStub = sinon.stub(zombieOne, 'createSpriteSheet');
		spriteSheetStub.returns(spriteSheet);

		var spy = sinon.spy(createjs, 'Sprite');
		zombieOne.createSprite(spriteData);

		sinon.assert.calledWith(spy, spriteSheet);
		spriteSheetStub.restore();
		createjs.Sprite.restore();
	});
});
