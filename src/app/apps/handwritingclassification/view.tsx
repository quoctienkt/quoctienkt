"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import * as tf from "@tensorflow/tfjs";
import { Chart, registerables } from "chart.js";
import Canvas from "./Canvas";
import infoIcon from "@/assets/img/information.png";
import "./style.css";
import Modal from "./Modal";

const handWritingAIModelPath = `${process.env.NEXT_PUBLIC_BASE_URL}/handwritingclassification/model.json`;

Chart.register(...registerables);

export default function View() {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [chart, setChart] = useState<Chart | null>(null);
  const [notification, setNotification] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPredicting, setIsPredicting] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const loadModel = async () => {
      setNotification("Please wait for loading model!");
      try {
        const loadedModel = await tf.loadLayersModel(handWritingAIModelPath);
        setModel(loadedModel);
        setNotification("Load finish, use model to guess hand writing number");
      } catch (error) {
        console.error("Error loading model:", error);
        setNotification("Error loading model.");
      }
    };
    loadModel();
  }, []);

  const crop_top_bottom = (
    flat_color: Uint8ClampedArray,
    width: number,
    height: number
  ) => {
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

  const crop_left_right = (pixel: number[][][]) => {
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

    let i = height;
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

  const handlePredict = async () => {
    if (!model || !canvasRef.current) return;

    setIsPredicting(true);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const input_width = canvas.width;
    const input_height = canvas.height;

    const raw = ctx.getImageData(0, 0, input_width, input_height).data;
    const img_crop_top_bottom = crop_top_bottom(raw, input_width, input_height);
    const crop_full = crop_left_right(img_crop_top_bottom);

    const width = crop_full[0].length;
    const height = crop_full.length;
    const newImg = tf
      .tensor(crop_full, [height, width, 3])
      .resizeNearestNeighbor([28, 28])
      .mean(2)
      .expandDims(2)
      .expandDims()
      .toFloat()
      .div(255.0);

    const result = ((await model.predict(newImg)) as tf.Tensor).dataSync();
    displayChart(Array.from(result));
  };

  const displayChart = (data: number[]) => {
    if (!chartRef.current) return;
    const label = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    if (chart) {
      chart.destroy();
    }

    const newChart = new Chart(chartRef.current, {
      type: "bar",
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
      options: {},
    });
    setChart(newChart);
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setIsPredicting(false);
    if (chart) {
      chart.destroy();
      setChart(null);
    }
  };

  return (
    <section className="app_handwritingclassification">
      <div
        id="notification_container"
        className={`alert ${
          notification.includes("Error") ? "alert-danger" : "alert-info"
        }`}
      >
        {notification}
      </div>
      <div className="container">
        <div className={isPredicting ? "" : "active"}>
          <Canvas
            canvasRef={canvasRef}
            width={300}
            height={350}
            chartColor="white"
            chartWidth={11}
          />
        </div>
        <div className={`chart-container ${isPredicting ? "active" : ""}`}>
          <canvas ref={chartRef} width="400" height="350"></canvas>
        </div>
      </div>

      <hr className="hr_footer" />

      <div className="actions">
        <button
          className="action-btn predict-btn"
          onClick={handlePredict}
          disabled={!model}
        >
          Predict
        </button>
        <button
          onClick={handleClear}
          className="action-btn clear-btn"
        >
          Clear
        </button>
      </div>

      <div className="information">
        <Image
          src={infoIcon}
          alt="App's info icon"
          className="info-icon"
          width={50}
          height={50}
          onClick={() => setIsModalOpen(true)}
        />
      </div>

      {isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />}
    </section>
  );
}
