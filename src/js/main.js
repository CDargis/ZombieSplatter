require(['entities/entityFactory', 'engine/gameEngine', 'lib/easeljs'], function(entityFactory, gEngine) {
	var rootContext = document.body.getAttribute('data-root');

	// Load the assets
	var loadQueue;
	var onLoadComplete = function() {
		var stage = new createjs.Stage('gameCanvas');
  	gEngine.init(loadQueue, stage);
	};
	loadQueue = new createjs.LoadQueue(true, rootContext);
	loadQueue.addEventListener('complete', onLoadComplete);
	loadQueue.loadManifest({src: 'assets/manifest.json', callback: 'loadAssets', type: 'manifest'}, true);
});
