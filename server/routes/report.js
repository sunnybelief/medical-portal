var express = require('express');

var router = express.Router();
var reportService = require('../service/reportService');

router.get('/selectCategory', reportService.renderCategory);
router.get('/fill/DSA/observe/report', reportService.renderObserveReport);
router.get('/submit/report/success/result', reportService.renderSubmitSuccess);
router.get('/tempStorage', reportService.renderTempStorage);
router.get('/haveSend', reportService.renderHaveSend);
router.get('/look/DSA/observe/report', reportService.renderLookDSAReport);
router.get('/doReview', reportService.renderReview);
router.get('/submit/evaluate/result/page', reportService.renderSubmitEvaluatePage);
router.get('/look/quality/DSA/report', reportService.renderLookQualityDSAReport);
router.get('/queryLook', reportService.renderAllReportPage);

module.exports = router;
