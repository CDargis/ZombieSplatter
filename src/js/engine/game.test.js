define(['engine/game'], function(gameEngine) {
	
	module('Game Engine - Props');

	test('Should have the following props and/or values', function(assert) {
		assert.ok(gameEngine.screenWidth === 750);
		assert.ok(gameEngine.screenHeight === 400);
		assert.ok(gameEngine.hasOwnProperty('entities')); // Validate is array?
		assert.ok(gameEngine.minSpawnX === 50);
		assert.ok(gameEngine.maxSpawnX === (gameEngine.screenWidth - 50));
	});

	module('Game Engine - generateRandomZombieEntityData');
	test('Should generate data for the \'zombieOne\' entityType', function(assert) {
		var spy = sinon.spy(gameEngine, 'generateRandomZombieEntityData');
		gameEngine.generateRandomZombieEntityData();
		var expected = { entityType: 'zombieOne', spriteData:
				{ direction: sinon.match.number, scaleX: sinon.match.number, vX: sinon.match.number,
					x: sinon.match.number, y: sinon.match.number} };
		assert.ok(spy.returned(sinon.match(expected)));
		gameEngine.generateRandomZombieEntityData.restore();
	});

	test('Should generate sprite\'s x value between bounds', function(assert) {
		// Generate 10 values
		for(var i = 0; i < 10; i++) {
			var entityData = gameEngine.generateRandomZombieEntityData();
			assert.ok(entityData.spriteData.x >= gameEngine.minSpawnX);
			assert.ok(entityData.spriteData.x <= gameEngine.maxSpawnX);
		}
	});

	test('The sprite\'s direction and scaleX value should have the same sign', function(assert) {
		var entityData = gameEngine.generateRandomZombieEntityData();
		// Should always be positive
		var product = entityData.spriteData.direction * entityData.spriteData.scaleX;
		assert.ok(product >= 1);
	});
});
