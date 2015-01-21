define(['spriteSheets/zombieOne'], function(zombieOneSpriteSheet) {
	var img = new Image();
	img.src = '/src/assets/zombieOne.png';
	var loadQueue = { getResult: function() { } };

	module('Zombie One SpriteSheet - Init');

	test('Init - Should get zombieOne image from the load queue', function() {
		var mock = this.mock(loadQueue);
		mock.expects('getResult').once().withExactArgs('zombieOne');

		zombieOneSpriteSheet.init(loadQueue);
		mock.restore();
	});

	test('Should save image from load queue', function(assert) {
		var stub = sinon.stub(loadQueue, 'getResult');
		stub.returns(img);

		zombieOneSpriteSheet.init(loadQueue);
		assert.deepEqual(img, zombieOneSpriteSheet.img);
		stub.restore();
	});

	module('Zombie One SpriteSheet - create', {
		beforeEach: function() {
			this.stub = sinon.stub(loadQueue, 'getResult');
			this.stub.returns(img);
			zombieOneSpriteSheet.init(loadQueue);
		},
		afterEach: function() {
			this.stub.restore();
		},
	});

	test('Should use image from load queue in sprite sheet', function(assert) {
		var spriteSheet = zombieOneSpriteSheet.create();
		assert.deepEqual([img], spriteSheet._images);
	});

	test('Should have 4 animations', function(assert) {
		var spriteSheet = zombieOneSpriteSheet.create();
		assert.deepEqual(['spawn', 'walk', 'dieByShot', 'dead'], spriteSheet._animations);
	});
});
