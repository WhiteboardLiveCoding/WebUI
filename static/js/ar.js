function drawbackground(canvas, context, onload, json) {
  var imagePaper = new Image();
  imagePaper.onload = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(imagePaper, 0, 0, canvas.width, canvas.height);
    onload(canvas, context, json);
  };
  imagePaper.src = "https://alpstore.blob.core.windows.net/pictures/" + json.key;
}

function drawRest(canvas, context, json) {
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
