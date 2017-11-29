// Code for the resubmission button

var resubmitCode = function resubmit() {
  var e = document.getElementById("language");
  var language = e.options[e.selectedIndex].value;
  $.ajax({
    url: '/resubmit?language=' + language,
    data: JSON.stringify({"code": cm.getValue(), "key": localStorage.getItem("key")}),
    processData: false,
    contentType: 'application/json',
    type: 'POST',
    success: function (response) {
      var json = $.parseJSON(response);
      $('#result-area').val(json.result);
      populate_error_area(json);

      // Drawing stuff
      var canvas = document.getElementById("submitted_canvas");
      var context = canvas.getContext("2d");
      drawbackground(canvas, context, drawRest, json);
    }
  });
};

$("#upload-code").bind("click", resubmitCode);
