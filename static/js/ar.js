function drawbackground(canvas, context, onload, json) {
  var imagePaper = new Image();
  imagePaper.onload = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width  = json.ar.dimensions.width;
    canvas.height = json.ar.dimensions.height;
    context.drawImage(imagePaper, 0, 0, canvas.width, canvas.height);
    onload(canvas, context, json.ar, false, null);
  };
  imagePaper.src = "https://alpstore.blob.core.windows.net/pictures/" + json.key;
}

function drawRest(canvas, context, json, scaled, scaling) {
  $.each(json.errors, function(k, v) {
    drawLine(canvas, context, v.line['x'], v.line['y'], v.line['width'], v.line['height'], "yellow", scaled, scaling);
  });

  $.each(json.errors, function(k, v) {
    drawLine(canvas, context, v.character['x'], v.line['y'], v.character['width'], v.line['height'], "red", scaled, scaling);
  });

  show_proj_bbox(canvas, context, scaled);
}

function drawLine(canvas, context, _x, _y, _w, _h, color, scaled, scaling) {
  var x = scaled?(_x*(scaling.scaleX))+scaling.deltaX:_x;
  var y = scaled?(_y*(scaling.scaleY))+scaling.deltaY:_y;
  var w = scaled?_w*scaling.scaleX:_w;
  var h = scaled?_h*scaling.scaleY:_h;

  if (scaled) {
    x = Math.min(x, scaled_bbox.x+scaled_bbox.width);
    y = Math.min(y, scaled_bbox.y+scaled_bbox.height);
    if (x+w > scaled_bbox.x+scaled_bbox.width)
      w = scaled_bbox.x+scaled_bbox.width-x;
    if (y+h > scaled_bbox.y+scaled_bbox.height)
      h = scaled_bbox.y+scaled_bbox.height-y;
  }

  context.beginPath();
  context.moveTo(x, y + h);
  context.lineTo(x + w, y + h);

  context.lineWidth = 5;
  context.strokeStyle = color;
  context.stroke();
}

function drawPoint(canvas, context, x, y, size, color) {
  context.fillStyle = color;
  context.beginPath();
  context.arc(x, y, size, 0, 2 * Math.PI);
  context.fill();
}