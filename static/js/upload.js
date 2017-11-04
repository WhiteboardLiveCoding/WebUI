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

$("#uploado").bind("click", function(){
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
    type: 'POST'
  });
});
