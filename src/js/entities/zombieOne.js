define(['sprites/zombieOne', 'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function(zombieOneSprite) {
	var decorate = function(entity, spriteData) {
	  var sprite = zombieOneSprite.createSprite(spriteData);
	  entity.sprite = sprite;
	  entity.update = function(event, data) {
    	if(sprite.currentAnimation === "walk") {
		    if (sprite.x >= data.width - 50) {
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
    };
	  entity.sprite.addEventListener("click", function(event) {
			if(entity.sprite.currentAnimation === "walk") {
	      entity.sprite.vX = 0;
	      entity.sprite.gotoAndPlay("dieByShot");
	    }
		});
		entity.sprite.on("animationend", function(event) {
			if(event.name === "spawn") {
	      entity.sprite.gotoAndPlay("walk");
	    }
			if(event.name === "dieByShot") {
	      entity.sprite.gotoAndPlay("dead");
	    }
	    if(event.name === "dead") {
	    	entity.dead = true;
	    }
		});
		entity.init = function() {
    	sprite.gotoAndPlay("spawn");
    };
	};
	var init = function(loadQueue) {
		zombieOneSprite.init(loadQueue);
	};
	return {
		init: init,
		decorate: decorate
	};
});
