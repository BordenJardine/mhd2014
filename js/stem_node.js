var StemNode = function(x, y, path, done) {
  this.x = x;
  this.y = y;
  this.buffer;

  this.angleGainNode = audioCtx.createGain();
  this.angleGainNode.gain.value = 1.0;

  this.pannerNode = audioCtx.createPanner();
  this.pannerNode.panningModel = 'HRTF';
  this.pannerNode.distanceModel = 'inverse';
  this.pannerNode.setPosition(x, y, 0);
  this.pannerNode.coneInnerAngle = 35;
  this.pannerNode.coneOuterAngle = 120;
  this.pannerNode.coneOuterGain = 0.1;
  this.pannerNode.rolloffFactor = 0.05 / window.innerWidth / 320;

  this.pannerNode.connect(this.angleGainNode);
  this.angleGainNode.connect(audioCtx.destination);

  this.fabricate(function(){
    this.updateAngleGain();
    this.bufferSound(path, done);
  }.bind(this));
};

var initPanner = function() {

  return panner;
}

StemNode.prototype.bufferSound = function(url, done) {
  var self = this;
  var bufferListener = function(event) {
    audioCtx.decodeAudioData(event.target.response, function(buffer) {
      self.buffer = buffer;
      if(typeof done == 'function'){ done(); }
    });
  };

  var request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';
  request.addEventListener('load', bufferListener, false);
  request.send();
};

StemNode.prototype.setPosition = function(x, y) {
  this.ui.left = x;
  this.ui.top = y;
  this.ui.setCoords()
  this.onMove();
  canvas.renderAll();
}

StemNode.prototype.setAngle = function(degrees) {
  this.ui.setAngle(degrees);
  this.onRotate();
  canvas.renderAll();
}

StemNode.prototype.onRotate = function(e) {
  this.updateAngleGain();
};

StemNode.prototype.updateAngleGain = function() {
  var rads = this.ui.angle * TO_RADIANS;
  var xDir = Math.cos(rads);
  var yDir = Math.sin(rads);

  this.pannerNode.setOrientation(xDir, yDir, 0);
}

StemNode.prototype.onMove = function(e) {
  this.x = this.ui.getLeft();
  this.y = this.ui.getTop();
  this.pannerNode.setPosition(this.x, this.y, 0);
};

StemNode.prototype.fabricate = function(done) {
  speakerTemplate.clone(function(clone){
    this.ui = clone;
    this.ui.set({
      left: this.x,
      top: this.y,
      originX: 'center',
      originY: 'center',
      lockScalingX: true,
      lockScalingY: true,
      angle: 90
    });
    this.ui.on('moving', this.onMove.bind(this));
    this.ui.on('rotating', this.onRotate.bind(this));
    canvas.add(this.ui);
    canvas.renderAll();
    done();
  }.bind(this));
};

StemNode.prototype.playSound = function(time) {
  if(time == undefined) { time = audioCtx.currentTime };
  var source = audioCtx.createBufferSource();
  source.buffer = this.buffer;
  source.loop = true;
  source.connect(this.pannerNode);
  source.start(time);
};
