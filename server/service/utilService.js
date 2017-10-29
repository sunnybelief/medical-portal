/**
 * Created by roper on 2017/5/19.
 */
var ModelProxy = require('../../lib/modelproxy');

exports.getLeftMenuData = function (req, res, next) {
  var accountRole = req.query.accountRole;
  var dataProxy = new ModelProxy({
    getLeftMenuData: 'get.left.menu.data',
  });
  dataProxy.getLeftMenuData({
    accountRole: accountRole,
  }).done(function (result) {
    res.json(result);
  }).error(function (error) {
    res.json({error});
  });
};

exports.renderHomePage = function (req, res, next) {
  res.render("homePage", {
    topMenu: 'top-home'
  });

};


