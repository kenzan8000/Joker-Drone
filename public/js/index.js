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
    g_commands.push({takeoff: "a"});
};

/**
 * land
 **/
JokerDrone.prototype.land = function() {
    g_commands.push({land: "a"});
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
    this.animationCount = 0;
    this.timerID = null;
    this.completionHandler = completionHandler;
};

/// Constant

Terminal.prototype.COMPILE_ANIMATION_STRINGS = [
    ".", ".", ".", ".", ".\n",
];
Terminal.prototype.COMPILE_ANIMATION_INTERVAL = 500;
Terminal.prototype.RANDOM_ANIMATION_INTERVAL = 15;
Terminal.prototype.RANDOM_ANIMATION_COUNT = 100;

/// Member

Terminal.prototype.animationCount;
Terminal.prototype.timerID;
Terminal.prototype.completionHandler;

/**
 * start animation
 **/
Terminal.prototype.startAnimation = function() {
    $(".ace_layer").addClass("compile");

    var self = this;
    this.animateCompile()
        .then(function() { return self.animateRandomString(); })
        .done(function() {
            $(".ace_layer").removeClass("compile");
            self.completionHandler();
        })
        .fail(function () {
            console.log('Rejected!');
            self.completionHandler();
        });
};

/**
 * stop animation
 **/
Terminal.prototype.stopAnimation = function() {
    clearInterval(this.timerID);
};

/**
 * compile animation
 * @return JQuery.Deferred
 **/
Terminal.prototype.animateCompile = function() {
    var deferred = jQuery.Deferred();
    this.animationCount = 0;

    var self = this;
    this.timerID = setInterval(
        function() {
            // finish animation
            if (self.animationCount >= self.COMPILE_ANIMATION_STRINGS.length) {
                self.stopAnimation();
                return deferred.resolve();
            }

            // animation
            var terminalOutput = self.COMPILE_ANIMATION_STRINGS[self.animationCount];
            g_editor.session.insert(
                { row: g_editor.session.getLength(), column: 0 },
                terminalOutput
            );

            self.animationCount++;
        },
        self.COMPILE_ANIMATION_INTERVAL
    );
    return deferred.promise();
}

/**
 * random string animation
 * @return JQuery.Deferred
 **/
Terminal.prototype.animateRandomString = function() {
    var deferred = jQuery.Deferred();
    this.animationCount = 0;

    var self = this;
    this.timerID = setInterval(
        function() {
            // insert random string to terminal
            var terminalOutput = self.randomString(256, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
            g_editor.session.insert(
                { row: g_editor.session.getLength(), column: 0 },
                terminalOutput + "\n"
            );

            // finish animation
            if (self.animationCount > self.RANDOM_ANIMATION_COUNT) {
                self.stopAnimation();
                return deferred.resolve();
            }
            self.animationCount++;
        },
        self.RANDOM_ANIMATION_INTERVAL
    );
    return deferred.promise();
};

/**
 * Create a random string
 * @param length random string's length
 * @param chars character list for random character
 * @return random string
 **/
Terminal.prototype.randomString = function(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) { result += chars[Math.round(Math.random() * (chars.length - 1))]; }
    return result;
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

    // send commands
    var sendCommands = function() {
        $.ajax({
            type: "POST",
             url: "/",
            data: { "commands" : JSON.stringify(g_commands) },
        tentType: "application/json; charset=utf-8",
        dataType: "json",
         success: function(data){
             if (data['application_code'] == 200) { alert("Compile Succeeded."); }
             else { alert("Compile Failed."); }
         },
         failure: function(error) { alert("Compile Failed Because " + error); }
        });
    }

    // start animation
    g_editor.setValue("");
    var completionHandler = function() { g_editor.setValue(code); sendCommands(); };
    var terminal = new Terminal(completionHandler);
    terminal.startAnimation(window.editor);
}
