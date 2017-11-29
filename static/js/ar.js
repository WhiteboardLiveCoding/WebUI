function drawbackground(canvas, context, onload, json) {
  var imagePaper = new Image();
  imagePaper.onload = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width  = json.ar.dimensions.width;
    canvas.height = json.ar.dimensions.height;
    context.drawImage(imagePaper, 0, 0, canvas.width, canvas.height);
    onload(canvas, context, json);
  };
  imagePaper.src = "https://alpstore.blob.core.windows.net/pictures/" + json.key;
}

function drawRest(canvas, context, json) {
  $.each(json.ar.errors, function(k, v) {
    drawLine(canvas, context, v.line['x'], v.line['y'], v.line['width'], v.line['height'], "yellow");
  });

  $.each(json.ar.errors, function(k, v) {
    drawLine(canvas, context, v.character['x'], v.line['y'], v.character['width'], v.line['height'], "red");
  });
}

function drawLine(canvas, context, x, y, w, h, color) {
  context.beginPath();
  context.moveTo(x, y + h);
  context.lineTo(x + w, y + h);

  context.lineWidth = 5;
  context.strokeStyle = color;
  context.stroke();
}
