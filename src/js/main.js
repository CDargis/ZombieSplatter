require(['entities/entityFactory', 'engine/game', 'preload', 'lib/createjs'], function(entityFactory, gameEngine, preload) {
  
  var loadQueue;
  var onLoadComplete = function() {
    var stage = new createjs.Stage('gameCanvas');
    gameEngine.init(loadQueue, stage);
  };

  // Load the assets
  var rootContext = document.body.getAttribute('data-root');
  loadQueue = new createjs.LoadQueue(true, rootContext);
  loadQueue.installPlugin(createjs.Sound);
  loadQueue.addEventListener('complete', onLoadComplete);
  loadQueue.loadManifest(preload.manifest, true);
});
