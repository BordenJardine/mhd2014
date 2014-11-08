var footerHeight = 100;

window.onload = function(){
  fabric.loadSVGFromURL("/speaker.svg", function(objects, options) {
    var speaker = fabric.util.groupSVGElements(objects, options);
    var canvas = new fabric.Canvas('test');
    var speakerSize = 32;
    var svgScale = 0.5;
    speaker.set({
      left: 80,
      top: 175,
      width: speakerSize / svgScale,
      height: speakerSize / svgScale,
      scaleX: svgScale,
      scaleY: svgScale,
      lockScalingX: true,
      lockScalingY: true
    });
    canvas.add(speaker);
    window.onresize = function() {
      canvas.setDimensions({
        width: document.width,
        height: document.height - footerHeight
      });
      canvas.renderAll();
    };
    window.onresize();
  });
};

var SourceUI = function() {
};

/*
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
*/
