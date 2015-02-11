define(['include/createJS'], function() {
	var createBitmapCreator = function() {
		var bitmapCreator = {
      img: {},
      init: function(loadQueue) {
        bitmapCreator.img = loadQueue.getResult('bullet');
      },
      create: function() {
      	var bitmap = new createjs.Bitmap(bitmapCreator.img);
        var bounds = bitmap.getBounds();
        bitmap.regX = bounds.width / 2;
        bitmap.regY = bounds.height / 2;
      	return bitmap;
      }
    };
    return bitmapCreator
  };
  return createBitmapCreator();
});
