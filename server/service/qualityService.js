/**
 * Created by roper on 2017/5/19.
 */
var ModelProxy = require('../../lib/modelproxy');

exports.renderQualitySearchPage = function (req, res, next) {
  res.render("qualitySearchManagement", {topMenu: "top-quality"});
};

exports.renderQualityReportListPage = function (req, res, next) {
  res.render("qualityReportList", {
    topMenu: "top-quality",
    schemeName: req.query.schemeName,
    schemeId: req.query.schemeId
  });
};

exports.renderSubmitQualityResult = function (req, res, next) {
  res.render("submitQualityResult", {
    observeId: req.query.observeId,
    accidentId: req.query.accidentId,
    isAccident: req.query.isAccident,
    topMenu: "top-quality"
  });
};



