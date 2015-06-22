/**************************************************
 *            JokerDrone                          *
 **************************************************/
function JokerDrone() {
};

/// Member

/// commands
JokerDrone.prototype.commands = [];

/**
 * deploy how drone flies
 **/
JokerDrone.prototype.deploy = JokerDrone_deploy;

/**
 * takeoff
 **/
JokerDrone.prototype.takeoff = JokerDrone_takeoff;

/**
 * land
 **/
JokerDrone.prototype.land = JokerDrone_land;

/**
 * go
 * @param position position from the start point ex) {x: -1.0, y: 1.0, z: 1.5}
 **/
JokerDrone.prototype.go = JokerDrone_go;

/// Implementation
function JokerDrone_deploy() {
    console.log(this.commands);
}

function JokerDrone_takeoff() {
    this.commands.push({takeoff: ""});
}

function JokerDrone_land() {
    this.commands.push({land: ""});
}

function JokerDrone_go(position) {
    this.commands.push({go: position});
}


/**************************************************
 *                  Main                          *
 **************************************************/
window.onload = function() {
    // editor
    var editor = ace.edit("editor");
    editor.getSession().setMode("ace/mode/javascript");
    editor.setTheme("ace/theme/twilight");
}


function deploy() {
    var drone = JokerDrone();
    var code = ace.edit("editor").getSession().getValue();
    console.log(code);
    eval(code);
    drone.deploy();
}
