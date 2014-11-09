var LISTENER_MODE = "Tilt"; // "Drag"

var r_mult = 10;                    //TODO! keep in mind :)
var gravity_alpha = 0.8;

var x, y;
x = 168;
y = 268;
var acceleration_incl_grav = [null, null, null];
var linear_acceleration = [null, null, null];
var position = [null, null, null];
var linear_position = [null, null, null];
var rotations = [null, null, null];
var gravity = [0,0,0];

function removeGravityFromAccel(){
    for (var i=0; i<3; i++) {
        gravity[i] = gravity_alpha * gravity[i] + (1 - gravity_alpha) * acceleration_incl_grav[i];
        linear_acceleration[i] = (acceleration_incl_grav[i] - gravity[i]);
    }
}

function round_and_stringify(num_array, rounding_mult){
    for (var i=0; i<num_array.length; i++){
        num_array[i] = Math.round(rounding_mult*num_array[i])/rounding_mult;
    }
    array_string = num_array.join(', ');
    return array_string;
}

var Kalman_x = set_up_kalman();
var KM_x = Kalman_x[0];
var KO_x = Kalman_x[1];
var Kalman_y = set_up_kalman();
var KM_y = Kalman_y[0];
var KO_y = Kalman_y[1];
var Kalman_z = set_up_kalman();
var KM_z = Kalman_z[0];
var KO_z = Kalman_z[1];

//linear
var linear_Kalman_x = set_up_kalman();
var linear_KM_x = linear_Kalman_x[0];
var linear_KO_x = linear_Kalman_x[1];
var linear_Kalman_y = set_up_kalman();
var linear_KM_y = linear_Kalman_y[0];
var linear_KO_y = linear_Kalman_y[1];
var linear_Kalman_z = set_up_kalman();
var linear_KM_z = linear_Kalman_z[0];
var linear_KO_z = linear_Kalman_z[1];

var timetime = Date.now();

if (window.DeviceMotionEvent != undefined) {
    window.ondevicemotion = function(e) {

        if (LISTENER_MODE != "Tilt"){
            console.log("not in tilt mode!");
            return;
        }

        timetime = Date.now();

        //Get acceleration!
        acceleration_incl_grav[0] = e.accelerationIncludingGravity.x;
        acceleration_incl_grav[1] = e.accelerationIncludingGravity.y;
        acceleration_incl_grav[2] = e.accelerationIncludingGravity.z;

        removeGravityFromAccel();

        //Do Kalman shit!
        position[0] = update_kalman(KM_x, KO_x, acceleration_incl_grav[0]);
        position[1] = update_kalman(KM_y, KO_y, acceleration_incl_grav[1]);
        position[2] = update_kalman(KM_y, KO_y, acceleration_incl_grav[2]);

        linear_position[0] = update_kalman(linear_KM_x, linear_KO_x, linear_acceleration[0]);
        linear_position[1] = update_kalman(linear_KM_y, linear_KO_y, linear_acceleration[1]);
        linear_position[2] = update_kalman(linear_KM_z, linear_KO_z, linear_acceleration[2]);

        var dimScale = 1;
        x -= dimScale * linear_position[0];
        y += dimScale * linear_position[1];
        if(listeners && listeners[0]) {
          listeners[0].setPosition(x, y); //168 + dimScale * linear_position[0], 268 - dimScale * linear_position[1]);
        }
        //TODO!
        if ( e.rotationRate ) {
            rotations[0] = e.rotationRate.alpha;
            rotations[1] = e.rotationRate.beta;
            rotations[2] = e.rotationRate.gamma;
        }
    }
}

function set_up_kalman(){
    var d_t = .05;
    var sigma_a = 1; //?? MAYBE????? standard deviation of accel
    var sigma_z = 1; //?? MAYBE????? standard deviation of measurement error
    var L = 10000;

    var x_0 = $V([0,0,0]); //$V([-10]);
    var P_0 = $M([
        [L,0,0],
        [0,L,0],
        [0,0,L]
        ]); //$M([[1]]);
    var F_k = $M([
        [1,d_t,d_t*d_t/2],
        [0,1,d_t],
        [0,0,1]
        ]); //$M([[1]]);
    var G_k = $M([
        [d_t*d_t/2],
        [d_t],
        [1]
        ]);
    var Q_k = (G_k.x(G_k.transpose())).x(sigma_a*sigma_a); //$M([[0]]);
    var KM = new KalmanModel(x_0,P_0,F_k,Q_k);
    var z_k = $V([1]); //$V([1]); //measure from accel
    var H_k = $M([[0,0,1]]);//$M([[1]]);
    var R_k = $M([[sigma_z*sigma_z]]); //$M([[4]]);
    var KO = new KalmanObservation(z_k,H_k,R_k);

    return [KM, KO];
}

function update_kalman(KM, KO, z_k){
    KO.z_k=$V([z_k]);
    KM.update(KO);
    return KM.x_k.elements[0];
}
