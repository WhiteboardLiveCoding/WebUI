// For uploading
if (annyang) {
  var commands = {
    'whiteboard capture': {'regexp': /.*whiteboard capture.*/, 'callback': function () {
      document.getElementById('capture-webcam').click();
    }},
    'whiteboard upload': {'regexp': /.*whiteboard upload.*/, 'callback': function () {
      document.getElementById('upload-webcam').click();
    }},
    'whiteboard run': {'regexp': /.*whiteboard run.*/, 'callback': function () {
      document.getElementById('upload-code').click();
    }}
  };

  annyang.addCommands(commands);

  annyang.debug();
  annyang.start({autoRestart: true, continuous: false});
}
