var ListenerNode = function(x, y, done) {
  this.x = x;
  this.y = y;
  this.audioListener = audioCtx.listener;
  this.audioListener.setPosition(x, y, 0);

  this.fabricate(done);
};

ListenerNode.prototype.setPosition = function(x,y) {
  this.x = x;
  this.y = y;
  this.audioListener.setPosition(this.x, this.y, 0);
};

ListenerNode.prototype.fabricate = function(done) {
  this.ui = new fabric.Triangle({
    left: this.x,
    top: this.y,
    height: speakerSize,
    width: speakerSize,
    fill: "#BCBF50",
    lockScalingX: true,
    lockScalingY: true,
    lockMovementX: true,
    lockMovementY: true,
    selectable: false
  });
  canvas.add(this.ui);
  canvas.renderAll();
  if(done) {
    window.setTimeout(done, 1);
  }
};
