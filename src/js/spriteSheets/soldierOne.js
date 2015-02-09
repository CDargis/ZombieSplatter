define(['include/createJS'], function() {
	var createSpriteSheetCreator = function() {
    var spriteSheetCreator = {
      img: {},
      meta: {},
      init: function(loadQueue) {
        spriteSheetCreator.img = loadQueue.getResult('soldierOne');
        spriteSheetCreator.meta = loadQueue.getResult('soldierOneMeta');
      },

      create: function() {
        var spriteSheetFrames = [];
        for(var i = 0; i < spriteSheetCreator.meta.frames.length; i++) {
          var data = spriteSheetCreator.meta.frames[i];
          var frame = data.frame;
          var regX = frame.w / 2;
          var regY = frame.h / 2;
          spriteSheetFrames[i] = [ frame.x, frame.y, frame.w, frame.h, 0, regX, regY ];
        }
        var spriteSheet = new createjs.SpriteSheet({
          images: [spriteSheetCreator.img],
          frames: spriteSheetFrames,
          animations: {
            idle: 0,
            crouch: [0, 3, 'crouched', 1/4],
            die: [4, 7, 'dead', 1/15],
            dead: [7, 7, 'dead', 1],
            hurt: [8, 9, 'idle', 1/8],
            jump: [10, 13, 'idle', 1/4],
            run: {
              frames: [ 14, 18, 19, 20, 21, 22, 23, 24, 25, 15, 16, 17 ],
              next: 'run',
              speed: 1/2
            },
            shoot: [26, 27, 'idle', 1/4],
            crouched: [3, 3, 'crouched', 1],
            exitCrouch: {
              frames: [ 3, 2, 1, 0],
              next: 'idle',
              speed: 1/4
            },
          }
        });
        return spriteSheet;
      },
    };
    return spriteSheetCreator;
  };
  return createSpriteSheetCreator();
});