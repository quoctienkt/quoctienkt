async function setupApp() {
  InitThis();

  //------------------------------
  // Chart to display predictions
  //------------------------------
  var chart = "";
  var firstTime = 0;
  var chart_box = document.getElementById("chart_box");
  var canvas = document.getElementById("myCanvas");
  var submit = document.getElementById("submit");
  var load = document.getElementById("notification_container");
  var modal = document.getElementById("myModal");
  var btn = document.getElementsByClassName("information")[0];
  var closeModalBtn = document.getElementsByClassName("close")[0];
  var $clearChart = $(".app_handwritingclassification .clear-area");
  var model;

  window.loadChart = function (label, data) {
    let ctx = chart_box.getContext("2d");

    chart = new Chart(ctx, {
      // The type of chart we want to create
      type: "bar",

      // The data for our dataset
      data: {
        labels: label,
        datasets: [
          {
            label: "prediction",
            backgroundColor: "#f50057",
            borderColor: "rgb(255, 99, 132)",
            data: data,
          },
        ],
      },

      // Configuration options go here
      options: {},
    });
  };

  window.displayChart = function (data) {
    label = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    if (firstTime == 0) {
      loadChart(label, data);
      firstTime = 1;
    } else {
      chart.destroy();
      loadChart(label, data);
    }
  };

  window.crop_top_bottom = function (flat_color, width, height) {
    let result = [];
    let itRow = 0;

    let it = 0;
    while (itRow < height) {
      let row = [];
      let itCol = 0;
      while (itCol < width) {
        if (
          flat_color[it] +
            flat_color[it + 1] +
            flat_color[it + 2] +
            flat_color[it + 3] >
          0
        ) {
          row.push([255, 255, 255]);
        } else {
          row.push([0, 0, 0]);
        }
        it += 4;
        itCol += 1;
      }
      for (let i in row) {
        if (row[i][0]) {
          result.push(row);
          break;
        }
      }

      itRow += 1;
    }
    return result;
  };

  window.crop_left_right = function (pixel) {
    let width = pixel[0].length;
    let crop_right = 0;
    let crop_left = 0;
    let height = pixel.length;

    //Crop left
    let condition = 0;
    while (width--) {
      let i = height;
      while (i--) {
        if (pixel[i][crop_left][0] != 0) {
          condition = 1;
          break;
        }
      }

      if (condition) {
        break;
      } else {
        crop_left += 1;
      }
    }

    i = height;
    if (crop_left) {
      while (i--) {
        pixel[i].splice(0, crop_left);
      }
    }

    //end crop left

    //Crop right
    condition = 0;
    while (width--) {
      let i = height;
      while (i--) {
        if (pixel[i][width][0] != 0) {
          condition = 1;
          break;
        }
      }

      if (condition) {
        break;
      } else {
        crop_right += 1;
      }
    }

    i = height;
    if (crop_right) {
      while (i--) {
        pixel[i].splice(-1 - crop_right, crop_right);
      }
    }

    return pixel;
  };

  $clearChart.off("click").on("click", (ev) => {
    clearArea();
  })

  async function loadModel() {
    load.className = "alert alert-warning";
    load.innerHTML = "Please wait for loading model!";
    submit.disabled = true;
    model = await tf.loadLayersModel(
      "/apps/handwritingclassification/dl_model/model.json"
    );
    console.log("Load dl_modal finished");
    load.className = "alert alert-success";
    load.innerHTML = "Load finish, use model to guess hand writing number";
    submit.disabled = false;
  };

  submit.onclick = async function () {
    let result;

    //preprocess image

    let input_width = canvas.width;
    let input_height = canvas.height;

    let raw = canvas
      .getContext("2d")
      .getImageData(0, 0, input_width, input_height).data;
    let img_crop_top_bottom = await crop_top_bottom(
      raw,
      input_width,
      input_height
    );
    let crop_full = await crop_left_right(img_crop_top_bottom);

    let width = crop_full[0].length;
    let height = crop_full.length;
    let newImg = await tf
      .tensor(crop_full, [height, width, 3])
      .resizeNearestNeighbor([28, 28])
      .mean(2)
      .expandDims(2)
      .expandDims()
      .toFloat()
      .div(255.0);
    //end preprocess
    result = await model.predict(newImg).data();
    await displayChart(result, chart_box);
  };

  btn.onclick = function () {
    modal.style.display = "block";
  };

  closeModalBtn.onclick = function () {
    modal.style.display = "none";
  };

  window.onclick = function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };

  loadModel()
}

let setupAppInternal = setInterval(async () => {
  // wait for $ loaded
  if ($ === undefined) {
    return;
  }

  setupApp(); // async
  clearInterval(setupAppInternal);
}, 500);
