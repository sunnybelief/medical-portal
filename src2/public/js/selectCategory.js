/**
 * Created by roper on 2017/9/1.
 */
var $ = require("jquery");
var XTemplate = require('xtemplate');
var equipmentCategoryTemplate = new XTemplate($('#J_select_equipment_template').html());

$(document).ready(function () {
  (function ($) {
    //渲染需要选择的医疗器械分类
    $.ajax({
      url: window.localStorage.backSystemUrl + '/get/all/equipmentCategory',
      headers: {
        Authorization: "Bearer " + window.localStorage.myTokenKey
      },
      method: 'get',
      data: {},
      success: function (result) {
        let resultJson = JSON.parse(result);
        let html = equipmentCategoryTemplate.render({categoryList: resultJson.object});
        $('.select-equipment-html').html(html);


        //绑定点击事件
        $('.select-equipment-container').on('click', function () {
          var categoryId = $(this).data('categoryid');
          var categoryName = $(this).find('.category-title').text();
          $('#J_accident_modal').modal('show');

          $('.go-into-fill').on('click', function () {
            if (categoryId === 1) {
              window.open('/report/fill/DSA/observe/report?categoryId=' + categoryId + '&isAccident=' + $("input[name='isAccident']:checked").val() + '&categoryName=' + categoryName, '_self');
            }
          });

        });

      },
      error: function (error) {
        $('.select-equipment-html').html({});
      }
    });
  })(jQuery);
});
