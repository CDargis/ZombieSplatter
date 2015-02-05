define(['entities/spriteCreator'], function(spriteCreator) {

	module('Sprite Creator - Create', {
		beforeEach: function() {
			this.img = new Image();
			this.img.src = '/src/assets/zombieOne.png';
			this.width = 50;
			this.height = 50;
			this.pos = { x: 250, y: 250 };
			this.spriteDef =
				{ direction: 90, scaleX: 1, scaleY: 1, pos: this.pos, initialAnimation: 'run' };
			this.spriteSheet = new createjs.SpriteSheet({
				images: [this.img],
		    frames: { width: this.width, height: this.height },
		    animations: {
		       run:[1,5],
		    }
			});
			this.onLoadComplete = function(testCallback) {
				if(this.spriteSheet.complete) {
					testCallback();
				}
				else {
					this.spriteSheet.addEventListener('complete', testCallback);
				}
			};
		},
	});

	test('Should call Sprite constructor with sprite sheet and initial animation', function() {
		var context = this;
		var testCallback = function() {
			var spy = sinon.spy(createjs, 'Sprite');
			spriteCreator.create(context.spriteSheet, context.spriteDef);

			sinon.assert.calledOnce(spy);
			sinon.assert.calledWith(spy, context.spriteSheet, context.spriteDef.initialAnimation);
			createjs.Sprite.restore();
		};
		this.onLoadComplete(testCallback);
	});

	test('Should use all data passed to initialize sprite properly', function(assert) {
		var context = this;
		var testCallback = function() {
			var sprite = spriteCreator.create(context.spriteSheet, context.spriteDef);
			assert.equal(sprite.direction, context.spriteDef.direction, 'sprite direction');
			assert.equal(sprite.scaleX, context.spriteDef.scaleX, 'sprite scaleX');
			assert.equal(sprite.scaleY, context.spriteDef.scaleY, 'sprite scaleY');
			assert.equal(sprite.x, context.spriteDef.pos.x, 'sprite x');
			var expectedY = context.spriteDef.pos.y - (context.height / 2);
			assert.equal(sprite.y, expectedY, 'sprite calculated y');
		};
		this.onLoadComplete(testCallback);
	});

	test('Should set regX and regY to half width and height', function(assert) {
		var context = this;
			var testCallback = function() {
			var sprite = spriteCreator.create(context.spriteSheet, context.spriteDef);

			assert.equal(context.width / 2, sprite.regX);
			assert.equal(context.height / 2, sprite.regY);
		};
		this.onLoadComplete(testCallback);
	});
});
