define(['sprites/zombieOne'], function(zombieOneSprite) {
	var img = new Image();
	img.src = '../assets/zombieOne.png';
	var loadQueue = { getResult: function() { } };

	module('Zombie One Sprite - Init');

	test('Init - Should get zombieOne image from the load queue', function() {
		var mock = this.mock(loadQueue);
		mock.expects('getResult').once().withExactArgs('zombieOne');

		zombieOneSprite.init(loadQueue);
		mock.restore();
	});

	test('Should save image from load queue', function(assert) {
		var stub = sinon.stub(loadQueue, 'getResult');
		stub.returns(img);

		zombieOneSprite.init(loadQueue);
		assert.deepEqual(zombieOneSprite.img, img);
		stub.restore();
	});

	module('Zombie One Sprite - CreateSpriteSheet', {
		beforeEach: function() {
			this.stub = sinon.stub(loadQueue, 'getResult');
			this.stub.returns(img);
			zombieOneSprite.init(loadQueue);
		},
		afterEach: function() {
			this.stub.restore();
		},
	});

	test('Should use image from load queue in sprite sheet', function(assert) {
		var spriteSheet = zombieOneSprite.createSpriteSheet();
		assert.deepEqual(spriteSheet._images, [img]);
	});

	test('Should have 4 animations', function(assert) {
		var spriteSheet = zombieOneSprite.createSpriteSheet();
		assert.deepEqual(spriteSheet._animations, ['spawn', 'walk', 'dieByShot', 'dead']);
	});
});
