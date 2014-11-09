var ListenerNode = function(x, y, done) {
  this.x = x;
  this.y = y;
  this.buffer;
  this.pannerNode;

  this.fabricate(done);
};

ListenerNode.prototype.setPosition = function(x,y) {
  this.x = x;
  this.y = y;
};

ListenerNode.prototype.fabricate = function(done) {
  this.ui = new fabric.Triangle({
    left: this.x,
    top: this.y,
    height: speakerSize,
    width: speakerSize,
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
