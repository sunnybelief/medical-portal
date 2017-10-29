/**
 * Created by roper on 2017/9/1.
 */
var $ = require("jquery");
var XTemplate = require('xtemplate');
var tempReportTemplate = new XTemplate($('#J_report_tr_template').html());
var paginationTemplate = new XTemplate($('#J_report_pagination_template').html());
var deleteModalTemplate = new XTemplate($('#J_delete_one_template').html());

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
    tempReportTemplate.addCommand('formatDate', function (scope, option) {
      Date.prototype.toLocaleString = function () {
        return this.getFullYear() + "-" + (("0" + (this.getMonth() + 1))).slice(-2) + "-" + ("0" + this.getDate()).slice(-2);
      };
      let unixTimestamp = new Date(option.params[0]);
      return unixTimestamp.toLocaleString();
    });
    tempReportTemplate.addCommand('chineseYN', function (scope, option) {
      return option.params[0] === 'Y' ? '有' : '无';
    });

    //列表初始化
    renderReportTable("数字减影血管造影机", 'ALL', null, null, null, 0, pageSize, 1);
    //查询按钮
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
      let reportor = $('#J_reportor').val();
      let hasAccident = $("input[name='hasAccident']:checked").val();
      let equipmentCategory = $('.equipment-category-select').val();
      renderReportTable(equipmentCategory, hasAccident, reportor, startDate, endDate, 0, pageSize, 1);
      return false;
    });

    //为删除全部按钮添加点击事件,暂时去掉该功能
    // $('.delete-button').on('click', function (event) {
    //   var event = event || window.event;
    //   event.preventDefault(); // 兼容标准浏览器
    //   event.stopPropagation();
    //   window.event.returnValue = false; // 兼容IE6~8
    //   let html = deleteModalTemplate.render({isDeleteAll: true});
    //   $('.delete-one-modal-container').html(html);
    //   $('#J_delete_one_modal').modal({backdrop: 'static', keyboard: false});
    //   //删除全部确定按钮
    //   $('.delete-ok-button').on('click', function () {
    //     $(this).css("pointer-events", "none");
    //     $.ajax({
    //       url: window.localStorage.backSystemUrl + '/delete/all/DSA/temp/report',
    //       headers: {
    //         Authorization: "Bearer " + window.localStorage.myTokenKey
    //       },
    //       method: 'get',
    //       data: {},
    //       success: function (result) {
    //         $('#J_delete_one_modal').modal('hide');
    //         let resultJson = JSON.parse(result);
    //         if (resultJson.successful && resultJson.object) {
    //           toastr.success('删除成功！');
    //           renderReportTable("数字减影血管造影机", 'ALL', null, null, null, 0, pageSize, 1);
    //         } else {
    //           toastr.success('删除失败，请重试！');
    //         }
    //         $(this).css("pointer-events", "auto");
    //       },
    //       error: function (error) {
    //         $('#J_delete_one_modal').modal('hide');
    //         $('#J_network_modal').modal('show');
    //         $(this).css("pointer-events", "auto");
    //       }
    //     });
    //   });
    //   return false;
    // });


    //渲染列表
    function renderReportTable(equipmentCategory, hasAccident, reportor, startDate, endDate, pageStart, pageSize, currentPage) {

      //因为每种类型的器械报告都是单独的一张表，因此这里需要根据 equipmentCategory 去调不同表的查询接口
      let url = '';
      if (equipmentCategory === "数字减影血管造影机") {
        url = '/query/DSA/observe/temp/report';
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
          hasAccident: hasAccident,
          reportor: reportor,
          startDate: startDate,
          endDate: endDate,
          pageStart: pageStart,
          pageSize: pageSize,
          orgId: window.localStorage.orgIdKey,
          orgLevel: window.localStorage.orgLevelKey
        },
        success: function (result) {
          //渲染表格
          let resultJson = JSON.parse(result);
          let html = tempReportTemplate.render({reportList: resultJson.object.reportList});
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
            renderReportTable(equipmentCategory, hasAccident, reportor, startDate, endDate, ($(this).text() - 1) * pageSize, pageSize, parseInt($(this).text()));
            return false;
          });
          $('.pagination-left').on('click', function (event) {
            event.stopPropagation();
            if (currentPage > 1) {
              renderReportTable(equipmentCategory, hasAccident, reportor, startDate, endDate, (currentPage - 2) * pageSize, pageSize, parseInt(currentPage - 1));
            }
            return false;
          });
          $('.pagination-right').on('click', function (event) {
            event.stopPropagation();
            if (currentPage < totalPage) {
              renderReportTable(equipmentCategory, hasAccident, reportor, startDate, endDate, currentPage * pageSize, pageSize, parseInt(currentPage + 1));
            }
            return false;
          });

          //为删除按钮添加点击事件
          $('.report-delete').on('click', function () {
            var observeId = $(this).parent().parent().data('observeid');
            var accidentId = $(this).parent().parent().data('accidentid');
            let html = deleteModalTemplate.render({isDeleteAll: false, observeId: observeId, accidentId: accidentId});
            $('.delete-one-modal-container').html(html);
            $('#J_delete_one_modal').modal({backdrop: 'static', keyboard: false});
            //删除确定按钮
            $('.delete-ok-button').on('click', function () {
              $(this).css("pointer-events", "none");
              $.ajax({
                url: window.localStorage.backSystemUrl + '/delete/DSA/report/by/observeIdAndAccidentId',
                headers: {
                  Authorization: "Bearer " + window.localStorage.myTokenKey
                },
                method: 'get',
                data: {
                  observeId: $(this).data('observeid'),
                  accidentId: $(this).data('accidentid')
                },
                success: function (result) {
                  $('#J_delete_one_modal').modal('hide');
                  let resultJson = JSON.parse(result);
                  if (resultJson.successful && resultJson.object) {
                    toastr.success('删除成功！');
                    renderReportTable(equipmentCategory, hasAccident, reportor, startDate, endDate, pageStart, pageSize, currentPage)
                  } else {
                    toastr.error('删除失败，请重试！');
                  }
                  $(this).css("pointer-events", "auto");
                },
                error: function (error) {
                  $('#J_delete_one_modal').modal('hide');
                  $('#J_network_modal').modal('show');
                  $(this).css("pointer-events", "auto");
                }
              });
            });
          });

          //为继续填写按钮添加点击事件
          $('.report-fill').on('click', function () {
            window.open('/report/fill/DSA/observe/report?observeId=' + $(this).parent().parent().data('observeid')
              + '&accidentId=' + $(this).parent().parent().data('accidentid') + '&isAccident=' + $(this).parent().parent().data('hasaccident'));
          });

        },
        error: function (error) {
          $('#J_network_modal').modal('show');
        }
      });
    }


  })(jQuery);

});
