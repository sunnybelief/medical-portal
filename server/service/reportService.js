/**
 * Created by roper on 2017/5/19.
 */
let ModelProxy = require('../../lib/modelproxy');

exports.renderCategory = function (req, res, next) {
  res.render("selectCategory", {topMenu: "top-report", subMenu: "sub-fill"});
};

exports.renderAllReportPage = function (req, res, next) {
  res.render("allReportsList", {topMenu: "top-look"});
};

exports.renderObserveReport = function (req, res, next) {
  let isAccident = req.query.isAccident;
  let observeId = req.query.observeId;
  let accidentId = req.query.accidentId;
  res.render("fillDSAReport", {
    isAccident: isAccident,
    observeId: observeId,
    accidentId: accidentId,
    topMenu: "top-report",
    subMenu: "sub-fill"
  });
};

exports.renderSubmitSuccess = function (req, res, next) {
  let observeId = req.query.observeId;
  res.render("submitSuccessResult", {
    observeId: observeId,
    topMenu: "top-report",
    subMenu: "sub-fill"
  });
};

exports.renderTempStorage = function (req, res, next) {
  res.render("tempStorageReport", {
    topMenu: "top-report",
    subMenu: "sub-temp"
  });
};

exports.renderHaveSend = function (req, res, next) {
  res.render("haveSendReport", {
    topMenu: "top-report",
    subMenu: "sub-hasReport"
  });
};

exports.renderLookDSAReport = function (req, res, next) {
  let openType = req.query.openType;
  let isAccident = req.query.isAccident;
  let observeId = req.query.observeId;
  let accidentId = req.query.accidentId;
  let topMenu = req.query.topMenu;
  let subMenu = req.query.subMenu;
  res.render("lookDSAReport", {
    openType: openType,
    isAccident: isAccident,
    observeId: observeId,
    accidentId: accidentId,
    topMenu: topMenu,
    subMenu: subMenu
  });
};


exports.renderReview = function (req, res, next) {
  res.render("reviewSearch", {
    topMenu: 'top-review',
  });
};

exports.renderSubmitEvaluatePage = function (req, res, next) {
  res.render("submitEvaluateResult", {
    topMenu: 'top-review',
    observeId: req.query.observeId,
    submitType: req.query.submitType
  });
};

exports.renderLookQualityDSAReport = function (req, res, next) {
  let openType = req.query.openType;
  let isAccident = req.query.isAccident;
  let observeId = req.query.observeId;
  let accidentId = req.query.accidentId;
  let schemeId = req.query.schemeId;
  let topMenu = req.query.topMenu;
  let subMenu = req.query.subMenu;
  res.render("lookQualityDSAReport", {
    openType: openType,
    isAccident: isAccident,
    observeId: observeId,
    accidentId: accidentId,
    schemeId: schemeId,
    topMenu: topMenu,
    subMenu: subMenu
  });
};





