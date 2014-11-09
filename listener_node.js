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
  this.ui.left = x;
  this.ui.top = y;
  this.ui.setCoords();
  canvas.renderAll();
  this.audioListener.setPosition(this.x, this.y, 0);
};

ListenerNode.prototype.fabricate = function(done) {
  this.ui = new fabric.Triangle({
    left: this.x,
    top: this.y,
    height: speakerSize * 0.75,
    width: speakerSize * 0.75,
    fill: "#BCBF50",
    stroke: "#2BADB1",
    strokeWidth: 3,
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
