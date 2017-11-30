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
      var resultValue = 'STDOUT\n' + json.result + '\n\n';

      if (json.testResults.length > 0) {
        var testResults = [];
        for(var i in json.testResults) {
            var testCounter = parseInt(i) + 1;
            if(json.testResults[i].passed) {
                testResults.push('\tTest ' + testCounter + ': Passed\n');
            } else {
                testResults.push('\tTest ' + testCounter + ': Failed (Hint: ' + json.testResults[i].hint + ')\n');
            }
        }

        resultValue = resultValue + 'Tests:\n' + testResults.join('') + '\n\n';
      }

      $('#result-area').val(resultValue);

      populate_error_area(json);

      set_proj_orig_bbox(json.ar);

      // Drawing stuff
      var canvas = document.getElementById("submitted_canvas");
      var context = canvas.getContext("2d");
      drawbackground(canvas, context, drawRest, json);
      $.LoadingOverlay("hide");
    }
  });
};

$("#upload-code").bind("click", resubmitCode);
