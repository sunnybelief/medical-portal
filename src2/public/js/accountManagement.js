/**
 * Created by roper on 2017/9/1.
 */
var $ = require("jquery");
var XTemplate = require('xtemplate');
var accountItemTemplate = new XTemplate($('#J_account_tr_template').html());
var accountPaginationTemplate = new XTemplate($('#J_account_pagination_template').html());
var accountLookTemplate = new XTemplate($('#J_account_look_template').html());
var accountModifyTemplate = new XTemplate($('#J_account_modify_template').html());

var pageSize = 15;

$(document).ready(function () {

  (function ($) {
    initSelect2();
    $('input:radio[name="org-level"]').change(function () {
      initSelect2();
    });

    //初始化Select2控件
    function initSelect2() {
      $("#J_org_select").prop("disabled", false);//启用
      $("#J_org_select").val(null).trigger("change");
      var orgLevel = $("input[name='org-level']:checked").val();
      if (orgLevel === 'SELF') {
        var data_ = [{id: window.localStorage.orgIdKey, text: window.localStorage.orgNameKey}];
        $('#J_org_select').select2({data: data_}).val([window.localStorage.orgIdKey]).trigger("change");
        $("#J_org_select").prop("disabled", true);//禁用
      } else {
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
                  orgLevel: orgLevel
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
      }
    }

    //列表初始渲染
    var orgId = $('#J_org_select').val(); //单位ID
    var orgLevel = $("input[name='org-level']:checked").val(); //单位级别
    renderAccountTable(orgId, orgLevel, 0, pageSize, 1);

    //进行查询
    $('.search-button').on('click', function (event) {
      event.stopPropagation();
      var orgId = $('#J_org_select').val(); //单位ID
      var orgLevel = $("input[name='org-level']:checked").val(); //单位级别
      renderAccountTable(orgId, orgLevel, 0, pageSize, 1);
      return false;
    });


    //渲染列表
    function renderAccountTable(orgId, orgLevel, pageStart, pageSize, currentPage) {
      $.ajax({
        url: window.localStorage.backSystemUrl + '/query/accounts/info/by/orgId',
        headers: {
          Authorization: "Bearer " + window.localStorage.myTokenKey
        },
        method: 'get',
        data: {
          orgId: orgId,
          orgLevel: orgLevel,
          pageStart: pageStart,
          pageSize: pageSize
        },
        success: function (result) {
          //渲染表格
          let resultJson = JSON.parse(result);
          let html = accountItemTemplate.render({accountList: resultJson.object.accountList});
          $('.account-tbody').html(html);

          //渲染分页
          var totalPage = Math.ceil(resultJson.object.total / pageSize);
          var paginationList = [];
          for (var i = 0; i < totalPage; i++) {
            paginationList[i] = i + 1;
          }
          $('.pagination-container').html(accountPaginationTemplate.render({
            paginationList: paginationList,
            currentPage: parseInt(currentPage)
          }));

          //为分页添加点击事件
          $('.pagination-item-href').on('click', function (event) {
            event.stopPropagation();
            renderAccountTable(orgId, orgLevel, ($(this).text() - 1) * pageSize, pageSize, parseInt($(this).text()));
            return false;
          });
          $('.pagination-left').on('click', function (event) {
            event.stopPropagation();
            if (currentPage > 1) {
              renderAccountTable(orgId, orgLevel, (currentPage - 2) * pageSize, pageSize, parseInt(currentPage - 1));
            }
            return false;
          });
          $('.pagination-right').on('click', function (event) {
            event.stopPropagation();
            if (currentPage < totalPage) {
              renderAccountTable(orgId, orgLevel, currentPage * pageSize, pageSize, parseInt(currentPage + 1));
            }
            return false;
          });

          //为查看添加点击事件
          $('a.td-href.account-look').on('click', function () {
            var $tr = $(this).parent().parent();
            $('.account-look-modal-container').html(accountLookTemplate.render({
                name: $tr.data('name'),
                sex: $tr.data('sex'),
                orgName: $tr.data('orgname'),
                email: $tr.data('email'),
                phoneNumber: $tr.data('phonenumber'),
                address: $tr.data('address'),
                accountRole: $tr.data('accountrole'),
                accountName: $tr.data('accountname'),
                accountKey: $tr.data('accountkey'),
                isActive: $tr.data('active')
              }
            ))
            ;
            $('#J_account_look_modal').modal({backdrop: 'static', keyboard: false});
            $('.ok-button').on('click', function () {
              $('#J_account_look_modal').modal('hide');
            });

          });

          //为停用和启用添加点击事件
          $('a.td-href.account-active').on('click', function () {
            var accountId = $(this).parent().parent().data('id');
            var info = $(this).text();
            var toggle = info === '停用' ? 'N' : 'Y';
            $.ajax({
              url: window.localStorage.backSystemUrl + '/toggle/accounts/active',
              headers: {
                Authorization: "Bearer " + window.localStorage.myTokenKey
              },
              method: 'get',
              data: {
                accountId: accountId,
                toggle: toggle
              },
              success: function (result) {
                let resultJson = JSON.parse(result);
                if (resultJson.successful && resultJson.object) {
                  toastr.info(info + "成功！");
                  renderAccountTable(orgId, orgLevel, pageStart, pageSize, currentPage);
                } else {
                  $('#J_network_modal').modal('show');
                }
              },
              error: function (error) {
                $('#J_network_modal').modal('show');
              }
            });
          });

          //为修改添加点击事件
          $('a.td-href.account-modify').on('click', function () {
            var $tr = $(this).parent().parent();
            var accountId = $tr.data('id');
            $('.account-modify-modal-container').html(accountModifyTemplate.render({
              name: $tr.data('name'),
              sex: $tr.data('sex'),
              orgName: $tr.data('orgname'),
              email: $tr.data('email'),
              phoneNumber: $tr.data('phonenumber'),
              address: $tr.data('address'),
              accountRole: $tr.data('accountrole'),
              accountName: $tr.data('accountname'),
              accountKey: $tr.data('accountkey'),
              isActive: $tr.data('active')
            }));
            $('#J_account_modify_modal').modal({backdrop: 'static', keyboard: false});

            $('.reset-button').on('click', function () {
              $('#J_account_modify_modal').modal('hide');
            });

            $('.submit-button').on('click', function () {
              //进行空校检
              var orgLevel;
              if ($tr.data('orglevel') === '省') {
                orgLevel = 'PROVINCE';
              } else if ($tr.data('orglevel') === '市') {
                orgLevel = 'CITY';
              } else {
                orgLevel = 'HOSPITAL';
              }
              var name = $('#J_name').val(); //姓名
              var sex = $("input[name='sex']:checked").val(); //性别
              var email = $("#J_email").val(); //邮箱
              var phoneNumber = $("#J_phone").val(); //联系电话
              var address = $("#J_address").val(); //联系地址
              var accountRole = 'ROLE_' + orgLevel + "_" + $("input[name='account-level']:checked").val(); //账号类型
              var accountKey = $('#J_account_key').val();

              if (!isNull(name) && !isNull(sex) && !isNull(email) && !isNull(phoneNumber)
                && !isNull(address) && !isNull(accountRole) && !isNull(accountKey)) {
                $.ajax({
                  url: window.localStorage.backSystemUrl + '/modify/accounts/data',
                  headers: {
                    Authorization: "Bearer " + window.localStorage.myTokenKey
                  },
                  method: 'get',
                  data: {
                    accountId: accountId,
                    name: name,
                    sex: sex,
                    email: email,
                    phoneNumber: phoneNumber,
                    address: address,
                    accountRole: accountRole,
                    accountKey: accountKey
                  },
                  success: function (result) {
                    let resultJson = JSON.parse(result);
                    if (resultJson.successful && resultJson.object) {
                      toastr.info("修改成功！");
                      $('#J_account_modify_modal').modal('hide');
                      renderAccountTable(orgId, orgLevel, pageStart, pageSize, currentPage);
                    } else {
                      toastr.error("修改失败！请稍后重试！");
                    }
                  },
                  error: function (error) {
                    $('#J_network_modal').modal('show');
                  }
                });

              } else {
                toastr.error('请将必填项请填写完整，再提交');
              }
            });

          });


        },
        error: function (error) {
          $('#J_network_modal').modal('show');
        }
      });
    }

    function isNull(str) {
      if (str == "") return true;
      var regu = "^[ ]+$";
      var re = new RegExp(regu);
      return re.test(str);
    }

  })(jQuery);
});
