/**
 * Created by roper on 2017/9/1.
 */

var $ = require("jquery");
var XTemplate = require('xtemplate');
var leftMenuTemplate = new XTemplate($('#J_left_menu_template').html());

$(document).ready(function () {
  (function ($) {

    function isNull(data) {
      return (data === "" || data === undefined || data === null) ? true : false;
    }

    //跳转到登录页面有两种情况：1、检查本地是否有token  2、token是否过期
    //因为每个页面都会调用这个JS，那么只要统一在这个页面中进行判断即可
    //1、检查本地是否有token
    if (isNull(window.localStorage.myTokenKey)) {
      window.open('/login', '_parent');
    }

    //渲染右侧动态菜单
    $.ajax({
      url: window.localStorage.backSystemUrl + '/getDynamicMenu/by/role',
      headers: {
        Authorization: "Bearer " + window.localStorage.myTokenKey
      },
      method: 'get',
      data: {
        accountRole: window.localStorage.roleKey
      },
      success: function (result) {
        let resultJson = JSON.parse(result);
        //2、token是否过期
        if (resultJson.message === '没有权限访问') {
          window.open('/login', '_self');
          return false;
        }

        let html = leftMenuTemplate.render({menuList: resultJson.object});
        $('.left-nav-ul').html(html);

        //绑定点击事件
        $(".submenu > a").click(function (e) {
          e.preventDefault();
          let $li = $(this).parent("li");
          let $ul = $(this).next("ul");

          if ($li.hasClass("open")) {
            $ul.slideUp(100);
            $li.removeClass("open");
          } else {
            $ul.slideDown(100);
            $li.addClass("open");
          }
        });

        //定位当前菜单位置
        let topMenu = $('input[name="top-menu"]').val();
        let subMenu = $('input[name="sub-menu"]').val();

        let $li = $('.' + topMenu);
        let $ul = $li.find('ul');
        if ($li.hasClass("open")) {
          $ul.slideUp(5);
          $li.removeClass("open");
        } else {
          $ul.slideDown(5);
          $li.addClass("open");
        }

        if (subMenu) {
          $('.' + subMenu).addClass("current");
        } else {
          $('.' + topMenu).addClass("current");
        }


      },
      error: function (error) {
        $('.left-nav-ul').html({});
      }
    });

    $('.go-back').on('click', function () {
      $('.modal').modal('hide');
    });

    //初始化吊顶的相关数据
    $('.top-nav-title').text('国家医疗器械监测平台 (' + window.localStorage.orgNameKey + ')');
    $('.login-user-name').text(window.localStorage.fullNameKey);

  })(jQuery);
});
