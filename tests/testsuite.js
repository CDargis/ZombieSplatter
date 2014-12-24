if (typeof require === 'function' && require.config) {
  require.config({
    baseUrl: '../../../src/js',
  });
}

require(['../../tests/js/sprites/zombieOne.test'], function(zombieOneSprite) {
  QUnit.load();
  QUnit.start();
});
