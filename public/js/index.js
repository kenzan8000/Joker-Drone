/**************************************************
 *            JokerDrone                          *
 **************************************************/
function JokerDrone() {
};

/// Member
/**
 * deploy how Drones fly
 **/
JokerDrone.prototype.deploy = JokerDrone_deploy;

/// Implementation
function JokerDrone_deploy() {
    console.log("deploy");
}


/// Global variable
var g_jokerDrone = new JokerDrone();
