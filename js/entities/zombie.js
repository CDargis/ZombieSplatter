define(['engine/gameEngine', 'sprites/zombie', 'lib/easeljs', 'lib/preloadjs', 'lib/tweenjs'], function(gEngine, zSprite) {
	function createZombie(data) {
	  var zombieSprite = zSprite.createSprite(data);

	  var createModel = function(sprite) {
	  	var model = {
		    sprite: sprite
		  };
		  model.update = function(event, data) {
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
		    	gEngine.removeEntity(model);
		    }
			});
			model.init = function() {
	    	sprite.gotoAndPlay("spawn");
	    }
		  return model;
	  }
	  return createModel(zombieSprite);
	}
	return {
		createZombie: createZombie
	}
});