if (typeof require === 'function' && require.config) {
  require.config({
    baseUrl: 'js',
  });
}

require(['engine/game.test', 'entities/entityFactory.test', 'entities/zombieOne.test',
		'sprites/zombieOne.test'], function() {
  QUnit.load();
  QUnit.start();
});
