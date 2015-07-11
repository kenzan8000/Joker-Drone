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
    transition(window.editor);
}


// ref: http://qiita.com/yutori_enginner/items/98ecaae8945e3c17efa2
var INTERVAL = 15;  // Interval to call the function[ms] (呼び出す間隔).
var LINE_NUM = 100; // The number of iteration to append lines (行を追加する回数).
var BACKGROUND_COLOR = '#232323'; // The background color of the editor (used to hide page number divs).
var StartTimer, StopTimer, Timer, time, timerID;
time = 0;
timerID = 0;
function transition(editor) {
    // Change the style of page number divs
    //#232323
    //$cells = $('.ace_gutter_cell');
    //console.log($cells);
    //$('.ace_gutter-cell').css('color', BACKGROUND_COLOR);
    // Modify CSS style directly from JS
    /*document.styleSheets[0].cssRules[0].cssText = "\
      .ace_gutter-cell {
        color: #232323;
      }";*/
    console.log(document.styleSheets[0].cssRules);

    /*var pageDiv = getCSSRule('.ace_gutter-cell');
    killCSSRule(pageDiv);
    var newPageDiv = addCSSRule('.ace_gutter-cell');
    newPageDiv.style.color = '#232323';*/

    var sheet= document.styleSheets[0];
    var rules= 'cssRules' in sheet? sheet.cssRules : sheet.rules;
    console.log(rules);

    //$(".ace_gutter-cell").last().after("<div class='myClass'>Now!</div>");
    $("body").addClass("ace_gutter-cell-update");
    StartTimer();
}

// Create a random string
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}

// Definition of timer functions
StartTimer = function() {
  timerID = setInterval(Timer, INTERVAL);
};
StopTimer = function() {
  clearInterval(timerID);
};
Timer = function() {
  time = time + 1;
  //console.log(time);

  // Create a random string that has 256 characters.
  var rString = randomString(256, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
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

  if (time > LINE_NUM) {
    StopTimer();
    //$(".ace_layer").removeClass("compile");
    return 'DONE!!';
  }
  $(".ace_layer").addClass("compile");
};
