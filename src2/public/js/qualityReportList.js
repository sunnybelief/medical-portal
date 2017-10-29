/**
 * Created by roper on 2017/9/1.
 */
var $ = require("jquery");
var XTemplate = require('xtemplate');
var reportTemplate = new XTemplate($('#J_report_tr_template').html());
var paginationTemplate = new XTemplate($('#J_report_pagination_template').html());
var lockModalTemplate = new XTemplate($('#J_lock_one_template').html());
let haveReviewRefreshModalTemplate = new XTemplate($('#J_have_review_refresh_template').html());
let haveLockRefreshModalTemplate = new XTemplate($('#J_have_lock_refresh_template').html());

var pageSize = 15;


$(document).ready(function () {

  (function ($) {

    let schemeId = $('input[name="schemeId"]').val();
    //为模板添加转化方法
    reportTemplate.addCommand('formatDate', function (scope, option) {
      Date.prototype.toLocaleString = function () {
        return this.getFullYear() + "-" + (("0" + (this.getMonth() + 1))).slice(-2) + "-" + ("0" + this.getDate()).slice(-2);
      };
      let unixTimestamp = new Date(option.params[0]);
      return unixTimestamp.toLocaleString();
    });
    reportTemplate.addCommand('chineseYN', function (scope, option) {
      return option.params[0] === 'Y' ? '有' : '无';
    });
    reportTemplate.addCommand('formatOrgName', function (scope, option) {
      let orgName = option.params[0];
      if (!isNull(orgName)) {
        return orgName.split(/[ ]+/)[1];
      } else {
        return orgName;
      }
    });

    function isNull(data) {
      return (data === "" || data === undefined || data === null) ? true : false;
    }

    //初始化表格
    renderReportTable(schemeId, '未评估', 0, pageSize, 1);

    //为顶部导航标签添加点击事件
    //未评估
    $('.nav-li-1').on('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      $('.nav-pills').find('li').removeClass('active');
      $(this).addClass('active');
      renderReportTable(schemeId, '未评估', 0, pageSize, 1);
    });
    //已评估
    $('.nav-li-2').on('click', function (event) {
      event.preventDefault();
      event.stopPropagation();
      $('.nav-pills').find('li').removeClass('active');
      $(this).addClass('active');
      renderReportTable(schemeId, '已评估', 0, pageSize, 1);
    });

    //渲染列表
    function renderReportTable(schemeId, qualityStatus, pageStart, pageSize, currentPage) {
      $.ajax({
        url: window.localStorage.backSystemUrl + '/query/sample/report/list/by/schemeId',
        headers: {
          Authorization: "Bearer " + window.localStorage.myTokenKey
        },
        method: 'get',
        data: {
          schemeId: schemeId,
          evaluateStatus: qualityStatus,
          pageStart: pageStart,
          pageSize: pageSize
        },
        success: function (result) {
          //渲染表格
          let resultJson = JSON.parse(result);
          let html = reportTemplate.render({
            reportList: resultJson.object.reportList,
            selfId: parseInt(window.localStorage.userIdKey)
          });
          $('.report-tbody').html(html);

          //渲染分页
          var totalPage = Math.ceil(resultJson.object.total / pageSize);
          var paginationList = [];
          for (var i = 0; i < totalPage; i++) {
            paginationList[i] = i + 1;
          }
          $('.pagination-container').html(paginationTemplate.render({
            paginationList: paginationList,
            currentPage: parseInt(currentPage)
          }));

          //为分页添加点击事件
          $('.pagination-item-href').on('click', function (event) {
            event.stopPropagation();
            renderReportTable(schemeId, qualityStatus, ($(this).text() - 1) * pageSize, pageSize, parseInt($(this).text()));
            return false;
          });
          $('.pagination-left').on('click', function (event) {
            event.stopPropagation();
            if (currentPage > 1) {
              renderReportTable(schemeId, qualityStatus, (currentPage - 2) * pageSize, pageSize, parseInt(currentPage - 1));
            }
            return false;
          });
          $('.pagination-right').on('click', function (event) {
            event.stopPropagation();
            if (currentPage < totalPage) {
              renderReportTable(schemeId, qualityStatus, currentPage * pageSize, pageSize, parseInt(currentPage + 1));
            }
            return false;
          });

          //为查看按钮添加点击事件
          $('.report-look').on('click', function () {
            window.open('/report/look/quality/DSA/report?observeId=' + $(this).parent().parent().data('observeid')
              + '&accidentId=' + $(this).parent().parent().data('accidentid') + '&isAccident=' + $(this).parent().parent().data('hasaccident')
              + '&schemeId=' + $('input[name="schemeId"]').val()
              + '&topMenu=top-quality&subMenu=&openType=look');
          });

          //为评估按钮添加点击事件
          $('.report-review').on('click', function () {
            let observeId = $(this).parent().parent().data('observeid');
            let accidentId = $(this).parent().parent().data('accidentid');
            let isAccident = $(this).parent().parent().data('hasaccident');
            //首先需要从后台获取当前的锁定人（为空或者某个用户ID），判断当前报告有没有被人锁定
            $.ajax({
              url: window.localStorage.backSystemUrl + '/get/DSA/report/by/observeId',
              headers: {
                Authorization: "Bearer " + window.localStorage.myTokenKey
              },
              method: 'get',
              data: {
                observeId: observeId
              },
              success: function (result) {
                let resultJson = JSON.parse(result);
                if (resultJson.successful && resultJson.object) {
                  let qualityStatus = resultJson.object.qualityStatus; //质量评估状态
                  let qualityEvaluateId = resultJson.object.qualityEvaluateId;  //质量评估人-锁定人
                  let qualityEvaluateName = resultJson.object.qualityEvaluateName;  //质量评估人-锁定人
                  //如果报告已经被评估过了，则提示刷新页面
                  if (qualityStatus !== '未评估') {
                    let html = haveReviewRefreshModalTemplate.render({});
                    $('.have-review-refresh-modal-container').html(html);
                    $('#J_have_review_refresh').modal({backdrop: 'static', keyboard: false});
                    $('.refresh-ok-button').on('click', function () {
                      window.location.reload();
                    });
                  } else if (qualityEvaluateId && qualityEvaluateId !== parseInt(window.localStorage.userIdKey)) {
                    //如果当前报告已经锁定了，并且锁定人不是自己，那么提示已锁定，刷新页面
                    let html = haveLockRefreshModalTemplate.render({});
                    $('.have-lock-refresh-modal-container').html(html);
                    $('#J_have_lock_refresh').modal({backdrop: 'static', keyboard: false});
                    $('.lock-refresh-ok-button').on('click', function () {
                      window.location.reload();
                    });
                  } else if (qualityEvaluateId && qualityEvaluateId === parseInt(window.localStorage.userIdKey)) {
                    //如果当前报告已经锁定了，并且锁定人是自己，那么直接进入
                    window.open('/report/look/quality/DSA/report?observeId=' + observeId
                      + '&accidentId=' + accidentId + '&isAccident=' + isAccident
                      + '&schemeId=' + $('input[name="schemeId"]').val()
                      + '&topMenu=top-quality&subMenu=&openType=review');
                  } else {
                    //如果还没被锁定，则提示一旦评价则锁定
                    let html = lockModalTemplate.render({
                      observeId: observeId,
                      accidentId: accidentId
                    });
                    $('.lock-one-modal-container').html(html);
                    $('#J_lock_one_modal').modal({backdrop: 'static', keyboard: false});
                    //确定锁定按钮
                    $('.lock-ok-button').on('click', function () {
                      $.ajax({
                        url: window.localStorage.backSystemUrl + '/update/DSA/report/quality/evaluate/info/by/observeId',
                        headers: {
                          Authorization: "Bearer " + window.localStorage.myTokenKey
                        },
                        method: 'get',
                        data: {
                          observeId: $(this).data('observeid'),
                          qualityEvaluateId: parseInt(window.localStorage.userIdKey),  //评估人-锁定人
                          qualityEvaluateName: window.localStorage.fullNameKey //评估人
                        },
                        success: function (result) {
                          $('#J_lock_one_modal').modal('hide');
                          let resultJson = JSON.parse(result);
                          if (resultJson.successful && resultJson.object) {
                            window.open('/report/look/quality/DSA/report?observeId=' + observeId
                              + '&accidentId=' + accidentId + '&isAccident=' + isAccident
                              + '&schemeId=' + $('input[name="schemeId"]').val()
                              + '&topMenu=top-quality&subMenu=&openType=review');
                          } else {
                            toastr.error('服务器异常，请刷新页面重试！');
                          }
                        }
                        ,
                        error: function (error) {
                          $('#J_lock_one_modal').modal('hide');
                          $('#J_network_modal').modal('show');
                        }
                      })
                      ;


                    });
                  }

                }
                else {
                  toastr.error('服务器异常，请刷新页面重试！');
                }
              },
              error: function (error) {
                $('#J_network_modal').modal('show');
              }
            });
          });

        },
        error: function (error) {
          $('#J_network_modal').modal('show');
        }
      });
    }


  })(jQuery);
});
