define([], function() {
	var createInputEngine = function() {
    var engine = {
    	bindings: {},
      actions: {},
      bind: function (key, action) {
				engine.bindings[key] = action;
			},
			onKeyDown: function (event) {
				var action = engine.bindings[event.keyCode];
				if (action) {
					engine.actions[action] = true;
				}
				if([32, 37, 38, 39, 40].indexOf(event.keyCode) > -1) {
	        event.preventDefault();
	    	}
			},
			onKeyUp: function (event) {
				var action = engine.bindings[event.keyCode];
				if (action) {
					engine.actions[action] = false;
				}
			},
			init: function() {
				engine.bind(37, 'LEFT');
				engine.bind(39, 'RIGHT');
				engine.bind(40, 'DOWN');
				engine.bind(32, 'SHOOT');
				document.addEventListener('keydown', engine.onKeyDown);
				document.addEventListener('keyup', engine.onKeyUp);
			},
    };
    return engine;
  };
  return createInputEngine();
});
