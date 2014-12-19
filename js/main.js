require(['entities/entityFactory', 'engine/gameEngine', 'lib/easeljs'], function(entityFactory, gEngine) {
	// Load the assets
	var loader;
	var onLoadComplete = function(event) {
		console.log(loader.getResult('zombieOne'));
	}
	loader = new createjs.LoadQueue(false);
	loader.addEventListener('complete', onLoadComplete);
	loader.loadManifest({src: "../assets/manifest.json", callback: "loadAssets", type: "manifest"}, true);

  var stage = new createjs.Stage('gameCanvas');
  gEngine.init(stage);
});
