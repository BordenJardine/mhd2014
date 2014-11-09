
function initPodo() {
  var gravity_alpha = 0.8;

  var acceleration_incl_grav = [null, null, null];
  var linear_acceleration = [null, null, null];
  var gravity = [0,0,0];
  var steps = 0;
  var stepTimeoutMax = 2;
  var stepTimeout = stepTimeoutMax;
  var thresh = 4;
  var total = 0;
  var stepLength = 15;

  function removeGravityFromAccel(){
      for (var i=0; i<3; i++) {
          gravity[i] = gravity_alpha * gravity[i] + (1 - gravity_alpha) * acceleration_incl_grav[i];
          linear_acceleration[i] = (acceleration_incl_grav[i] - gravity[i]);
      }
  }

  if (window.DeviceMotionEvent != undefined) {
    window.addEventListener('devicemotion', function(e) {
      if (LISTENER_MODE != "Walk"){
          return;
      }
      //Get acceleration!
      acceleration_incl_grav[0] = e.accelerationIncludingGravity.x;
      acceleration_incl_grav[1] = e.accelerationIncludingGravity.y;
      acceleration_incl_grav[2] = e.accelerationIncludingGravity.z;
      removeGravityFromAccel();

      if(stepTimeout > 0) {
        stepTimeout--;
        return;
      }
      stepTimeout = stepTimeoutMax;
      total = 0;
      for(var i=0; i< linear_acceleration.length; i++) { //just add beta and gamma!
        total += Math.pow(linear_acceleration[i], 2);
      }
      total = Math.pow(total, linear_acceleration.length);
      if (total > thresh) {
        steps++;
        var dy = Math.cos(listeners[0].ui.angle * TO_RADIANS) * stepLength;
        var dx = Math.sin(listeners[0].ui.angle * TO_RADIANS) * stepLength;
        x += dx;
        y -= dy;
        listeners[0].setPosition(x,y);
      }
      /*
      document.getElementById("steps").innerHTML = steps;
      document.getElementById("norm").innerHTML = total;
      document.getElementById("x").innerHTML = Math.pow(linear_acceleration[0], 2);
      document.getElementById("y").innerHTML = Math.pow(linear_acceleration[1], 2);
      document.getElementById("z").innerHTML = Math.pow(linear_acceleration[2], 2);
      */
    });
  }
  if (window.DeviceOrientationEvent) {
    // Listen for the deviceorientation event and handle the raw data
    window.addEventListener('deviceorientation', function(eventData) {
      if (LISTENER_MODE != "Walk"){
          return;
      }

      var dir = eventData.alpha

      // call our orientation event handler
      if(listeners && listeners[0]) {
        listeners[0].setAngle(dir);
      }
    }, false);
    }
}
