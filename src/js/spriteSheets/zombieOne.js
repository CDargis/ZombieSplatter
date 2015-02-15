define(['lib/createjs'], function() {

  var createSpriteSheetCreator = function() {
    var spriteSheetCreator = {
      img: {},
      meta: {},
      init: function(loadQueue) {
        spriteSheetCreator.img = loadQueue.getResult('zombieOne');
        spriteSheetCreator.meta = loadQueue.getResult('zombieOneMeta');
        spriteSheetCreator.frames = [[]];
        for(var i = 0; i < spriteSheetCreator.meta.frames.length; i++) {
          var data = spriteSheetCreator.meta.frames[i];
          var frame = data.frame;
          var width = frame.w;
          var height = frame.h;
          var regX = width / 2;
          var regY = height/ 2;
          spriteSheetCreator.frames[i] = [frame.x, frame.y, width, height, 0, regX, regY];
        }
      },

      create: function() {
        var spriteSheet = new createjs.SpriteSheet({
          images: [spriteSheetCreator.img],
          frames: spriteSheetCreator.frames,
          animations: {
            attack: [0, 4, 'walk', 1/10],
            die: [5, 8, 'dead', 1/10],
            walk: [9, 12, 'walk', 1/15],
            dead: [8, 8, 'dead', 1]
          }
        });
        return spriteSheet;
      },
    };
    return spriteSheetCreator;
  };
  return createSpriteSheetCreator();
});
