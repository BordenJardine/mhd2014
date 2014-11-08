var footerHeight = 100;
var speakerSize = 32;
var origSize = 500;
var svgScale = speakerSize / origSize;

var speakerTemplate = null;

var SourceUI = function(options) {
  this.ui = new fabric.Group(speakerTemplate.paths.map(function(path){
    var clone = fabric.util.object.clone(path);
    console.log(clone, path);
    return clone;
  }));
  this.canvas = options.canvas;

  this.ui.set({
    left: options.left,
    top: options.top,
    width: speakerSize,
    height: speakerSize,
    lockScalingX: true,
    lockScalingY: true,
  });

  this.canvas.add(this.ui);
};

window.onload = function(){
  fabric.loadSVGFromURL("/speaker.svg", function(object, options) {
    speakerTemplate = fabric.util.groupSVGElements(object, options);
    var canvas = new fabric.Canvas('audio-space');
    canvas.backgroundColor = "#313759";
    speakerTemplate.set({
      left: 80,
      top: 175,
      width: speakerSize / svgScale,
      height: speakerSize / svgScale,
      scaleX: svgScale,
      scaleY: svgScale,
      lockScalingX: true,
      lockScalingY: true,
    });

    speakerTemplate.paths.forEach(function(path){
      var fill = "#BCBF50";
      path.stroke = fill;
      if(path.fill) {
        path.fill = fill;
      }
      path.scaleX = svgScale;
      path.scaleY = svgScale;
    });

    window.onresize = function() {
      canvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - footerHeight
      });
      canvas.renderAll();
    };

//    canvas.add(speakerTemplate);
    var sourceUI = new SourceUI({
      top: 80,
      left: 175,
      canvas: canvas
    });

    var sourceUI = new SourceUI({
      top: 80,
      left: 275,
      canvas: canvas
    });

    window.onresize();
  });
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
