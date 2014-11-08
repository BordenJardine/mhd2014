var StemNode = function(x, y, path, done) {
  this.x = x;
  this.y = y;
  this.buffer;
  this.pannerNode;

  this.fabricate(function(){
    this.bufferSound(path, done);
  }.bind(this));
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

StemNode.prototype.onMove = function(e) {
  this.x = this.ui.getLeft();
  this.y = this.ui.getTop();
};

StemNode.prototype.fabricate = function(done) {
  speakerTemplate.clone(function(clone){
    this.ui = clone;
    this.ui.set({
      left: this.x,
      top: this.y,
      lockScalingX: true,
      lockScalingY: true,
      angle: 90
    });
    this.ui.on('moving', this.onMove.bind(this));
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
  source.connect(audioCtx.destination);
  source.start(time);
};
