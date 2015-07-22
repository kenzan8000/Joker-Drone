var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

/* POST how to fly drone. */
router.post('/', function(req, res) {
    res.send(req.body);
});

module.exports = router;
