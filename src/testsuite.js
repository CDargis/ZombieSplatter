if (typeof require === 'function' && require.config) {
  require.config({
    baseUrl: 'js',
  });
}

require(['sprites/zombieOne.test'], function(zombieOneSprite) {
  QUnit.load();
  QUnit.start();
});
