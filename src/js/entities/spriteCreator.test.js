define(['entities/spriteCreator'], function(spriteCreator) {

	module('Sprite Creator - Create', {
		beforeEach: function() {
			this.img = new Image();
			this.img.src = '/src/assets/zombieOne.png';
			this.width = 50;
			this.height = 50;
			this.spriteSheet = new createjs.SpriteSheet({
				images: [this.img],
		    frames: { width: this.width, height: this.height },
		    animations: {
		       run:[1,5],
		    }
			});
			this.spriteDef =
				{ direction: 90, scaleX: 1, scaleY: 1, vX: 3, x: 250, y: 250, initialAnimation: 'run' };
		},
	});

	test('Should call Sprite constructor with sprite sheet', function() {
		var spy = sinon.spy(createjs, 'Sprite');
		spriteCreator.create(this.spriteSheet, this.spriteDef);

		sinon.assert.calledOnce(spy);
		sinon.assert.calledWith(spy, this.spriteSheet, this.spriteDef.initialAnimation);
		createjs.Sprite.restore();
	});

	test('Should use all data passed to initialize sprite', function(assert) {
		var sprite = spriteCreator.create(this.spriteSheet, this.spriteDef);
		var expected =
			{ direction: this.spriteDef.direction, scaleX: this.spriteDef.scaleX,
				scaleY: this.spriteDef.scaleY, vX: this.spriteDef.vX,
					x: this.spriteDef.x, y: this.spriteDef.y };
		for(var prop in expected) {
			if(this.spriteDef.hasOwnProperty(prop)) {
				assert.equal(sprite[prop], this.spriteDef[prop]);
			}
		}
	});

	test('Should set regX and regY to half width and height', function(assert) {
		var sprite = spriteCreator.create(this.spriteSheet, this.spriteDef);

		assert.equal(sprite.regX, this.width / 2);
		assert.equal(sprite.regY, this.height / 2);
	});

	test('Should set current frame to 0', function(assert) {
		var sprite = spriteCreator.create(this.spriteSheet, this.spriteDef);
		assert.equal(sprite.currentFrame, 0);
	});
});
