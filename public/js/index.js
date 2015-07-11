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



$(document).ready(function() {
    // editor
    // (Set window.editor to use the variable at another place.)
    window.editor = ace.edit("editor");
    window.editor.getSession().setMode("ace/mode/javascript");
    window.editor.setTheme("ace/theme/twilight");

    // Erase the warning
    window.editor.$blockScrolling = Infinity
});

function compile() {
    g_commands = [];

    var code = ace.edit('editor').getSession().getValue();
    eval(code);

    console.log(g_commands);

    // Insert a transition effect
    var terminal = new Terminal();
    terminal.transition(window.editor);
}


/**************************************************
 *            Terminal                          *
 **************************************************/
function Terminal() {
};

/// Member

/**
 *
 **/
Terminal.prototype.transition = Terminal_transition;
Terminal.prototype.random_string = Terminal_random_string;
Terminal.prototype.start_timer = Terminal_start_timer;
Terminal.prototype.stop_timer = Terminal_stop_timer;
Terminal.prototype.timer = Terminal_timer;

// Constant
// ref: http://qiita.com/yutori_enginner/items/98ecaae8945e3c17efa2
Terminal.prototype.INTERVAL = 15;  // Interval to call the function[ms] (呼び出す間隔).
Terminal.prototype.LINE_NUM = 100; // The number of iteration to append lines (行を追加する回数).
Terminal.prototype.BACKGROUND_COLOR = '#232323'; // The background color of the editor (used to hide page number divs).
var StartTimer, StopTimer, Timer, time, timerID;
time = 0;
timerID = 0;

function Terminal_transition(editor) {
    this.start_timer();
}


/**
 *  Create a random string
 **/
function Terminal_random_string(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

// Definition of timer functions
//Terminal_start_timer = function() {
function Terminal_start_timer() {
  timerID = setInterval(Terminal_timer, Terminal.INTERVAL);
};
function Terminal_stop_timer() {
  clearInterval(timerID);
};
function Terminal_timer() {
  time = time + 1;

  // Create a random string that has 256 characters.
  var rString = Terminal_random_string(256, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  /*asciify("HelloWorld", {font: 'starwars'}, function(err, msg) {
    if(err) return;
    console.log(msg);
  });*/

  // Clear the code for the first time
  if (time == 1) {
    editor.setValue("");
  }

  // Append dummy strings line by line.
  // Add "//" characters to make the line green!
  editor.session.insert ({
    row: editor.session.getLength(),
    column: 0
  }, "// "+rString+"\n");

  if (time > Terminal.LINE_NUM) {
    Terminal_stop_timer();
    return 'DONE!!';
  }
  $(".ace_layer").addClass("compile");
};
