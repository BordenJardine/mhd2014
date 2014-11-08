var StemNode = function(x, y, color, path, done) {
  this.x = x;
  this.y = y;
  this.buffer;
  this.pannerNode;

  this.fabricate(color);
  this.bufferSound(path, done);
};

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

StemNode.prototype.onMove = function(e, element) {
  this.x = element.getLeft();
  this.y = element.getTop();
};

StemNode.prototype.fabricate = function(color) {
  var self = this;
  var square = new fabric.Rect({
    left: this.x,
    top: this.y,
    fill: color,
    width: 20,
    height: 20
  });
  square.lockScalingX = true;
  square.lockScalingY = true;
  square.on('moving', function(e){
    self.onMove(e);
  });
  canvas.add(square, square);
};


StemNode.prototype.playSound = function(time) {
  if(time == undefined) { time = audioCtx.currentTime };
  var source = audioCtx.createBufferSource();
  source.buffer = this.buffer;
  source.loop = true;
  source.connect(audioCtx.destination);
  source.start(time);
};

