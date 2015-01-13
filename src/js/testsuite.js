if (typeof require === 'function' && require.config) {
  require.config({
    baseUrl: 'js',
  });
}

require(['engine/game.test', 'entities/spriteCreator.test', 'entities/entityFactory.test',
	'entities/zombieOne.test', 'spriteSheets/zombieOne.test'], function() {
  QUnit.load();
  QUnit.start();
});
