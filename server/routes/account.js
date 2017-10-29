var express = require('express');

var router = express.Router();
var accountService = require('../service/accountService');

router.get('/register', accountService.renderRegister);
router.get('/management', accountService.renderManagement);
router.get('/self', accountService.renderSelf);

module.exports = router;
