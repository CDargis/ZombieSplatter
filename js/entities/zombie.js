function createZombieEntity(sprite) {
  var model = {
    sprite: sprite,
    update: function(event) {
    	if(sprite.currentAnimation === "walk") {
		    if (sprite.x >= width - 50) {
		      sprite.direction = -90;
		      sprite.scaleX = -1;
		    }

		    if (sprite.x < 50) {
		      sprite.direction = 90;
		      sprite.scaleX = 1;
		    }

		    // Moving the sprite based on the direction & the speed
		    if (sprite.direction == 90) {
		      sprite.x += sprite.vX;
		    }
		    else {
		      sprite.x -= sprite.vX;
		    }
		  }
    }
  }
  model.sprite.addEventListener("click", function(event) {
		if(sprite.currentAnimation === "walk") {
      sprite.vX = 0;
      sprite.gotoAndPlay("dieByShot");
    }
	});
	model.sprite.on("animationend", function(event) {
		if(event.name === "spawn") {
      sprite.gotoAndPlay("walk");
    }
		if(event.name === "dieByShot") {
      sprite.gotoAndPlay("dead");
    }
    if(event.name === "dead") {
    	
    }
	});
  return model;
}