var express = require('express');

var router = express.Router();
var utilService = require('../service/utilService');

router.get('/index', utilService.renderHomePage);

module.exports = router;
