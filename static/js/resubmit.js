// Code for the resubmission button

var resubmitCode = function resubmit() {
  var e = document.getElementById("language");
  var language = e.options[e.selectedIndex].value;
  var template = $("#template-id").val();

  var url = '/resubmit?language=' + language;

  if (template.length > 0) {
    url = url + '&template=' + template;
  }

  $.LoadingOverlay("show");
  $.ajax({
    url: url,
    data: JSON.stringify({"code": cm.getValue(), "key": localStorage.getItem("key")}),
    processData: false,
    contentType: 'application/json',
    type: 'POST',
    success: function (response) {
      var json = $.parseJSON(response);

      populate_result_area(json);
      populate_error_area(json);

      set_proj_orig_bbox(json.ar);

      $.LoadingOverlay("hide");

      // Drawing stuff
      var canvas = document.getElementById("submitted_canvas");
      var context = canvas.getContext("2d");
      drawbackground(canvas, context, drawRest, json, canvas.toDataURL('image/png', 0.5));
    }
  });
};

$("#upload-code").bind("click", resubmitCode);
