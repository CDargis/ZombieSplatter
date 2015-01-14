if (typeof require === 'function' && require.config) {
  require.config({
    baseUrl: 'js',
  });
}

require(['engine/game.test', 'engine/input.test', 'entities/spriteCreator.test',
	'entities/entityFactory.test', 'entities/zombieOne.test',
	'spriteSheets/soldierOne.test', 'spriteSheets/zombieOne.test'], function() {
	  QUnit.load();
	  QUnit.start();
});
