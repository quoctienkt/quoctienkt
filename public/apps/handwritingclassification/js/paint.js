// by Chtiwi Malek on CODICODE.COM

var mousePressed = false;
var lastX, lastY;
var ctx;
var chartColor = "white";
var chartWidth = 11;

function InitThis() {
  ctx = document.getElementById("myCanvas").getContext("2d");

  $("#myCanvas").mousedown(function(e) {
    mousePressed = true;
    Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
  });

  $("#myCanvas").mousemove(function(e) {
    if (mousePressed) {
      Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
    }
  });

  $("#myCanvas").mouseover(function(e) {
    if (mousePressed) {
      Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
    }
  });

  $("body").mousedown(function(e) {
    mousePressed = true;
  });

  $("body").mouseup(function(e) {
    mousePressed = false;
  });
}

function Draw(x, y, isDown) {
  if (isDown) {
    ctx.beginPath();
    ctx.strokeStyle = chartColor;
    ctx.lineWidth = chartWidth;
    ctx.lineJoin = "round";
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(x, y);
    ctx.closePath();
    ctx.stroke();
  }
  lastX = x;
  lastY = y;
}

function clearArea() {
  // Use the identity matrix while clearing the canvas
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
