require(['entities/entityFactory', 'engine/game', 'lib/easeljs'], function(entityFactory, gameEngine) {
	
	var loadQueue;
	var onLoadComplete = function() {
		var stage = new createjs.Stage('gameCanvas');
  	gameEngine.init(loadQueue, stage);
	};

	// Load the assets
	var rootContext = document.body.getAttribute('data-root');
	loadQueue = new createjs.LoadQueue(true, rootContext);
	loadQueue.addEventListener('complete', onLoadComplete);
	loadQueue.loadManifest({src: 'assets/manifest.json', callback: 'loadAssets', type: 'manifest'}, true);
});
