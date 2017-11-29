// Projector mode related code

var orig_bbox = {};
var scaled_bbox = {};
var saved_ar_json = {};
var dragMode = false, wResMode = false, hResMode = false;
var cornerSize = 10;
var bbox_scaling = {}
var mouseX, mouseY, dragX, dragY, targetX, targetY;
var timer;
var smoothCoef = 0.45;

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

  bbox_scaling = {
    deltaX: 0, deltaY: 0,
    scaleX: 1, scaleY: 1
  };

  scaled_bbox = JSON.parse(JSON.stringify(orig_bbox));

  dragMode = false;

  saved_ar_json = ar_json;
}

// Renders original bounding box
function show_proj_bbox(canvas, context, scaled) {
  var x = scaled?(scaled_bbox.x):(orig_bbox.x);
  var y = scaled?(scaled_bbox.y):(orig_bbox.y);
  var w = scaled?(scaled_bbox.width):(orig_bbox.width);
  var h = scaled?(scaled_bbox.height):(orig_bbox.height);

  drawPoint(canvas, context, x, y, cornerSize, "#0000FF");
  drawPoint(canvas, context, x + w, y, cornerSize, "#0000FF");
  drawPoint(canvas, context, x, y + h, cornerSize, "#0000FF");
  drawPoint(canvas, context, x + w, y + h, cornerSize, "#0000FF");
}

// Hides everything and creates projector canvas
function enter_proj_mode(ar_json) {
  $('#app').hide();
  $('#navbar_top').hide();
  $("body").append("<canvas id=\"projector_canvas\"></canvas>");

  // disable scrolling
  $('html, body').css({
    overflow: 'hidden',
    height: '100%'
  });

  var canvas = document.getElementById("projector_canvas");
  unlock_bbox(canvas);

  draw_projector_canvas(saved_ar_json);
}

// Shows everything and removes projector canvas
function exit_proj_mode(ar_json) {
  $("#projector_canvas").remove();
  $('#app').show();
  $('#navbar_top').show();

  // enable scrolling
  $('html, body').css({
    overflow: 'auto',
    height: 'auto'
  });
}

function draw_projector_canvas(ar_json) {
  var canvas = document.getElementById("projector_canvas");
  var context = canvas.getContext("2d");

  canvas.width  = screen.width;
  canvas.height = screen.height;
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.beginPath();
  context.rect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "white";
  context.fill();

  drawRest(canvas, context, ar_json, true, bbox_scaling);
}

function setup_proj_mode() {
  if (!screenfull.enabled) {
    return false;
  }

  $('#projector-mode').click(function () {
    screenfull.request();
    enter_proj_mode();
  });

  function fullscreenchange() {
    if (!screenfull.isFullscreen) {
      exit_proj_mode();
    }
  }

  screenfull.on('change', fullscreenchange);

  // set the initial values
  fullscreenchange();
}

// Enables dynamic bbox scaling
function unlock_bbox(canvas) {
  canvas.addEventListener('mousedown', mouseDown, false);
  canvas.addEventListener('mousemove', mouseMove_cursoronly, false);
}

// Finds position of given object
// Needed for fullscreen mouse coordinates to be correct
function findPos(obj) {
  var curleft = 0, curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return { x: curleft, y: curtop };
  }
  return undefined;
}

function canDrag() {
  return mouseX >= scaled_bbox.x + cornerSize &&
      mouseX <= scaled_bbox.x + scaled_bbox.width - cornerSize &&
      mouseY >= scaled_bbox.y + cornerSize &&
      mouseY <= scaled_bbox.y + scaled_bbox.height - cornerSize;
}

function checkCloseEnough(p1, p2) {
  return Math.abs(p1 - p2) <= cornerSize;
}

function mouseDown(e) {
  var canvas = document.getElementById("projector_canvas");
  var context = canvas.getContext("2d");
  var obj_pos = findPos(this);

  // get mouse position
  mouseX = e.clientX - obj_pos.x + window.pageXOffset;
  mouseY = e.clientY - obj_pos.y + window.pageYOffset;

  const bounds = this.getBoundingClientRect();
  mouseX = (mouseX / bounds.width) * this.width;
  mouseY = (mouseY / bounds.height) * this.height;

  if (canDrag()) {
    dragMode = true;
    e.target.style.cursor = 'move';

    dragX = mouseX - scaled_bbox.x;
    dragY = mouseY - scaled_bbox.y;

    targetX = mouseX - dragX;
    targetY = mouseY - dragY;

    timer = setInterval(onTimerTick, 1000/30);
  } else {
    if (checkCloseEnough(mouseX, scaled_bbox.x + scaled_bbox.width) && checkCloseEnough(mouseY, scaled_bbox.y)) {
      e.target.style.cursor = 'w-resize';
      wResMode = true;
    } else if (checkCloseEnough(mouseX, scaled_bbox.x + scaled_bbox.width) &&
      checkCloseEnough(mouseY, scaled_bbox.y + scaled_bbox.height)) {
      e.target.style.cursor = 'n-resize';
      hResMode = true;
    }
  }

  canvas.removeEventListener('mousemove', mouseMove_cursoronly, false);
  canvas.addEventListener('mousemove', mouseMove, false);
  canvas.removeEventListener('mousedown', mouseDown, false);
  canvas.addEventListener('mouseup', mouseUp, false);

  if (e.preventDefault) {
    e.preventDefault();
  } //standard
  else if (e.returnValue) {
    e.returnValue = false;
  } //older IE
  return false;
}

function mouseUp(e) {
  var canvas = document.getElementById("projector_canvas");
  //dragTL = dragTR = dragBL = dragBR = false;
  unlock_bbox(canvas);
  canvas.removeEventListener('mouseup', mouseUp, false);
  if (dragMode || wResMode || hResMode) {
    dragMode = false;
    wResMode = false;
    hResMode = false;
    canvas.removeEventListener('mousemove', mouseMove, false);
    canvas.addEventListener('mousemove', mouseMove_cursoronly, false);
  }

  e.target.style.cursor = 'default';
}

function mouseMove_cursoronly(e) {
  var canvas = document.getElementById("projector_canvas");
  var context = canvas.getContext("2d");
  var obj_pos = findPos(this);

  // get mouse position
  mouseX = e.clientX - obj_pos.x + window.pageXOffset;
  mouseY = e.clientY - obj_pos.y + window.pageYOffset;

  const bounds = this.getBoundingClientRect();
  mouseX = (mouseX / bounds.width) * this.width;
  mouseY = (mouseY / bounds.height) * this.height;

  if (checkCloseEnough(mouseX, scaled_bbox.x + scaled_bbox.width) && checkCloseEnough(mouseY, scaled_bbox.y))
    e.target.style.cursor = 'w-resize';
  else if (checkCloseEnough(mouseX, scaled_bbox.x + scaled_bbox.width) && checkCloseEnough(mouseY, scaled_bbox.y + scaled_bbox.height))
    e.target.style.cursor = 'n-resize';
  else if (canDrag())
    e.target.style.cursor = 'move';
  else
    e.target.style.cursor = 'default';
}

function mouseMove(e) {
  var canvas = document.getElementById("projector_canvas");
  var context = canvas.getContext("2d");
  var obj_pos = findPos(this);

  // get mouse position
  mouseX = e.clientX - obj_pos.x + window.pageXOffset;
  mouseY = e.clientY - obj_pos.y + window.pageYOffset;

  const bounds = this.getBoundingClientRect();
  mouseX = (mouseX / bounds.width) * this.width;
  mouseY = (mouseY / bounds.height) * this.height;

  if (dragMode) {
    var maxX = screen.width - scaled_bbox.width;
    var maxY = screen.height - scaled_bbox.height;

    posX = mouseX - dragX;
    posX = (posX < 0) ? 0 : ((posX > maxX) ? maxX : posX);
    posY = mouseY - dragY;
    posY = (posY < 0) ? 0 : ((posY > maxY) ? maxY : posY);

    targetX = posX;
    targetY = posY;
  } else if (wResMode) {
    scaled_bbox.width = Math.abs(scaled_bbox.x - mouseX);
    if (scaled_bbox.width < (orig_bbox.width * 0.8))
      scaled_bbox.width = orig_bbox.width * 0.8;

    bbox_scaling.scaleX = scaled_bbox.width / (orig_bbox.width+(cornerSize));
    draw_projector_canvas(saved_ar_json);
  } else if (hResMode) {
    scaled_bbox.height = Math.abs(scaled_bbox.y - mouseY);
    if (scaled_bbox.height < (orig_bbox.height * 0.8))
      scaled_bbox.height = orig_bbox.height * 0.8;

    bbox_scaling.scaleY = scaled_bbox.height / (orig_bbox.height+(cornerSize));
    draw_projector_canvas(saved_ar_json);
  }
}

function onTimerTick() {
  scaled_bbox.x = scaled_bbox.x + smoothCoef * (targetX - scaled_bbox.x);
  scaled_bbox.y = scaled_bbox.y + smoothCoef * (targetY - scaled_bbox.y);

  //stop the timer when the target position is reached (close enough)
  if ((!dragMode)&&(Math.abs(scaled_bbox.x - targetX) < 0.1) && (Math.abs(scaled_bbox.y - targetY) < 0.1)) {
    scaled_bbox.x = targetX;
    scaled_bbox.y = targetY;
    //stop timer:
    clearInterval(timer);
  }

  bbox_scaling.deltaX = scaled_bbox.x - orig_bbox.x;
  bbox_scaling.deltaY = scaled_bbox.y - orig_bbox.y;

  draw_projector_canvas(saved_ar_json);
}