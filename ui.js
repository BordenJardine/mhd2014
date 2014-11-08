var footerHeight = 100;
var speakerSize = 64;
var origSize = 64;
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
      angle: 90
    });
    canvas.add(this.ui);
    canvas.renderAll();
    if(callback)
      callback(this);
  });
};

var ListenerUI = function(options, callback) {
  console.log("whoa");
  this.ui = new fabric.Triangle({
    left: options.left,
    top: options.top,
    height: speakerSize,
    width: speakerSize,
    fill: "#BCBF50",
    lockScalingX: true,
    lockScalingY: true
  });
  canvas.add(this.ui);
  canvas.renderAll();
  if(callback) {
    window.setTimeout(callback, 1);
  }
}

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

    new SourceUI({
      top: 80,
      left: 175,
    });

    new SourceUI({
      top: 80,
      left: 275,
    });

    new ListenerUI({
      top: 180,
      left: 200
    });

    window.onresize();
  });
};
