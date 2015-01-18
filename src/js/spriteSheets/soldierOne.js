define(['lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function() {
	var createSpriteSheetCreator = function() {
    var spriteSheetCreator = {
      img: {},
      init: function(loadQueue) {
        spriteSheetCreator.img = loadQueue.getResult('soldierOne');
      },

      create: function() {
        var spriteSheet = new createjs.SpriteSheet({
          images: [spriteSheetCreator.img],
          frames: [
          	// Idle Frame
          	[0, 0, 520, 600],

          	// Crouch
          	[0, 0, 520, 600],
          	[520, 0, 520, 600],
          	[1040, 0, 520, 600],
          	[0, 600, 520, 600],

          	// Die
          	[520, 600, 520, 600],
          	[0, 1200, 520, 600],
          	[1040, 600, 520, 600],
          	[520, 1200, 520, 600],

          	// Hurt
          	[1040, 1200, 520, 600],
          	[1560, 0, 520, 600],

          	// Jump
          	[2080, 0, 520, 600],
          	[1560, 600, 520, 600],
          	[2600, 0, 520, 600],
          	[2080, 600, 520, 600],

          	// Run
          	[1560, 1200, 520, 600],
          	[0, 1800, 520, 600],
          	[520, 1800, 520, 600],
          	[0, 2400, 520, 600],
          	[1040, 1800, 520, 600],
          	[520, 2400, 520, 600],
          	[1560, 1800, 520, 600],
          	[1040, 2400, 520, 600],
          	[2080, 1800, 520, 600],
          	[2600, 600, 520, 600],
          	[2080, 1200, 520, 600],
          	[2600, 1200, 520, 600],

          	// Shoot
          	[1560, 2400, 520, 600],
          	[2600, 1800, 520, 600],

          	// Crouched
          	[0, 600, 520, 600],

          	// Exit Crouch
          	[0, 600, 520, 600],
          	[1040, 0, 520, 600],
          	[520, 0, 520, 600],
          	[0, 0, 520, 600],
          ],
          animations: {
            idle: 0,
            crouch: [1, 4, 'crouched', 1/3],
            die: [5, 8, 'die', 1/5],
            hurt: [9, 10, 'hurt', 1/4],
            jump: [11, 14, 'idle', 5/8],
            run: [15, 26, 'run', 1],
            shoot: [27, 28, 'idle', 99/100],
            crouched: [29, 29, 'crouched', 1],
            exitCrouch: [30, 33, 'idle', 1],
          }
        });
        return spriteSheet;
      },
    };
    return spriteSheetCreator;
  };
  return createSpriteSheetCreator();
});