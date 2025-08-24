"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import type { LayersModel } from "@tensorflow/tfjs";
import infoIcon from "@/assets/img/information.png";
import "./style.css";
import Modal from "./Modal";
import { HandwritingClassifier } from "./logic";

const handWritingAIModelPath = `${process.env.NEXT_PUBLIC_BASE_URL}/handwritingclassification/model.json`;

export default function View() {
  const [model, setModel] = useState<LayersModel | null>(null);
  const [notification, setNotification] = useState(
    "Please wait for loading model!"
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classifier, setClassifier] = useState<HandwritingClassifier | null>(
    null
  );

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current && chartRef.current) {
      const newClassifier = new HandwritingClassifier(
        handWritingAIModelPath,
        canvasRef.current,
        chartRef.current,
        setModel,
        setNotification
      );
      setClassifier(newClassifier);
    }
  }, []);

  const onPredict = () => {
    if (classifier) {
      classifier.handlePredict();
    }
  };

  const onClear = () => {
    if (classifier) {
      classifier.handleClear();
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

      <div>
        <div className="container">
          <div>
            <canvas
              id="myCanvas"
              className="active"
              ref={canvasRef}
              width={300}
              height={350}
            ></canvas>
          </div>
          <div className="chart-container">
            <canvas ref={chartRef} width={400} height={350}></canvas>
          </div>
        </div>

        <hr className="hr_footer" />

        <div className="actions">
          <button
            className="action-btn predict-btn"
            onClick={onPredict}
            disabled={!model}
          >
            Predict
          </button>
          <button onClick={onClear} className="action-btn clear-btn">
            Clear
          </button>

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
        </div>
      </div>

      {isModalOpen && <Modal setIsModalOpen={setIsModalOpen} />}
    </section>
  );
}
