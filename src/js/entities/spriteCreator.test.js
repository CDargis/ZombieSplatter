define(['entities/spriteCreator'], function(spriteCreator) {

	module('Sprite Creator - Create', {
		beforeEach: function() {
			this.width = 50;
			this.height = 50;
			this.spriteSheet = new createjs.SpriteSheet({
				images: ['/src/assets/zombieOne.png'],
		    frames: { width: this.width, height: this.height },
		    animations: {
		       run:[1,5],
		    }
			});
			this.spriteData = { direction: 90, scaleX: 1, scaleY: 1, vX: 3, x: 250, y: 250 };
		},
	});

	test('Should call Sprite constructor with sprite sheet', function() {
		var spy = sinon.spy(createjs, 'Sprite');
		spriteCreator.create(this.spriteSheet, this.spriteData);

		sinon.assert.calledOnce(spy);
		sinon.assert.calledWith(spy, this.spriteSheet);
		createjs.Sprite.restore();
	});

	test('Should use all data passed to initialize sprite', function(assert) {
		var sprite = spriteCreator.create(this.spriteSheet, this.spriteData);
		for(var prop in this.spriteData) {
			if(this.spriteData.hasOwnProperty(prop)) {
				assert.equal(sprite[prop], this.spriteData[prop]);
			}
		}
	});

	test('Should set regX and regY to half width and height', function(assert) {
		var sprite = spriteCreator.create(this.spriteSheet, this.spriteData);

		assert.equal(sprite.regX, this.width / 2);
		assert.equal(sprite.regY, this.height / 2);
	});

	test('Should set current frame to 0', function(assert) {
		var sprite = spriteCreator.create(this.spriteSheet, this.spriteData);
		assert.equal(sprite.currentFrame, 0);
	});
});
