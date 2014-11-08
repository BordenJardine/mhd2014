window.onload = function(){
  // create a wrapper around native canvas element (with id="c")
  var canvas = new fabric.Canvas('test');

  // create a triangleangle object
  var triangles = [];
  for(var i = 0; i < 5; ++i) {
    var triangle = new fabric.Triangle({
      left: 25 * i,
      top: 100,
      fill: 'red',
      width: 20,
      height: 20
    });
    triangle.lockScalingX = true;
    triangle.lockScalingY = true;
    canvas.add(triangle);
    triangles.push(triangle);
  }

  setTimeout(function(){
    triangles[0].top = 200;
    canvas.renderAll();
  }, 1000)
}
