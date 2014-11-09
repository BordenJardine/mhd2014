var ListenerNode = function(x, y, done) {
  this.x = x;
  this.y = y;
  this.audioListener = audioCtx.listener;
  this.audioListener.setPosition(x, y, 0);
  this.onXBoundary = false;
  this.onYBoundary = false;

  this.fabricate(done);
};

ListenerNode.prototype.setPosition = function(x,y) {
  xRes = checkBoundary(x, maxX);
  yRes = checkBoundary(y, maxY);

  this.onXBoundary = xRes.onBoundary;
  this.onYBoundary = yRes.onBoundary;

  x = xRes.value;
  y = xRes.value;

  this.ui.left = x;
  this.ui.top = y;
  this.ui.setCoords();
  this.onMove();
  this.audioListener.setPosition(this.x, this.y, 0);
};


ListenerNode.prototype.onRotate = function(e) {
  var rads = this.ui.angle * TO_RADIANS;
  var xDir = Math.cos(rads);
  var yDir = Math.sin(rads);
  console.log('listener', xDir, yDir);
  this.audioListener.setOrientation(xDir, yDir, -1, 0, 1, 0);
};

ListenerNode.prototype.onMove = function(e) {
  this.x = this.ui.getLeft();
  this.y = this.ui.getTop();
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
    //lockMovementX: true,
    //lockMovementY: true,
    //selectable: false
  });
  this.ui.on('moving', this.onMove.bind(this));
  this.ui.on('rotating', this.onRotate.bind(this));
  canvas.add(this.ui);
  canvas.renderAll();
  if(done) {
    window.setTimeout(done, 1);
  }
};

var checkBoundary = function(n, max) {
  var bound
  if(n < 0 || n > max) {
    if(n < 0){
      n = 0;
      bound = true;
    };
    if(n > max) {
      n = max;
      bound = true;
    };
  } else {
    bound = false;
  }

  return {
    onBoundary: bound,
    value: n
  }
};
