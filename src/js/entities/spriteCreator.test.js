define(['entities/spriteCreator'], function(spriteCreator) {

	var img = new Image();
	img.src = '/src/assets/zombieOne.png';
	var spriteSheet = { _animations: [], _data: {}, _frames: [], _images: [img] };
	var spriteData = { direction: 90, scaleX: 1, vX: 3, x: 250, y: 250 };
	module('Sprite Creator - Create');

	test('Should use all data passed to initialize sprite', function(assert) {
		var sprite = spriteCreator.create(spriteSheet, spriteData);
		assert.deepEqual( { direction: sprite.direction, scaleX: sprite.scaleX,
												vX: sprite.vX, x: sprite.x, y: sprite.y }, spriteData);
	});

	test('Should call Sprite constructor with sprite sheet', function() {
		var spy = sinon.spy(createjs, 'Sprite');
		spriteCreator.create(spriteSheet, spriteData);

		sinon.assert.calledOnce(spy);
		sinon.assert.calledWith(spy, spriteSheet);
		createjs.Sprite.restore();
	});
});
