require(['entities/entityFactory', 'engine/gameEngine', 'lib/easeljs'], function(entityFactory, gEngine) {
	// Load the assets
	var loadQueue;
	var onLoadComplete = function(event) {
		var stage = new createjs.Stage('gameCanvas');
  	gEngine.init(loadQueue, stage); // Init the game because we are finished loading
	}
	loadQueue = new createjs.LoadQueue(false);
	loadQueue.addEventListener('complete', onLoadComplete);
	loadQueue.loadManifest({src: "assets/manifest.json", callback: "loadAssets", type: "manifest"}, true);
});
