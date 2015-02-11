define(['engine/physics', 'entities/spriteCreator',
  'entities/zombieOne', 'spriteSheets/zombieOne',],
  function(physicsEngine, spriteCreator, zombieOneEntity, zombieOneSpriteSheet) {
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

    var pos = { x: 250, y: 250 };
    var spriteDef = { direction: 90, scaleX: 1, scaleY: 1, pos: pos };
    module('Zombie One Entity - Decorate', {
      beforeEach: function() {
        this.entity = { type: 'zombieOne', dead: false, speed: 3, update: function() {} };
        this.loadQueueStub = sinon.stub(loadQueue, 'getResult');
        this.loadQueueStub.returns(img);
        physicsEngine.init();
        zombieOneEntity.init(loadQueue);
      },
      afterEach: function() {
        this.loadQueueStub.restore();
      },
    });

    test('Should call create on spriteSheet module', function() {
      var spy = sinon.spy(zombieOneSpriteSheet, 'create');
      zombieOneEntity.decorate(this.entity, spriteDef);
      
      sinon.assert.calledOnce(spy);
      zombieOneSpriteSheet.create.restore();
    });

    test('Should create a sprite via sprite creator module and save result', function(assert) {
      var spriteSheet = zombieOneSpriteSheet.create();
      var sprite = spriteCreator.create(spriteSheet, spriteDef);
      var stub = sinon.stub(zombieOneSpriteSheet, 'create');
      stub.returns(spriteSheet);
      var mock = this.mock(spriteCreator);
      mock.expects('create').once().withExactArgs(spriteSheet, spriteDef).returns(sprite);
      
      zombieOneEntity.decorate(this.entity, spriteDef);

      assert.deepEqual(sprite, this.entity.sprite);
      stub.restore();
      mock.restore();
    });

    test('Should update velocity with positive speed when moving to the right', function(assert) {
      zombieOneEntity.decorate(this.entity, spriteDef);
      this.entity.sprite.currentAnimation = 'walk';
      this.entity.sprite.direction = 90;
      this.entity.update();

      assert.ok(this.entity.physBody.GetLinearVelocity().x === this.entity.speed);
    });

    test('Should update velocity with negative speed when moving to the left', function(assert) {
      zombieOneEntity.decorate(this.entity, spriteDef);
      this.entity.sprite.currentAnimation = 'walk';
      this.entity.sprite.direction = -90;
      this.entity.update();

      assert.ok(this.entity.physBody.GetLinearVelocity().x === -this.entity.speed);
    });

    test('Should die on animationend \'dead\' ', function(assert) {
      var createEvent = function(eventName) {
        var event = new createjs.Event('animationend');
        event.name = eventName;
        return event;
      };

      zombieOneEntity.decorate(this.entity, spriteDef);
      var event = createEvent('dead');
      this.entity.sprite.dispatchEvent(event);
      assert.ok(this.entity.dead);
    });
});
