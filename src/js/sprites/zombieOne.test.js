define(['sprites/zombieOne'], function(zombieOne) {
	console.log(zombieOne);
  test('sprites/zombieOne test', function () {
  	var spy1 = this.spy();
    expect(2);
    strictEqual('Can set title', 'Can set title', 'Can set title');
    strictEqual('Can set title', 'Can set title', 'Can set title');
  });
});
