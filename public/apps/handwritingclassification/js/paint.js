// by Chtiwi Malek on CODICODE.COM

var pointerPressed = false;
var lastX, lastY;
var ctx;
var chartColor = "white";
var chartWidth = 11;

function InitThis() {
  ctx = document.getElementById("myCanvas").getContext("2d");

  $("#myCanvas").off("pointerdown").on("pointerdown", function(e) {
    pointerPressed = true;
    Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, false);
  });

  $("#myCanvas").off("pointermove").on("pointermove", function(e) {
    if (pointerPressed) {
      Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
    }
  });

  $("#myCanvas").off("pointerover").on("pointerover", function(e) {
    if (pointerPressed) {
      Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top, true);
    }
  });

  $("body").off("pointerdown").on("pointerdown", function(e) {
    pointerPressed = true;
  });

  $("body").off("pointerup").on("pointerup", function(e) {
    pointerPressed = false;
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
