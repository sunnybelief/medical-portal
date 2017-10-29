/**
 * Created by roper on 2017/9/1.
 */
var $ = require("jquery");
var XTemplate = require('xtemplate');
var reportTemplate = new XTemplate($('#J_report_tr_template').html());
var paginationTemplate = new XTemplate($('#J_report_pagination_template').html());

var pageSize = 15;


$(document).ready(function () {

  (function ($) {
    //初始化日期控件
    $('#J_begin_date,#J_end_date').datepicker({
      todayBtn: "linked",
      language: "zh-CN",
      orientation: "bottom auto",
      autoclose: true
    });

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

    //初始化监测单位
    $('#J_org_select').select2({
        ajax: {
          url: window.localStorage.backSystemUrl + "/get/all/organization/with/both",
          headers: {
            Authorization: "Bearer " + window.localStorage.myTokenKey
          },
          dataType: 'json',
          delay: 250,
          data: function (params) {
            return {
              q: params.term,
              orgLevel: 'CITY'
            };
          },
          processResults: function (data) {
            return {
              results: data.object
            };
          },
          cache: true
        },
        escapeMarkup: function (markup) {
          return markup;
        },
        templateResult: function formatRepo(repo) {
          return repo.text
        },
        templateSelection: function formatRepoSelection(repo) {
          return repo.text
        },
        placeholder: '全部',
      }
    );

    //初始化表格
    renderReportTable(null, "数字减影血管造影机", null, null, null, null, null, 'ALL', 0, pageSize, 1);

    //为查询绑定点击事件
    $('.submit-button').on('click', function (event) {
      var event = event || window.event;
      event.preventDefault(); // 兼容标准浏览器
      event.stopPropagation();
      // window.event.returnValue = false; // 兼容IE6~8
      let startDate = $('#J_begin_date').val().replace(/年/g, '/').replace(/月/g, '/').replace(/日/g, '');
      let endDate = $('#J_end_date').val().replace(/年/g, '/').replace(/月/g, '/').replace(/日/g, '');
      if (startDate === '' && endDate !== '') {
        startDate = '1000-09-10';//很早的时间
      }
      if (startDate !== '' && endDate === '') {
        endDate = new Date().toLocaleDateString(); //今天
      }
      if (startDate !== '' && endDate !== '') {
        startDate = new Date(new Date(startDate).getTime() - 24 * 60 * 60 * 1000).toLocaleDateString();  //前一天
        endDate = new Date(new Date(endDate).getTime() + 24 * 60 * 60 * 1000).toLocaleDateString();  //后一天
      }
      let observeId = $('#J_reportId').val();
      let equipmentCategory = $('.equipment-category-select').val();
      let hasAccident = $("input[name='hasAccident']:checked").val();
      let patientName = $('#J_patient').val();
      let reportOrgName = $('#J_report_org').val();
      let cityOrgId = $('#J_org_select').val();

      renderReportTable(cityOrgId, equipmentCategory, reportOrgName, observeId, patientName, startDate, endDate, hasAccident, 0, pageSize, 1);
      return false;
    });

    //渲染列表
    function renderReportTable(cityOrgId, equipmentCategory, reportOrgName, observeId, patientName, startDate, endDate, hasAccident, pageStart, pageSize, currentPage) {

      //因为每种类型的器械报告都是单独的一张表，因此这里需要根据 equipmentCategory 去调不同表的查询接口
      let url = '';
      if (equipmentCategory === "数字减影血管造影机") {
        url = '/query/all/DSA/observe/report/by/conditions';
      } else {
        return false;//其他表的查询接口
      }

      $.ajax({
        url: window.localStorage.backSystemUrl + url,
        headers: {
          Authorization: "Bearer " + window.localStorage.myTokenKey
        },
        method: 'get',
        data: {
          cityOrgId: cityOrgId,
          reportOrgName: reportOrgName,
          patientName: patientName,
          hasAccident: hasAccident,
          observeId: observeId,
          startDate: startDate,
          endDate: endDate,
          pageStart: pageStart,
          pageSize: pageSize,
        },
        success: function (result) {
          //渲染表格
          let resultJson = JSON.parse(result);
          let html = reportTemplate.render({
            reportList: resultJson.object.reportList,
            loginUserId: parseInt(window.localStorage.userIdKey)
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
            renderReportTable(cityOrgId, equipmentCategory, reportOrgName, observeId, patientName, startDate, endDate, hasAccident, ($(this).text() - 1) * pageSize, pageSize, parseInt($(this).text()));
            return false;
          });
          $('.pagination-left').on('click', function (event) {
            event.stopPropagation();
            if (currentPage > 1) {
              renderReportTable(cityOrgId, equipmentCategory, reportOrgName, observeId, patientName, startDate, endDate, hasAccident, (currentPage - 2) * pageSize, pageSize, parseInt(currentPage - 1));
            }
            return false;
          });
          $('.pagination-right').on('click', function (event) {
            event.stopPropagation();
            if (currentPage < totalPage) {
              renderReportTable(cityOrgId, equipmentCategory, reportOrgName, observeId, patientName, startDate, endDate, hasAccident, currentPage * pageSize, pageSize, parseInt(currentPage + 1));
            }
            return false;
          });

          //为查看按钮添加点击事件
          $('.report-look').on('click', function () {
            window.open('/report/look/DSA/observe/report?observeId=' + $(this).parent().parent().data('observeid')
              + '&accidentId=' + $(this).parent().parent().data('accidentid') + '&isAccident=' + $(this).parent().parent().data('hasaccident')
              + '&topMenu=top-look&subMenu=&openType=look');
          });


        },
        error: function (error) {
          $('#J_network_modal').modal('show');
        }
      });
    }


  })(jQuery);
});
