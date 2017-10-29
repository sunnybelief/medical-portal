/**
 * Created by roper on 2017/5/19.
 */
var ModelProxy = require('../../lib/modelproxy');

exports.renderRegister = function (req, res, next) {
  res.render("registerAccount", {topMenu: "top-account", subMenu: "sub-registerAccount"});
};

exports.renderManagement = function (req, res, next) {
  res.render("accountManagement", {topMenu: "top-account", subMenu: "sub-managementAccount"});
};

exports.renderSelf = function (req, res, next) {
  res.render("accountSelf", {topMenu: "top-account", subMenu: "sub-accountSelf"});
};


