var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('Try this instead: <a href="stories">Stories</a>.');
});

module.exports = router;
