/**
 * Created by roper on 2017/9/1.
 */
var $ = require("jquery");
var XTemplate = require('xtemplate');
var schemeTemplate = new XTemplate($('#J_scheme_tr_template').html());
var paginationTemplate = new XTemplate($('#J_scheme_pagination_template').html());
var schemeAddTemplate = new XTemplate($('#J_scheme_add_template').html());
var schemeLookTemplate = new XTemplate($('#J_scheme_look_template').html());
var deleteModalTemplate = new XTemplate($('#J_delete_one_template').html());
var sampleModalTemplate = new XTemplate($('#J_sample_modal_template').html());


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
    schemeTemplate.addCommand('formatDate', function (scope, option) {
      Date.prototype.toLocaleString = function () {
        return this.getFullYear() + "-" + (("0" + (this.getMonth() + 1))).slice(-2) + "-" + ("0" + this.getDate()).slice(-2);
      };
      let unixTimestamp = new Date(option.params[0]);
      return unixTimestamp.toLocaleString();
    });
    schemeTemplate.addCommand('chineseYN', function (scope, option) {
      return option.params[0] === 'Y' ? '有' : '无';
    });
    schemeTemplate.addCommand('formatOrgName', function (scope, option) {
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
    renderSchemeTable(null, 'ALL', 'ALL', 0, pageSize, 1);

    //为新增评估方案绑定点击事件
    $('.add-button').on('click', function (event) {
      var event = event || window.event;
      event.preventDefault(); // 兼容标准浏览器
      event.stopPropagation();
      // window.event.returnValue = false; // 兼容IE6~8

      $('.scheme-add-modal-container').html(schemeAddTemplate.render({}));
      $('#J_scheme_add_modal').modal({backdrop: 'static', keyboard: false});

      //为保存按钮绑定点击事件
      $('.save-add-scheme-button').on('click', function () {
        //首先进行判空
        let name = $('#J_add_scheme_name').val(); //方案名
        let equipmentCategory = $('.add-equipment-category-select').val();//器械类别
        let extraInfo = $('#J_add_scheme_info').val();//方案说明
        let totalGrade = $('#J_add_scheme_total_grade').val();//总分值

        if (isNull(name) || isNull(equipmentCategory) || isNull(extraInfo) || isNull(totalGrade)) {
          alert('下面所有信息均为必填项，请填写完整之后，再保存！');
          return false;
        }

        //判断表格中的所有项是否填写完整
        let ruleGradeJSON = [];
        if (checkTableNull()) {
          alert('下面所有信息均为必填项，请填写完整之后，再保存！');
          return false;
        } else {
          //获取表格中的评分项数据
          // [{itemName:'评分项1',itemInfo:'评分项1说明',itemRuleGrade:12,itemHandGrade:'可为空'},{},{},...]
          let $trList = $('.add-scheme-container').find('tbody tr');
          $trList.each(function (index, element) {
            let item = {};
            let itemName = $(this).find('.add-table-scheme-name').val();
            let itemRuleGrade = $(this).find('.add-table-scheme-grade').val();
            let itemInfo = $(this).find('.add-table-scheme-info').val();
            item.itemName = itemName;
            item.itemRuleGrade = itemRuleGrade;
            item.itemInfo = itemInfo;
            ruleGradeJSON.push(item);
          });
        }

        $('.save-add-scheme-button').css("pointer-events", "none");
        $.ajax({
          url: window.localStorage.backSystemUrl + '/insert/quality/evaluate/scheme/title',
          headers: {
            Authorization: "Bearer " + window.localStorage.myTokenKey
          },
          method: 'get',
          data: {
            name: name,
            equipmentCategory: equipmentCategory,
            totalGrade: totalGrade,
            schemeMaker: window.localStorage.fullNameKey,
            ruleGradeJSON: JSON.stringify(ruleGradeJSON),
            extraInfo: extraInfo
          },
          success: function (result) {
            //渲染表格
            let resultJson = JSON.parse(result);
            if (resultJson.successful && resultJson.object) {
              toastr.success('保存成功！');
              $('#J_scheme_add_modal').modal('hide');
              //刷新表格
              renderSchemeTable(null, 'ALL', 'ALL', 0, pageSize, 1);
            } else {
              toastr.error('保存失败，请重试！');
            }
            $('.save-add-scheme-button').css("pointer-events", "auto");
          },
          error: function (error) {
            $('#J_network_modal').modal('show');
            $('.save-add-scheme-button').css("pointer-events", "auto");
          }
        });

      });

      //为取消按钮绑定点击事件
      $('.cancel-button').on('click', function () {
        $('#J_scheme_add_modal').modal('hide');
      });

      return false;
    });

    //校检评分项Table中师傅填写完整
    function checkTableNull() {
      let $trList = $('.add-scheme-container').find('tbody tr');
      $trList.each(function (index, element) {
        let itemName = $(this).find('.add-table-scheme-name').val();
        let itemRuleGrade = $(this).find('.add-table-scheme-grade').val();
        let itemInfo = $(this).find('.add-table-scheme-info').val();
        if (isNull(itemName) || isNull(itemRuleGrade) || isNull(itemInfo)) {
          return false;
        } else {
          return true;
        }
      });
    }


    //为查询绑定点击事件
    $('.submit-button').on('click', function (event) {
      var event = event || window.event;
      event.preventDefault(); // 兼容标准浏览器
      event.stopPropagation();
      // window.event.returnValue = false; // 兼容IE6~8

      let schemeName = $('#J_scheme').val();
      let samplingStatus = $("input[name='hasSampling']:checked").val();
      let equipmentCategory = $('.equipment-category-select').val();

      renderSchemeTable(schemeName, samplingStatus, equipmentCategory, 0, pageSize, 1);
      return false;
    });

    //渲染列表
    function renderSchemeTable(schemeName, samplingStatus, equipmentCategory, pageStart, pageSize, currentPage) {
      $.ajax({
        url: window.localStorage.backSystemUrl + '/query/quality/evaluate/scheme/by/conditions',
        headers: {
          Authorization: "Bearer " + window.localStorage.myTokenKey
        },
        method: 'get',
        data: {
          schemeName: schemeName,
          samplingStatus: samplingStatus,
          equipmentCategory: equipmentCategory,
          pageStart: pageStart,
          pageSize: pageSize
        },
        success: function (result) {
          //渲染表格
          let resultJson = JSON.parse(result);
          let html = schemeTemplate.render({schemeList: resultJson.object.qualitySchemeTitle});
          $('.scheme-tbody').html(html);

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
            renderSchemeTable(schemeName, samplingStatus, equipmentCategory, ($(this).text() - 1) * pageSize, pageSize, parseInt($(this).text()));
            return false;
          });
          $('.pagination-left').on('click', function (event) {
            event.stopPropagation();
            if (currentPage > 1) {
              renderSchemeTable(schemeName, samplingStatus, equipmentCategory, (currentPage - 2) * pageSize, pageSize, parseInt(currentPage - 1));
            }
            return false;
          });
          $('.pagination-right').on('click', function (event) {
            event.stopPropagation();
            if (currentPage < totalPage) {
              renderSchemeTable(schemeName, samplingStatus, equipmentCategory, currentPage * pageSize, pageSize, parseInt(currentPage + 1));
            }
            return false;
          });

          //为评估按钮绑定点击事件
          $('.scheme-evaluate-href').on('click', function () {
            let $tr = $(this).parent().parent();
            window.open('/quality/report/list?schemeName=' + $tr.data('name') + '&schemeId=' + $tr.data('id'), '_self');
          });

          //为抽样按钮添加点击事件
          $('.scheme-sampling-href').on('click', function () {
            let $tr = $(this).parent().parent();
            let html = sampleModalTemplate.render({
              name: $tr.data('name'),
              schemeId: $tr.data('id'),
              equipmentCategory: $tr.data('equipmentcategory')
            });
            $('.sample-modal-container').html(html);
            $('#J_sample_modal').modal({backdrop: 'static', keyboard: false});

            //初始化时间选择器
            $('#J_begin_date,#J_end_date').datepicker({
              todayBtn: "linked",
              language: "zh-CN",
              orientation: "bottom auto",
              autoclose: true
            });

            //初始化selects控件-监测机构-这里只获取市级监测机构，其他的机构不获取
            $.ajax({
              url: window.localStorage.backSystemUrl + '/get/all/city/org/list/for/select2',
              headers: {
                Authorization: "Bearer " + window.localStorage.myTokenKey
              },
              method: 'get',
              data: {},
              success: function (result) {
                let resultJson = JSON.parse(result);
                $('#J_org').select2({
                  data: resultJson.object,
                  placeholder: '',
                }).val(["-1"]).trigger("change");//全部
              }
            });

            //为执行抽样按钮绑定点击事件
            $('.do-sample-button').on('click', function () {
              let id = $(this).data('schemeid');
              let equipmentCategory = $(this).data('equipmentcategory');

              let orgRange = $('#J_org').val();//全部：-1 ，否则为ID
              let hasAccident = $("input[name='ruleHasAccident']:checked").val();
              let sampleCountMin = $('#J_sample_rule_count_min').val();
              let sampleCountMax = $('#J_sample_rule_count_max').val();
              let sampleRangeOrgName = $('#select2-J_org-container').text(); //检测机构名称

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

              //判空：报告日期可以全部为空，不用判断
              if (isNull(orgRange) || isNull(hasAccident) || isNull(sampleCountMin) || isNull(sampleCountMax)) {
                alert('请将所有必填项填写完整之后，再执行抽样！');
                return false;
              }

              //执行抽样动作
              $(this).css("pointer-events", "none");
              $(this).text('抽样中，请等待...');

              $.ajax({
                url: window.localStorage.backSystemUrl + '/do/sample/action',
                headers: {
                  Authorization: "Bearer " + window.localStorage.myTokenKey
                },
                method: 'get',
                data: {
                  id: id,
                  equipmentCategory: equipmentCategory,
                  orgRange: orgRange,
                  startDate: startDate,
                  endDate: endDate,
                  hasAccident: hasAccident,
                  sampleCount: sampleCountMax,
                  sampleRangeOrgName: sampleRangeOrgName,
                  samplingMaker: window.localStorage.fullNameKey,
                },
                success: function (result) {
                  //渲染表格
                  let resultJson = JSON.parse(result);
                  if (resultJson.successful && resultJson.object > 0) {
                    if (resultJson.object >= sampleCountMin && resultJson.object <= sampleCountMax) {
                      toastr.success('抽样成功！共抽取到【' + resultJson.object + '份】满足条件的报告');
                      $('#J_sample_modal').modal('hide');
                      renderSchemeTable(schemeName, samplingStatus, equipmentCategory, pageStart, pageSize, currentPage);
                    } else {
                      toastr.error('只抽取到【' + resultJson.object + '份】满足条件的报告，请修改样本数量范围，重新抽样！');
                      $('.do-sample-button').text('执行抽样');
                    }

                  } else if (resultJson.successful && resultJson.object === 0) {
                    toastr.error('没有符合条件的报告，请更改抽样规则，重新抽样！');
                    $('.do-sample-button').text('执行抽样');
                  } else {
                    toastr.error('抽样失败，请重试！');
                    $('.do-sample-button').text('执行抽样');
                  }
                  $('.do-sample-button').css("pointer-events", "auto");
                },
                error: function (error) {
                  $('#J_sample_modal').modal('hide');
                  $('#J_network_modal').modal('show');
                  $(".do-sample-button").css("pointer-events", "auto");
                }
              });

            });

          });


          //为删除按钮绑定点击事件:注意删除某个质量评估方案之后，这个评估方案之前的抽样样本表的质量评估状态应该重新置为未评估
          $('.scheme-delete-href').on('click', function () {
            let id = $(this).parent().parent().data('id');
            let html = deleteModalTemplate.render({});
            $('.delete-one-modal-container').html(html);
            $('#J_delete_one_modal').modal({backdrop: 'static', keyboard: false});
            //删除确定按钮
            $('.delete-ok-button').on('click', function () {
              $.ajax({
                url: window.localStorage.backSystemUrl + '/delete/quality/evaluate/scheme/title',
                headers: {
                  Authorization: "Bearer " + window.localStorage.myTokenKey
                },
                method: 'get',
                data: {
                  id: id
                },
                success: function (result) {
                  //渲染表格
                  let resultJson = JSON.parse(result);
                  if (resultJson.successful && resultJson.object) {
                    toastr.success('删除成功！');
                    renderSchemeTable(schemeName, samplingStatus, equipmentCategory, pageStart, pageSize, currentPage);
                  } else {
                    toastr.error('删除失败，请重试！');
                  }
                  $('#J_delete_one_modal').modal('hide');
                },
                error: function (error) {
                  $('#J_delete_one_modal').modal('hide');
                  $('#J_network_modal').modal('show');
                }
              });
            });
          });

          //为查看按钮添加点击事件
          $('.scheme-look-href').on('click', function () {
            let id = $(this).parent().parent().data('id');
            $.ajax({
              url: window.localStorage.backSystemUrl + '/get/quality/evaluate/scheme/title',
              headers: {
                Authorization: "Bearer " + window.localStorage.myTokenKey
              },
              method: 'get',
              data: {
                id: id
              },
              success: function (result) {
                //渲染表格
                let resultJson = JSON.parse(result);
                if (resultJson.successful && resultJson.object) {
                  resultJson.object.ruleGradeJSON = JSON.parse(resultJson.object.ruleGradeJSON);
                  $('.scheme-look-modal-container').html(schemeLookTemplate.render(resultJson.object));
                  $('#J_scheme_look_modal').modal({backdrop: 'static', keyboard: false});
                  //关闭按钮绑定点击事件
                  $('.look-cancel-scheme-button').on('click', function () {
                    $('#J_scheme_look_modal').modal('hide');
                  });
                } else {
                  toastr.error('服务器异常，请重试！');
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
