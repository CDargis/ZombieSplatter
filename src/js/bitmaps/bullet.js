define(['include/createJS'], function() {
	var createBitmapCreator = function() {
		var bitmapCreator = {
      img: {},
      init: function(loadQueue) {
        bitmapCreator.img = loadQueue.getResult('bullet');
      },
      create: function() {
      	var bitmap = new createjs.Bitmap(bitmapCreator.img);
      	return bitmap;
      }
    };
    return bitmapCreator
  };
  return createBitmapCreator();
});
