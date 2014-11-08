var footerHeight = 100;
var speakerSize = 64;
var origSize = 64;
var svgScale = speakerSize / origSize;

var speakerTemplate;
var canvas = null;
var audioCtx = null;

var listeners = [];
var sources = [];

window.onload = function(){
  audioCtx = new (window.AudioContext || webkitAudioContext)();
  canvas = new fabric.Canvas('audio-space');
  fabric.loadSVGFromURL("/speaker.svg", function(object, options) {
    speakerTemplate = fabric.util.groupSVGElements(object, options);
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
    window.onresize();

    var listener = new ListenerNode(200,200);
    listeners.push(listener);

    var stem = new StemNode(100, 100, 'ymo.mp3', function() {
      canvas.renderAll();
      stem.playSound();
    });
    sources.push(stem);

  });
};
