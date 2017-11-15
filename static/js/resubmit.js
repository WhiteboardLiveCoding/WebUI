// Code for the resubmission button

var resubmitCode = function resubmit() {
  $.ajax({
    url: '/resubmit',
    data: JSON.stringify({"code": cm.getValue(), "key": localStorage.getItem("key")}),
    processData: false,
    contentType: 'application/json',
    type: 'POST',
    success: function (response) {
      var json = $.parseJSON(response);
      $('#result-area').val(json.result);
      $('#error-area').val(json.error);

      // Drawing stuff
      var canvas = document.getElementById("submitted_canvas");
      var context = canvas.getContext("2d");
      drawbackground(canvas, context, drawRest, json);
    }
  });
};

$("#upload-code").bind("click", resubmitCode);
