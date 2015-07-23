var express = require('express');
var router = express.Router();
var autonomy = require('ardrone-autonomy');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* POST how to fly drone. */
router.post('/', function(req, res) {
    // commands
    var commands = null;
    if (req.body.commands) { commands = req.body.commands; }
    if (commands === null) { res.send({ 'application_code' : 400 }); return; }
    commands = eval(commands);
    if (commands === null) { res.send({ 'application_code' : 400 }); return; }

    // parse commands
    var code = "mission";
    var willLand = false;
    for (var i = 0; i < commands.length; i++) {
        var command = commands[i];
        console.log(command);
        if (command.takeoff) { code += '.takeoff().hover(1000)' }
        else if (commands.land) { code += '.hover(1000).land()'; willLand = true; }
        else if (command.go) {
            var direction = {};
            if (command.go.x !== undefined) { direction.x = command.go.x; }
            if (command.go.y !== undefined) { direction.y = command.go.y; }
            if (command.go.z !== undefined) { direction.z = command.go.z; }
            code += '.go(' + JSON.stringify(direction) + ')';
        }
    }
    if (!willLand) { code += '.hover(1000).land()'; }

    // execute code
    var mission = autonomy.createMission();
    console.log(code);
    eval(code);
    mission.run(function (err, result) {
        if (err) {
            mission.client().stop();
            mission.client().land();
        }
        else { mission.client().land(); }
    });

    res.send({ 'application_code' : 200 });
});

module.exports = router;
