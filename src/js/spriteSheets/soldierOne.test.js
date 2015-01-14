define(['spriteSheets/soldierOne'], function(soldierOneSpriteSheet) {

	var img = new Image();
	img.src = '/src/assets/soldierOne.png';
	var loadQueue = { getResult: function() { } };
	module('Soldier One SpriteSheet - Init');

	test('Init - Should get soldierOne image from the load queue', function() {
		var mock = this.mock(loadQueue);
		mock.expects('getResult').once().withExactArgs('soldierOne');

		soldierOneSpriteSheet.init(loadQueue);
		mock.restore();
	});

	test('Should save image from load queue', function(assert) {
		var stub = sinon.stub(loadQueue, 'getResult');
		stub.returns(img);

		soldierOneSpriteSheet.init(loadQueue);
		assert.deepEqual(soldierOneSpriteSheet.img, img);
		stub.restore();
	});

	module('Soldier One SpriteSheet - create', {
		beforeEach: function() {
			this.stub = sinon.stub(loadQueue, 'getResult');
			this.stub.returns(img);
			soldierOneSpriteSheet.init(loadQueue);
		},
		afterEach: function() {
			this.stub.restore();
		},
	});

	test('Should use image from load queue in sprite sheet', function(assert) {
		var spriteSheet = soldierOneSpriteSheet.create();
		assert.deepEqual(spriteSheet._images, [img]);
	});

	test('Should have 9 animations', function(assert) {
		var spriteSheet = soldierOneSpriteSheet.create();
		assert.deepEqual(spriteSheet._animations,
			['idle', 'crouch', 'die', 'hurt', 'jump', 'run', 'shoot', 'crouched', 'exitCrouch']);
	});
});
