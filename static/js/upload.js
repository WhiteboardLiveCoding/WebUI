$("#file-form").submit(function (event) {
  var blob = document.getElementById('file-input').files[0];
  var fd = new FormData();
  fd.append("file", blob);
  submit_image(fd);
  event.preventDefault();
});

function submit_image(fd) {
  var e = document.getElementById("language");
  var language = e.options[e.selectedIndex].value;
  var template = $("#template-id").val();

  var url = '/?language=' + language;

  if (template.length > 0) {
    url = url + '&template=' + template;
  }

  $.ajax({
    url: url,
    data: fd,
    processData: false,
    contentType: false,
    type: 'POST',
    success: function (response) {
      render_code(response);
    }
  });
  $.LoadingOverlay("show");
}

$("#create-template").click(function (event) {
  var templateBlob = document.getElementById('template-input').files[0];
  var testBlob = document.getElementById('test-input').files[0];
  var fd = new FormData();
  fd.append("templateFile", templateBlob);
  fd.append("testFile", testBlob);

  $.LoadingOverlay("show");
  $.ajax({
    url: '/template',
    data: fd,
    processData: false,
    contentType: false,
    type: 'POST',
    success: function (response) {
        var resp = $.parseJSON(response);
        if (resp.success) {
            $("#template-id").val(resp.id);
        } else {
            console.log(response);
        }
        $.LoadingOverlay("hide");
    }
  });
  event.preventDefault();
});

function dataURItoBlob(dataURI) {
  // convert base64/URLEncoded data component to raw binary data held in a string
  var byteString;
  if (dataURI.split(',')[0].indexOf('base64') >= 0)
    byteString = atob(dataURI.split(',')[1]);
  else
    byteString = unescape(dataURI.split(',')[1]);

  // separate out the mime component
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

  // write the bytes of the string to a typed array
  var ia = new Uint8Array(byteString.length);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ia], {type: mimeString});
}

$("#upload-webcam").bind("click", function () {
  var canvas = document.querySelector('canvas');
  var dataURL = canvas.toDataURL('image/png', 0.5);
  var blob = dataURItoBlob(dataURL);
  var fd = new FormData();
  fd.append("file", blob);
  submit_image(fd);
});

function populate_error_area(json) {
  var errorArea = $('#error-area');
  errorArea.empty();

  $.each(json.errors, function(k, v) {
    errorArea.append('(Line: ' +  v['line'] + ', Column: ' + v['column'] + ') ' + v['type'] + ': ' + v['message'] +  '\n');
  });
}

function render_code(response) {
  $('#submission-window').hide();

  // Fill correct elements with response
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

  cm.setValue(json.fixed);

  setTimeout(function() {
    cm.refresh();
  },100);

  localStorage.setItem("key", json.key);

  // Show codemirror and other elements
  $('#resubmit_window').show();
  $('nav.card').hide();
  $('#back-submit').show();

  set_proj_orig_bbox(json.ar);
  setup_proj_mode();

  // Drawing stuff
  var canvas = document.getElementById("submitted_canvas");
  var context = canvas.getContext("2d");
  drawbackground(canvas, context, drawRest, json);
  $.LoadingOverlay("hide");
}
