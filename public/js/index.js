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
    this.animationCount = 0;
    this.timerID = null;
    this.completionHandler = completionHandler;
};

/// Constant

Terminal.prototype.COMPILE_ANIMATION_INTERVAL = 10;
Terminal.prototype.COMPILE_ANIMATION_COUNT_MAX = 100;
Terminal.prototype.POST_COMMANDS_ANIMATION_INTERVAL = 75;

/// Member

Terminal.prototype.animationCount;
Terminal.prototype.timerID;
Terminal.prototype.completionHandler;

/**
 * start animation
 **/
Terminal.prototype.startCompile = function() {
    g_editor.renderer.setShowGutter(false);

    var self = this;
    this.animateWait(100)
        .then(function() { return self.animateCompile(); })
        .then(function() { return self.animateWait(500); })
        .then(function() { return self.postCommands(); })
        .then(function() { return self.animateWait(2000); })
        .done(function() {
            g_editor.renderer.setShowGutter(true);
            g_editor.session.getUndoManager().reset();
            self.completionHandler();
        });
};

/**
 * wait animation
 * @param duration duration to wait
 * @return JQuery.Deferred
 **/
Terminal.prototype.animateWait = function(duration) {
    var deferred = jQuery.Deferred();
    this.animationCount = 0;

    var self = this;
    this.timerID = setInterval(
        function() {
            clearInterval(self.timerID);
            return deferred.resolve();
        },
        duration
    );
    return deferred.promise();
}

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
            // count up
            self.animationCount += Math.round(Math.random()) % 4;
            if (self.animationCount >= self.COMPILE_ANIMATION_COUNT_MAX) {
                self.animationCount = self.COMPILE_ANIMATION_COUNT_MAX;
            }

            // animation
            var terminalOutput = "Compiling ";
                // progress(#)
            var unit = 5;
            var maxProgress = self.COMPILE_ANIMATION_COUNT_MAX / unit;
            var progress = self.animationCount / unit;
            for (var i = 0; i < maxProgress; i++) { terminalOutput += (i <= progress) ? "#" : " "; }
                // progress(percentage)
            var digitNumber = 0;
            var number = self.animationCount;
            while (number/10 >= 1) { digitNumber++;  number /= 10; }
            for (var i = 0; i < 3-digitNumber; i++) { terminalOutput += " "; }
            terminalOutput += self.animationCount + "%";
                //
            g_editor.setValue(terminalOutput);

            // finish animation
            if (self.animationCount >= self.COMPILE_ANIMATION_COUNT_MAX) {
                clearInterval(self.timerID);
                return deferred.resolve();
            }
        },
        self.COMPILE_ANIMATION_INTERVAL
    );

    return deferred.promise();
}

/**
 * POST commands to server
 * @return JQuery.Deferred
 **/
Terminal.prototype.postCommands = function() {
    var deferred = jQuery.Deferred();

    this.animationCount = 0;
    var self = this;
    var progress = g_editor.getSession().getValue() + "\n";

    // animation
    this.timerID = setInterval(
        function() {
            var animations = ["-", "\\", "|", "/"];
            var terminalOutput = progress + "Deploying " + animations[self.animationCount % animations.length];
            g_editor.setValue(terminalOutput);
            self.animationCount++;
        },
        self.POST_COMMANDS_ANIMATION_INTERVAL
    );
    var finishPost = function(succeeded) {
        setTimeout(
            function() {
                clearInterval(self.timerID);
                var output = succeeded ? "Compile succeeded." : "Compile failed.";
                g_editor.setValue(g_editor.getSession().getValue() + "\n" + output);
                return deferred.resolve();
            },
            1000
        );
    };

    // POST
    $.ajax({
        type: "POST",
         url: "/",
        data: { "commands" : JSON.stringify(g_commands) },
    tentType: "application/json; charset=utf-8",
    dataType: "json",
     success: function(data){ return finishPost((data['application_code'] == 200)); },
       error: function(error) { return finishPost(false); },
     timeout: 10000
    });

    return deferred.promise();
}


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

    // start animation
    g_editor.setValue("");
    var completionHandler = function() { g_editor.setValue(code); };
    var terminal = new Terminal(completionHandler);
    terminal.startCompile(window.editor);
}
