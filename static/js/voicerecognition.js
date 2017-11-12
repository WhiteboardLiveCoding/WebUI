if (annyang) {
  var commands = {
    'whiteboard capture': {'regexp': /.*whiteboard capture.*/, 'callback': function () {
      document.getElementById('capture-webcam').click();
    }},
    'whiteboard upload': {'regexp': /.*whiteboard upload.*/, 'callback': function () {
      document.getElementById('upload-webcam').click();
    }}
  };

  annyang.addCommands(commands);

  annyang.debug();
  annyang.start({autoRestart: true, continuous: false});
}