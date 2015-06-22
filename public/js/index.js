(function(global) {
"use strict;"


/**************************************************
 *            JokerDrone                          *
 **************************************************/
function JokerDrone() {
};

/// Member

/// commands
JokerDrone.prototype.commands = [];

/**
 * deploy how Drones fly
 **/
JokerDrone.prototype.deploy = JokerDrone_deploy;

/**
 * go
 * @param position position from the start point ex) {x: -1.0, y: 1.0, z: 1.5}
 **/
JokerDrone.prototype.go = JokerDrone_go;

/// Implementation
function JokerDrone_deploy() {
    console.log("deploy");
}

function JokerDrone_go(position) {
    this.commands.push({go: position});
}


/**************************************************
 *                  Main                          *
 **************************************************/
window.onload = function() {
    var editor = ace.edit("editor");
    editor.getSession().setMode("ace/mode/javascript");
    editor.setTheme("ace/theme/twilight");

    /// Global variable
    var g_jokerDrone = new JokerDrone();
}


})((this || 0).self || global);
