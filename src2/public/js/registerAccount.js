/**
 * Created by roper on 2017/9/1.
 */
var $ = require("jquery");
var XTemplate = require('xtemplate');
var successModalTemplate = new XTemplate($('#J_success_modal_template').html());

$(document).ready(function () {

  (function ($) {
    initSelect2();
    $('input:radio[name="org-level"]').change(function () {
      initSelect2();
    });

    //初始化Select2控件
    function initSelect2() {
      $("#J_self_org_select").prop("disabled", false);//启用
      $("#J_self_org_select").val(null).trigger("change");
      var orgLevel = $("input[name='org-level']:checked").val();
      if (orgLevel === 'SELF') {
        var data_ = [{id: window.localStorage.orgIdKey, text: window.localStorage.orgNameKey}];
        $('#J_self_org_select').select2({data: data_}).val([window.localStorage.orgIdKey]).trigger("change");
        $("#J_self_org_select").prop("disabled", true);//禁用
      } else {
        $('#J_self_org_select').select2({
            ajax: {
              url: window.localStorage.backSystemUrl + "/get/all/organization",
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
            }
          }
        );
      }
    }

    $('.go-back-modify').on('click', function () {
      $('.modal').modal('hide');
    });

    //清空重填
    $(".reset-button").on('click', function (event) {
      event.stopPropagation();
      location.reload();
    });

    //提交校检
    $(".submit-button").on('click', function (event) {
      event.stopPropagation();
      var orgLevel = $("input[name='org-level']:checked").val(); //单位级别
      var accountLevel = $("input[name='account-level']:checked").val(); //账号类型
      var orgId = $('#J_self_org_select').val(); //所在单位
      var name = $('#J_name').val(); //姓名
      var sex = $("input[name='sex']:checked").val(); //性别
      var email = $("#J_email").val(); //邮箱
      var phoneNumber = $("#J_phone").val(); //联系电话
      var address = $("#J_address").val(); //联系地址
      var register = "admin"; //注册人
      if (!isNull(orgLevel) && !isNull(accountLevel) && !isNull(orgId) && !isNull(name)
        && !isNull(sex) && !isNull(email) && !isNull(phoneNumber) && !isNull(address)) {
        $.ajax({
          url: window.localStorage.backSystemUrl + '/account/register',
          headers: {
            Authorization: "Bearer " + window.localStorage.myTokenKey
          },
          method: 'get',
          data: {
            register: register,
            accountRole: orgLevel === 'SELF' ? "ROLE_PROVINCE_" + accountLevel : "ROLE_" + orgLevel + "_" + accountLevel,
            orgId: orgId,
            name: name,
            sex: sex,
            email: email,
            phoneNumber: phoneNumber,
            address: address
          },
          success: function (result) {
            let resultJson = JSON.parse(result);
            //注册成功
            if (resultJson.successful && resultJson.object) {
              let html = successModalTemplate.render({
                  accountLevel: accountLevel === 'ADMIN' ? '管理员账号' : '普通账号',
                  orgName: $('#select2-J_self_org_select-container').text(),
                  name: name,
                  phoneNumber: phoneNumber,
                  accountName: email,
                  accountKey: email
                })
              ;
              $('.success-modal-container').html(html);
              $('#J_success_modal').modal({backdrop: 'static', keyboard: false});
              $('.register-success-button').on('click', function () {
                location.reload();
              });
            }
            //邮箱已经被注册了
            if (resultJson.successful && !resultJson.object) {
              $('#J_already_modal').modal('show');
            }
            //注册失败
            if (!resultJson.successful) {
              $('#J_network_modal').modal('show');
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

    function isNull(str) {
      if (str == "") return true;
      var regu = "^[ ]+$";
      var re = new RegExp(regu);
      return re.test(str);
    }
  })(jQuery);
});
