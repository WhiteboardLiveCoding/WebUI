// Change file input name and display a picture upon upload

var file = document.getElementById("file-input");
var templateFile = document.getElementById("template-input");
var testFile = document.getElementById("test-input");
var templateId = document.getElementById("template-id");

file.onchange = function (event) {
  document.getElementById('upload-output').src = URL.createObjectURL(event.target.files[0]);
  if (file.files.length > 0) {
    document.getElementById('filename').innerHTML = file.files[0].name;
  }
};

templateFile.onchange = function (event) {
  if (templateFile.files.length > 0) {
    document.getElementById('template-filename').innerHTML = templateFile.files[0].name;
  }
};

testFile.onchange = function (event) {
  if (testFile.files.length > 0) {
    document.getElementById('test-filename').innerHTML = testFile.files[0].name;
  }
};

templateId.onchange = function (event) {
   if (event.target.value.length > 0) {
     $('#add-template').addClass('has-text-danger');
     $('#template-text').text(event.target.value.substring(0, Math.min(8, event.target.value.length)));
   } else {
     $('#add-template').removeClass('has-text-danger');
     $('#template-text').text('Template');
   }
};

$('#back-submit').click(function() {
  $('#back-submit').hide();
  $('#resubmit_window').hide();
  $('nav.card').show();
  $('#upload-webcam').prop("disabled", false);
  $('#submission-window').show();
});

$('#add-template').click(function() {
  $('#template-modal').addClass('is-active');
});

$('#template-modal-close').click(function() {
  $('#template-modal').removeClass('is-active');
});

$('#cancel-template').click(function() {
  $('#template-modal').removeClass('is-active');
});
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
