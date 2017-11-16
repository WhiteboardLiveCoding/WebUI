var file = document.getElementById("file");

file.onchange = function() {
  if(file.files.length > 0) {
    document.getElementById('filename').innerHTML = file.files[0].name;
  }
};

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

    return new Blob([ia], {type:mimeString});
}

$("#upload-webcam").bind("click", function(){
  var canvas=document.querySelector('canvas');
  var dataURL = canvas.toDataURL('image/png', 0.5);
  var blob = dataURItoBlob(dataURL);
  var fd = new FormData();
  fd.append("file", blob);
  $.ajax({
    url: '/',
    data: fd,
    processData: false,
    contentType: false,
    type: 'POST',
    success: function(response) {
      $('#submission-window').hide();

      // Fill correct elements with response
      var json = $.parseJSON(response);
      $('#result-area').val(json.result);
      $('#error-area').val(json.error);
      cm.setValue(json.fixed);

      // Show codemirror and other elements
      $('#resubmit_window').show();

      // Drawing stuff
      var canvas = document.getElementById("submitted_canvas");
      var context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawbackground(canvas, context, drawRest);

      function drawbackground(canvas, context, onload) {
        var imagePaper = new Image();
        imagePaper.onload = function () {
          context.drawImage(imagePaper, 0, 0, canvas.width, canvas.height);
          onload(canvas, context);
        };
        imagePaper.src = "https://alpstore.blob.core.windows.net/pictures/" + json.key;
      }

      function drawRest(canvas, context) {
        drawLine(canvas, context, json.ar.line);
      }

      function drawLine(canvas, context, line) {
        if (line) {
          context.beginPath();
          context.moveTo(line['x'], line['y'] + line['height']);
          context.lineTo(line['x'] + line['width'], line['y'] + line['height']);

          context.lineWidth = 5;
          context.strokeStyle = "red";
          context.stroke();
        }
      }
    }
  });
});
