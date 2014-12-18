define(['lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function() {

  function handleImageLoad(event) {

  }

  function handleImageError(event) {
    
  }

  function createSpriteSheet(image) {
    var spriteSheet = new createjs.SpriteSheet({
      // image to use
      images: [image],
      frames: [
        // spwan frames
        [135, 4, 49, 103, 0, 0, 0],
        [197, 4, 49, 103, 0, 0, 0],
        [255, 4, 49, 103, 0, 0, 0],
        [323, 4, 49, 103, 0, 0, 0],
        [383, 4, 61, 103, 0, 0, 0],
        [452, 4, 52, 103, 0, 0, 0],
        [15, 14, 34, 98, 0, 0, 0],
        [72, 14, 35, 91, 0, 0, 0],

        // walk frames
        [15, 122, 32, 103, 0, 0, 0],
        [59, 122, 32, 103, 0, 0, 0],
        [101, 122, 48, 103, 0, 0, 0],
        [152, 122, 48, 103, 0, 0, 0],
        [208, 122, 30, 103, 0, 0, 0],
        [248, 122, 30, 103, 0, 0, 0],
        [284, 122, 48, 103, 0, 0, 0],
        [341, 122, 44, 103, 0, 0, 0],

        // dieByShot frames
        [8, 443, 50, 122, 0, 0, 0],
        [64, 443, 50, 122, 0, 0, 0],
        [122, 443, 54, 122, 0, 0, 0],
        [181, 443, 77, 122, 0, 0, 0],
        [265, 443, 91, 122, 0, 0, 0],
        [359, 443, 123, 122, 0, 0, 0],

        // dead frame
        [359, 443, 123, 122, 0, 0, 0]
      ],
      animations: {
        spawn: [ 0, 7, "spawn", 1/4],
        walk: [8, 15, "walk", 1/4],
        dieByShot: [16, 21, "dieByShot", 1/2],
        dead: 22
      }
    });
    return spriteSheet;
  }

  function createSprite(data) {
    var zombie = new Image();
    zombie.onload = handleImageLoad;
    zombie.onerror = handleImageError;
    zombie.src = "assets/zombie3.png";
    
    var spriteSheet = createSpriteSheet(zombie);
  	var sprite = new createjs.Sprite(spriteSheet);
    sprite.name = "zombie1";
    sprite.direction = data.direction;
    sprite.vX =data.vX;
    sprite.x = data.x;
    sprite.y = data.y;

    // have each monster start at a specific frame
    sprite.currentFrame = 0;
    return sprite;
  }
  return {
    createSprite: createSprite
  }
});
