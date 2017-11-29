$("#file-form").submit(function (event) {
  var blob = document.getElementById('file-input').files[0];
  var fd = new FormData();
  fd.append("file", blob);
  submit_image(fd);
  event.preventDefault();
});

function submit_image(df) {
  var e = document.getElementById("language");
  var language = e.options[e.selectedIndex].value;
  $.ajax({
    url: '/?language=' + language,
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
  errorArea.empty()

  $.each(json.errors, function(k, v) {
    errorArea.append(v['type'] + ' (' + v['symbol'] + ') at line ' + v['line'] + ' column ' + v['column'] + '\n');
  });
}

function render_code(response) {
  $('#submission-window').hide();

  // Fill correct elements with response
  var json = $.parseJSON(response);
  $('#result-area').val(json.result);

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

  // Drawing stuff
  var canvas = document.getElementById("submitted_canvas");
  var context = canvas.getContext("2d");
  drawbackground(canvas, context, drawRest, json);
  $.LoadingOverlay("hide");
}
