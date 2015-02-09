define(['include/createJS'], function() {

  var createSpriteSheetCreator = function() {
    var spriteSheetCreator = {
      img: {},
      meta: {},
      init: function(loadQueue) {
        spriteSheetCreator.img = loadQueue.getResult('zombieTwo');
        spriteSheetCreator.meta = loadQueue.getResult('zombieTwoMeta');
      },

      create: function() {
        var spriteSheetFrames = [];
        for(var i = 0; i < spriteSheetCreator.meta.frames.length; i++) {
          var data = spriteSheetCreator.meta.frames[i];
          var frame = data.frame;
          var width = frame.w;
          var height = frame.h;
          var regX = width / 2;
          var regY = height / 2;
          spriteSheetFrames[i] = [frame.x, frame.y, width, height, 0, regX, regY];
        }
        var spriteSheet = new createjs.SpriteSheet({
          images: [spriteSheetCreator.img],
          frames: spriteSheetFrames,
          animations: {
            attack: [0, 2, 'attack', 1/10],
            die: [3, 6, 'dead', 1/10],
            walk: [7, 10, 'walk', 1/15],
            dead: [6, 6, 'dead', 1]
          }
        });
        return spriteSheet;
      },
    };
    return spriteSheetCreator;
  };
  return createSpriteSheetCreator();
});