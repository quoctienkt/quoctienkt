import * as tf from "@tensorflow/tfjs";
import { Chart, registerables } from "chart.js";
import type { LayersModel } from "@tensorflow/tfjs";

Chart.register(...registerables);

export class HandwritingClassifier {
  private model: LayersModel | null = null;
  private canvas: HTMLCanvasElement;
  private chartCanvas: HTMLCanvasElement;
  private currentChart: Chart | null = null;
  private setModel: (model: LayersModel | null) => void;
  private setNotification: (notification: string) => void;
  private aiModelPath: string;
  private isDrawing = false;
  private lastX = 0;
  private lastY = 0;
  private ctx: CanvasRenderingContext2D | null;

  constructor(
    aiModelPath: string,
    canvas: HTMLCanvasElement,
    chartCanvas: HTMLCanvasElement,
    setModel: (model: LayersModel | null) => void,
    setNotification: (notification: string) => void
  ) {
    this.aiModelPath = aiModelPath;
    this.canvas = canvas;
    this.chartCanvas = chartCanvas;
    this.ctx = this.canvas.getContext("2d");
    this.setModel = setModel;
    this.setNotification = setNotification;
    this.loadModel();
    this.setupDrawing();
  }

  private async loadModel() {
    this.setNotification("Please wait for loading model!");
    try {
      this.model = await tf.loadLayersModel(this.aiModelPath);
      this.setModel(this.model);
      this.setNotification(
        "Load finish, use model to guess hand writing number"
      );
    } catch (error) {
      console.error("Error loading model:", error);
      this.setNotification("Error loading model.");
      this.setModel(null);
    }
  }

  public async handlePredict() {
    if (!this.model || !this.canvas || !this.chartCanvas) return;

    const ctx = this.canvas.getContext("2d");
    if (!ctx) return;

    const input_width = this.canvas.width;
    const input_height = this.canvas.height;

    const raw = ctx.getImageData(0, 0, input_width, input_height).data;
    const img_crop_top_bottom = this.cropTopAndBottom(
      raw,
      input_width,
      input_height
    );
    const crop_full = this.cropLeftAndRight(img_crop_top_bottom);

    if (crop_full.length === 0 || crop_full[0].length === 0) return;

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

    const result = (this.model.predict(newImg) as tf.Tensor).dataSync();
    this.displayChart(Array.from(result));
  }

  public handleClear() {
    if (this.canvas) {
      const ctx = this.canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
    }
    if (this.currentChart) {
      this.currentChart.destroy();
      this.currentChart = null;
    }
  }

  private setupDrawing() {
    if (!this.canvas) return () => {};

    const startDrawing = (e: PointerEvent) => {
      this.isDrawing = true;
      [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
    };

    const draw = (e: PointerEvent) => {
      if (!this.isDrawing) return;
      if (this.ctx) {
        this.ctx.beginPath();
        this.ctx.strokeStyle = "white";
        this.ctx.lineWidth = 11;
        this.ctx.lineJoin = "round";
        this.ctx.moveTo(this.lastX, this.lastY);
        this.ctx.lineTo(e.offsetX, e.offsetY);
        this.ctx.closePath();
        this.ctx.stroke();
      }
      [this.lastX, this.lastY] = [e.offsetX, e.offsetY];
    };

    const stopDrawing = () => {
      this.isDrawing = false;
    };

    this.canvas.addEventListener("pointerdown", startDrawing);
    this.canvas.addEventListener("pointermove", draw);
    this.canvas.addEventListener("pointerup", stopDrawing);
    this.canvas.addEventListener("pointerout", stopDrawing);

    return () => {
      this.canvas.removeEventListener("pointerdown", startDrawing);
      this.canvas.removeEventListener("pointermove", draw);
      this.canvas.removeEventListener("pointerup", stopDrawing);
      this.canvas.removeEventListener("pointerout", stopDrawing);
    };
  }

  private cropTopAndBottom(
    flat_color: Uint8ClampedArray,
    width: number,
    height: number
  ): number[][][] {
    const result: number[][][] = [];
    let itRow = 0;

    let it = 0;
    while (itRow < height) {
      const row: number[][] = [];
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
      const hasContent = row.some(
        (pixel) => pixel[0] !== 0 || pixel[1] !== 0 || pixel[2] !== 0
      );
      if (hasContent) {
        result.push(row);
      }
      itRow += 1;
    }
    return result;
  }

  private cropLeftAndRight(pixel: number[][][]): number[][][] {
    if (pixel.length === 0) return [];

    let minX = pixel[0].length;
    let maxX = -1;

    for (let y = 0; y < pixel.length; y++) {
      for (let x = 0; x < pixel[y].length; x++) {
        const p = pixel[y][x];
        if (p[0] !== 0 || p[1] !== 0 || p[2] !== 0) {
          if (x < minX) minX = x;
          if (x > maxX) maxX = x;
        }
      }
    }

    if (maxX === -1) {
      return [];
    }

    const cropped: number[][][] = [];
    for (let y = 0; y < pixel.length; y++) {
      cropped.push(pixel[y].slice(minX, maxX + 1));
    }

    return cropped;
  }

  private displayChart(data: number[]) {
    if (!this.chartCanvas) return;
    const label = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

    if (this.currentChart) {
      this.currentChart.destroy();
    }

    const newChart = new Chart(this.chartCanvas, {
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
    this.currentChart = newChart;
  }
}
