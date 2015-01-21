define(['engine/input'], function(inputEngine) {

	module('Input Engine - Bind');

	test('Should bind key to action', function(assert) {
		inputEngine.bind(37, 'LEFT');
		inputEngine.bind(39, 'RIGHT');
		inputEngine.bind(40, 'DOWN');

		assert.equal('LEFT', inputEngine.bindings[37]);
		assert.equal('RIGHT', inputEngine.bindings[39]);
		assert.equal('DOWN', inputEngine.bindings[40]);
	});

	module('Input Engine - onKeyDown', {
		beforeEach: function() {
			inputEngine.bind(37, 'LEFT');
			inputEngine.bind(39, 'RIGHT');
			inputEngine.bind(40, 'DOWN');
			this.event = { keyCode: 0, preventDefault: function() {} };
		},
		afterEach: function() {
			inputEngine.bindings = {};
      inputEngine.actions = {};
		},
	});

	test('Should set action to true', function(assert) {
		this.event.keyCode = 37;
		inputEngine.onKeyDown(this.event);
		this.event.keyCode = 39;
		inputEngine.onKeyDown(this.event);
		this.event.keyCode = 40;
		inputEngine.onKeyDown(this.event);

		assert.equal(true, inputEngine.actions.LEFT);
		assert.equal(true, inputEngine.actions.RIGHT);
		assert.equal(true, inputEngine.actions.DOWN);
	});

	test('Should prevent default on codes 32, 37, 38, 39, 40', function(assert) {
		var spy = sinon.spy(this.event, 'preventDefault');

		this.event.keyCode = 32;
		inputEngine.onKeyDown(this.event);
		this.event.keyCode = 37;
		inputEngine.onKeyDown(this.event);
		this.event.keyCode = 38;
		inputEngine.onKeyDown(this.event);
		this.event.keyCode = 39;
		inputEngine.onKeyDown(this.event);
		this.event.keyCode = 40;
		inputEngine.onKeyDown(this.event);

		assert.equal(5, spy.callCount);
		this.event.preventDefault.restore();
	});

	module('Input Engine - onKeyUp', {
		beforeEach: function() {
			inputEngine.bind(37, 'LEFT');
			inputEngine.bind(39, 'RIGHT');
			inputEngine.bind(40, 'DOWN');
			this.event = { keyCode: 0, preventDefault: function() {} };
		},
		afterEach: function() {
			inputEngine.bindings = {};
      inputEngine.actions = {};
		},
	});

	test('Should set action to false', function(assert) {
		this.event.keyCode = 37;
		inputEngine.onKeyDown(this.event);
		inputEngine.onKeyUp(this.event);

		assert.equal(false, inputEngine.actions.LEFT);
	});

	module('Input Engine - Init');

	test('Should bind LEFT, RIGHT, DOWN', function() {
		var spy = sinon.spy(inputEngine, 'bind');
		inputEngine.init();

		sinon.assert.callCount(spy, 4);
		sinon.assert.calledWith(spy, 37, 'LEFT');
		sinon.assert.calledWith(spy, 39, 'RIGHT');
		sinon.assert.calledWith(spy, 40, 'DOWN');
		sinon.assert.calledWith(spy, 32, 'SHOOT');
	});

	test('Should add event listeners', function() {
		var spy = sinon.spy(document, 'addEventListener');
		inputEngine.init();

		sinon.assert.calledTwice(spy);
		sinon.assert.calledWith(spy, 'keydown', inputEngine.onKeyDown);
		sinon.assert.calledWith(spy, 'keyup', inputEngine.onKeyUp);
	});
});
