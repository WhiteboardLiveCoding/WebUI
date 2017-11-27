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
