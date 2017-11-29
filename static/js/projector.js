// Projector mode related code

var orig_bbox = {};

// Stores original bbox (unscaled) provided by backend
function set_proj_orig_bbox(ar_json) {
  var width = ar_json.bbox['max_x'] - ar_json.bbox['min_x'];
  var height = ar_json.bbox['max_y'] - ar_json.bbox['min_y'];

  orig_bbox = {
    x: ar_json.bbox['min_x'],
    y: ar_json.bbox['min_y'],
    width: width,
    height: height
  };
}

// Renders original bounding box
function show_proj_orig_bbox(canvas, context) {
  console.log(orig_bbox);
  drawPoint(canvas, context, orig_bbox.x, orig_bbox.y, 10, "#0000FF");
  drawPoint(canvas, context, orig_bbox.x + orig_bbox.width, orig_bbox.y, 10, "#0000FF");
  drawPoint(canvas, context, orig_bbox.x, orig_bbox.y + orig_bbox.height, 10, "#0000FF");
  drawPoint(canvas, context, orig_bbox.x + orig_bbox.width, orig_bbox.y + orig_bbox.height, 10, "#0000FF");
}