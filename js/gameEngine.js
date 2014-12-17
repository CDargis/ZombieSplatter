var width = 750;
var height = 400;
var entities = [];

var stage;
function initGame() {
	stage = new createjs.Stage("demoCanvas");
  
  // Create an entity and add to the entities array
  var entity = createZombieEntity();
  entities.push(entity);

  for(var i = 0; i < entities.length; i++) {
    entities[i].init(stage);
  }
  createjs.Ticker.addEventListener("tick", onTick);
}

function onTick(event) {
  for(var i = 0; i < entities.length; i++) {
    var entity = entities[i];
    entity.update(event);
  }
	stage.update();
}

function removeEntity(entity) {
  var index = entities.indexOf(entity);
  if(index !== -1) {
    entities.splice(index, 1);
  }
  stage.removeChild(entity.sprite);
}
