// Change file input name and display a picture upon upload

var file = document.getElementById("file-input");

file.onchange = function ( event) {
  document.getElementById('upload-output').src = URL.createObjectURL(event.target.files[0]);
  if (file.files.length > 0) {
    document.getElementById('filename').innerHTML = file.files[0].name;
  }
};

$('#back-submit').click(function() {
  $('#back-submit').hide();
  $('#upload-submission').hide();
  $('#resubmit_window').hide();
  $('nav.card').show();
  $('#upload-webcam').prop("disabled", false);
  $('#submission-window').show();
})

// Switching landing page upload types

$('#switch-webcam').click(function() {
  $('#switch-upload').removeClass('active');
  $('#switch-webcam').addClass('active');
  $('#upload-submission').hide();
  $('#webcam-submission').show()
});

$('#switch-upload').click(function() {
  $('#switch-webcam').removeClass('active');
  $('#switch-upload').addClass('active');
  $('#upload-submission').show();
  $('#webcam-submission').hide()
});
