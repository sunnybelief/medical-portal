var express = require('express');

var router = express.Router();
var qualityService = require('../service/qualityService');

//质量评估路由文件
router.get('/doEvaluate', qualityService.renderQualitySearchPage);
router.get('/report/list', qualityService.renderQualityReportListPage);
router.get('/submit/quality/result/page', qualityService.renderSubmitQualityResult);

module.exports = router;
