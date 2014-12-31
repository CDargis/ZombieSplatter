if (typeof require === 'function' && require.config) {
  require.config({
    baseUrl: 'js',
  });
}

require(['entities/zombieOne.test', 'sprites/zombieOne.test'], function() {
  QUnit.load();
  QUnit.start();
});
