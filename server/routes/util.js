var express = require('express');

var router = express.Router();
var utilService = require('../service/utilService');

router.get('/ajax/getLeftMenuData', utilService.getLeftMenuData);

module.exports = router;
