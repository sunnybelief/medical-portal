/**
 * Created by roper on 2017/9/1.
 */
var $ = require("jquery");

$(document).ready(function () {
  (function ($) {

    $('.look-report').on('click', function () {
      window.open('/report/look/quality/DSA/report?observeId=' + $(this).data('observeid')
        + '&accidentId=' + $(this).data('accidentid')
        + '&isAccident=' + $(this).data('isaccident')
        + '&schemeId=1&topMenu=top-quality&subMenu=&openType=look', '_self');
    });

  })(jQuery);
});
