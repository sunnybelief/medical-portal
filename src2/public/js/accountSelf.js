/**
 * Created by roper on 2017/9/1.
 */
var $ = require("jquery");
var XTemplate = require('xtemplate');
var accountDataTemplate = new XTemplate($('#J_account_look_self_template').html());
var accountModifyTemplate = new XTemplate($('#J_account_modify_template').html());

$(document).ready(function () {
  (function ($) {
    renderAccountInfo();
    function renderAccountInfo() {
      $.ajax({
        url: window.localStorage.backSystemUrl + '/get/accounts/info/by/accountId',
        headers: {
          Authorization: "Bearer " + window.localStorage.myTokenKey
        },
        method: 'get',
        data: {
          accountId: 13
        },
        success: function (result) {
          let resultJson = JSON.parse(result);
          let html = accountDataTemplate.render({data: resultJson.object});
          $('.account-look-self-container').html(html);

          //为修改添加点击事件
          $('a.modify-href').on('click', function () {
            var $tr = $('.personal-look-data');
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
                      renderAccountInfo();
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
