function createZombieSprite(spriteSheet) {
	var zombieSprite = new createjs.Sprite(spriteSheet);
  zombieSprite.gotoAndPlay("spawn");     //animate

  zombieSprite.name = "zombie1";
  zombieSprite.direction = 90;
  zombieSprite.vX = 3;
  zombieSprite.x = 16;
  zombieSprite.y = 250;

  // have each monster start at a specific frame
  zombieSprite.currentFrame = 0;
  return zombieSprite;
}
