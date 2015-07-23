/**************************************************
 *            JokerDrone                          *
 **************************************************/
function JokerDrone() {
};

/// Member

/**
 * takeoff
 **/
JokerDrone.prototype.takeoff = function () {
    g_commands.push({takeoff: ""});
};

/**
 * land
 **/
JokerDrone.prototype.land = function() {
    g_commands.push({land: ""});
}

/**
 * go
 * @param position position from the start point ex) {x: -1.0, y: 1.0, z: 1.5}
 **/
JokerDrone.prototype.go = function(position) {
    g_commands.push({go: position});
}


/**************************************************
 *            Terminal                          *
 **************************************************/
function Terminal(completionHandler) {
    this.time = 0;
    this.timerID = 0;
    this.completionHandler = completionHandler;
};

/// Member

// Constant
// ref: http://qiita.com/yutori_enginner/items/98ecaae8945e3c17efa2
Terminal.prototype.INTERVAL = 15;  // Interval to call the function[ms] (呼び出す間隔).
Terminal.prototype.LINE_NUM = 100; // The number of iteration to append lines (行を追加する回数).
Terminal.prototype.BACKGROUND_COLOR = '#232323'; // The background color of the editor (used to hide page number divs).

Terminal.prototype.time;
Terminal.prototype.timerID;
Terminal.prototype.completionHandler;

/**
 *
 **/
Terminal.prototype.transition = function(editor) {
    this.start_timer();
};

/**
 * Create a random string
 * @param length random string's length
 * @param chars character list for random character
 * @return random string
 **/
Terminal.prototype.random_string = function(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) {
        result += chars[Math.round(Math.random() * (chars.length - 1))];
    }
    return result;
};

/**
 *
 **/
Terminal.prototype.start_timer = function() {
    var self = this;
    this.timerID = setInterval(function() { self.timer() }, self.INTERVAL);
};

/**
 *
 **/
Terminal.prototype.stop_timer = function() {
    clearInterval(this.timerID);
};

/**
 *
 **/
Terminal.prototype.timer = function() {
    this.time = this.time + 1;

    // Create a random string that has 256 characters.
    var rString = this.random_string(256, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
    /*asciify("HelloWorld", {font: 'starwars'}, function(err, msg) {
        if(err) return;
        console.log(msg);
    });*/

    // Clear the code for the first time
    if (this.time == 1) {
        g_editor.setValue("");
    }

    // Append dummy strings line by line.
    // Add "//" characters to make the line green!
    g_editor.session.insert ({
        row: g_editor.session.getLength(),
        column: 0
    }, "// "+rString+"\n");

    if (this.time > this.LINE_NUM) {
        this.stop_timer();
        this.completionHandler();
        $(".ace_layer").removeClass("compile");
        return 'DONE!!';
    }
    $(".ace_layer").addClass("compile");
};


/**************************************************
 *                  Main                          *
 **************************************************/

/// global variable
var g_commands = [];
var g_editor;

$(function(){
    // editor
    g_editor = ace.edit("editor");
    g_editor.getSession().setMode("ace/mode/javascript");
    g_editor.setTheme("ace/theme/vibrant_ink");
    g_editor.$blockScrolling = Infinity
});

function compile() {
    // compile
    g_commands = [];
    var code = g_editor.getSession().getValue();
    eval(code);
    //console.log(g_commands);

    // send commands
    var sendCommands = function() {
        //var json = { "commands" : g_commands };
        $.ajax({
            type: "POST",
             url: "/",
            data: { "commands" : JSON.stringify(g_commands) },//JSON.stringify(json),
        tentType: "application/json; charset=utf-8",
        dataType: "json",
         success: function(data){
             if (data['application_code'] == 200) { alert("Compile Succeeded."); }
             else { alert("Compile Failed."); }
         },
         failure: function(error) { alert("Compile Failed Because " + error); }
        });
    }

    // Insert a transition effect
    var completionHandler = function() { g_editor.setValue(code); sendCommands(); };
    var terminal = new Terminal(completionHandler);
    terminal.transition(window.editor);
}
