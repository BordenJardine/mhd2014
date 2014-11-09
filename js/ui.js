var TO_RADIANS = Math.PI / 180;
var footerHeight = 100;
var speakerSize = 64;
var origSize = 64;
var svgScale = speakerSize / origSize;
var lookahead = 0.25;
var maxX = window.innerWidth;
var maxY = window.innerHeight - footerHeight;


var speakerTemplate;
var canvas = null;
var audioCtx = null;

var audioChoices = [
  {key: "Default (5 sources)",
   filesToPlay: ['audio/jesu_joy/1.mp3', 'audio/jesu_joy/2.mp3', 'audio/jesu_joy/3.mp3', 'audio/jesu_joy/4.mp3', 'audio/440.ogg']
  },
  {key: "Super annoying (10 sources)",
    filesToPlay: ['audio/440.ogg', 'audio/440.ogg', 'audio/440.ogg', 'audio/440.ogg', 'audio/440.ogg', 'audio/440.ogg', 'audio/440.ogg', 'audio/440.ogg', 'audio/440.ogg', 'audio/440.ogg', 'audio/440.ogg', 'audio/440.ogg', 'audio/440.ogg', 'audio/440.ogg']
  },
  {key: "Single (1 source)",
  filesToPlay: ['audio/440.ogg']
  }
]
var listeners = [];
var sources = [];

window.onload = function(){
  canvas = new fabric.Canvas('audio-space');

  fabric.loadSVGFromURL("assets/speaker.svg", function(object, options) {
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
      path.stroke = "#2BADB1";
      path.strokeWidth = 3;
      if(path.fill) {
        path.fill = "#BCBF50";
      }
    });

    window.onresize = function() {
      maxX = window.innerWidth;
      maxY = window.innerHeight - footerHeight;
      canvas.setDimensions({
        width: maxX,
        height: maxY
      });
      canvas.renderAll();
    };
    window.onresize();
  });
}

var start = function(){
  var overlay = document.getElementById('touchtostart');
  overlay.parentNode.removeChild(overlay);

  audioCtx = new (window.AudioContext || webkitAudioContext)();

  listAvailableAudioChoices();
  resetAudio();
};


var resetAudio = function() {
  var a = document.getElementById("audio_list");
  var audio_index = a.options[a.selectedIndex].value;
  var audio = audioChoices[audio_index];

  // delete objects!!
  for (var i=0; i < sources.length; i++){
    sources[i].pannerNode.disconnect(0);
    sources[i].ui.remove();
  }
  sources = [];

  for (var i=0; i < listeners.length; i++){
    listeners[i].ui.remove();
  }
  listeners = [];

  var listener = new ListenerNode(168,268, function(){
      sources = createSourceNodes(audio.filesToPlay, function() {
         playSourceNodes(audioCtx.currentTime + lookahead);
      });
      window.setTimeout(circleUp, 100);
    });
  listeners.push(listener);
}


var listAvailableAudioChoices = function() {
  var selectbox = document.getElementById("audio_list");
  for (var i=0; i < audioChoices.length; i++){
    var optn = document.createElement("OPTION");
    optn.text = audioChoices[i].key;
    optn.value = i;
    selectbox.options.add(optn);
  }
}

var createSourceNodes = function(filesToPlay, done) {
      var callbackCounter = 1;

      var checkDone = function() {
        if(callbackCounter++ == filesToPlay.length) {
          done();
        }
      };

      var sources = filesToPlay.map(function(file, i){
        var stem = new StemNode(100 + (i * 50),100, '../' + file, function() {
          canvas.renderAll();
          checkDone();
        });
        return stem;
      });
    return sources;
};

var playSourceNodes = function(time) {
    for(i in sources) {
      sources[i].playSound(time);
    }
}

var lineUp = function(){
  var start = window.innerWidth * 0.125;
  var len = window.innerWidth * 0.75;
  sources.forEach(function(source, i){
    source.setAngle(90);
    if(sources.length !== 1) {
      source.setPosition(start + i * len / (sources.length - 1), window.innerHeight * 0.25);
    } else {
      source.setPosition(window.innerWidth / 2, window.innerHeight * 0.25);
    }
  });
  resetAcceleration();
}

var stack = function() {
  centerX = window.innerWidth / 2;
  centerY = window.innerHeight / 4;

  sources.forEach(function(source, i){
    source.setAngle(90);
    var offset = 10;
    source.setPosition(centerX - (sources.length - 1 * 5) + i * 10, i * 10 + centerY);
  });
  resetAcceleration();
}

var semiCircle = function() {
  var centerX = window.innerWidth / 2;
  var centerY = window.innerHeight / 2 - footerHeight / 2;
  var radius = Math.min(window.innerWidth, window.innerHeight - footerHeight) / 3;
  sources.forEach(function(source, i){
    if(sources.length !== 1) {
      var degrees = i * 180 / (sources.length - 1);
      source.setAngle(degrees);
      var radians = degrees / 180 * Math.PI;
      var x = centerX - radius * Math.cos(radians);
      var y = centerY - radius * Math.sin(radians);
      source.setPosition(x, y);
    } else {
      source.setAngle(90);
      source.setPosition(centerX, centerY - radius);
    }
  });
  resetAcceleration();
}

var circleUp = function() {
  var centerX = window.innerWidth / 2;
  var centerY = window.innerHeight / 2 - footerHeight / 2;
  var radius = Math.min(window.innerWidth, window.innerHeight - footerHeight) / 3;

  sources.forEach(function(source, i){
    if(sources.length !== 1) {
      var degrees = i * 360 / (sources.length);
      source.setAngle(degrees);
      var radians = degrees / 180 * Math.PI;
      var x = centerX - radius * Math.cos(radians);
      var y = centerY - radius * Math.sin(radians);
      source.setPosition(x, y);
    } else {
      source.setAngle(90);
      source.setPosition(centerX, centerY - radius);
    }
  });
  resetAcceleration();
}
