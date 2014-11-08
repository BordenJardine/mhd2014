var footerHeight = 100;
var speakerSize = 64;
var origSize = 128;
var svgScale = speakerSize / origSize;

var speakerTemplate;
var canvas = null;

var SourceUI = function(options, callback) {
  speakerTemplate.clone(function(clone){
    this.ui = clone;
    this.ui.set({
      left: options.left,
      top: options.top,
      lockScalingX: true,
      lockScalingY: true,
    });
    canvas.add(this.ui);
    canvas.renderAll();
    if(callback)
      callback(this);
  });
};

window.onload = function(){
  fabric.loadSVGFromURL("/speaker.svg", function(object, options) {
    speakerTemplate = fabric.util.groupSVGElements(object, options);
    canvas = new fabric.Canvas('audio-space');
    canvas.backgroundColor = "#313759";
    speakerTemplate.set({
      left: 0,
      top: 0,
      width: speakerSize,
      height: speakerSize,
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
    });

    window.onresize = function() {
      canvas.setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - footerHeight
      });
      canvas.renderAll();
    };

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
