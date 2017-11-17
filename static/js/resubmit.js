// Code for the resubmission button

var resubmitCode = function resubmit() {
  $.ajax({
    url: '/resubmit',
    data: JSON.stringify({"code": cm.getValue(), "key": "none"}),
    processData: false,
    contentType: 'application/json',
    type: 'POST',
    success: function (response) {
      var json = $.parseJSON(response);
      $('#result-area').val(json.result);
      $('#error-area').val(json.error);
    }
  });
}

$("#upload-code").bind("click", resubmitCode);
