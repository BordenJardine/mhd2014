var footerHeight = 100;
var speakerSize = 64;
var origSize = 64;
var svgScale = speakerSize / origSize;

var speakerTemplate;
var canvas = null;
var audioCtx = null;

//var filesToPlay = ['ymo.mp3', 'ymo.mp3', 'ymo.mp3', 'ymo.mp3', 'ymo.mp3'];
var filesToPlay = ['ymo.mp3'];
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

    var listener = new ListenerNode(168,268, function(){
      sources = filesToPlay.map(function(file, i){
        var stem = new StemNode(100,100, file, function(){
          canvas.renderAll();
          stem.playSound();
        });
        return stem;
      })
    });
    listeners.push(listener);
  });
};

var lineUp = function(){
  sources.forEach(function(source, i){
    source.setAngle(90);
    if(sources.length !== 1) {
      source.setPosition(50 + i * 300 / (sources.length - 1), 80);
    } else {
      source.setPosition(233, 80);
    }
  });
}

var stack = function() {
  sources.forEach(function(source){
    source.setAngle(90);
    source.setPosition(200, 80);
  });
}

var semiCircle = function() {
  sources.forEach(function(source, i){
    if(sources.length !== 1) {
      var degrees = i * 180 / (sources.length - 1);
      source.setAngle(degrees);
      var radians = degrees / 180 * Math.PI;
      var radius = 150;
      var x = 200 - radius * Math.cos(radians);
      var y = 288 - radius * Math.sin(radians);
      console.log(x, y, radians, degrees);
      source.setPosition(x, y);
    } else {
      source.setAngle(90);
      source.setPosition(233, 80);
    }
  });
}
