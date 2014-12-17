function handleImageLoad(event) {

}

function handleImageError(event) {
  
}

function createZombieEntity() {
	var zombie = new Image();
	zombie.onload = handleImageLoad;
  zombie.onerror = handleImageError;
  zombie.src = "assets/zombie.png";

  var spriteSheet = createZombieSpriteSheet(zombie);
  var zombieSprite = createZombieSprite(spriteSheet);

  var createModel = function(sprite) {
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
	    },
	    init: function(stage) {
	    	stage.addChild(sprite);
	    	sprite.gotoAndPlay("spawn");
	    }
	  }
	  model.sprite.addEventListener("click", function(event) {
			if(model.sprite.currentAnimation === "walk") {
	      model.sprite.vX = 0;
	      model.sprite.gotoAndPlay("dieByShot");
	    }
		});
		model.sprite.on("animationend", function(event) {
			if(event.name === "spawn") {
	      model.sprite.gotoAndPlay("walk");
	    }
			if(event.name === "dieByShot") {
	      model.sprite.gotoAndPlay("dead");
	    }
	    if(event.name === "dead") {
	    	removeEntity(model);
	    }
		});
	  return model;
  }
  return createModel(zombieSprite);
}
