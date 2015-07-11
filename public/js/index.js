/**************************************************
 *            JokerDrone                          *
 **************************************************/
function JokerDrone() {
};

/// Member

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

function JokerDrone_takeoff() {
    g_commands.push({takeoff: ""});
}

function JokerDrone_land() {
    g_commands.push({land: ""});
}

function JokerDrone_go(position) {
    g_commands.push({go: position});
}


/**************************************************
 *                  Main                          *
 **************************************************/

/// global variable
var g_commands = [];

window.onload = function() {
    // editor
    var editor = ace.edit("editor");
    editor.getSession().setMode("ace/mode/javascript");
    editor.setTheme("ace/theme/vibrant_ink");
}

function compile() {
    g_commands = [];

    var code = ace.edit('editor').getSession().getValue();
    eval(code);

    console.log(g_commands);
}
