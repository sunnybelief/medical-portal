/**
 * Created by roper on 2017/9/1.
 */
var $ = require("jquery");

$(document).ready(function () {
  (function ($) {

    $('.continue-post').on('click', function () {
      window.open('/report/selectCategory', '_self');
    });

    $('.look-report').on('click', function () {
      window.open('/report/haveSend', '_self');
    });

  })(jQuery);
});
