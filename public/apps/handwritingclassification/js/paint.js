// Reference: https://usefulangle.com/post/27/javascript-advantage-of-using-pointer-events-over-mouse-touch-events

var pointerPressed = false;
var lastX, lastY;
var ctx;
var chartColor = "white";
var chartWidth = 11;

function InitThis() {
  ctx = document.getElementById("myCanvas").getContext("2d");

  $("#myCanvas")
    .off("pointerdown")
    .on("pointerdown", function (e) {
      pointerPressed = true;
      lastX = e.pageX - $(this).offset().left;
      lastY = e.pageY - $(this).offset().top;
    });

  $("#myCanvas")
    .off("pointerup")
    .on("pointerup", function (e) {
      pointerPressed = false;
    });

  // $("#myCanvas")
  //   .off("pointerout")
  //   .on("pointerout", function (e) {
  //     pointerPressed = false;
  //   });

  $("#myCanvas")
    .off("pointermove")
    .on("pointermove", function (e) {
      if (pointerPressed) {
        Draw(e.pageX - $(this).offset().left, e.pageY - $(this).offset().top);
      }
    });
}

function Draw(x, y) {
  if (pointerPressed) {
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
