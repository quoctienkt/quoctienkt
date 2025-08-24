"use client";

import { useRef, useEffect } from "react";

interface CanvasProps {
  width: number;
  height: number;
  chartWidth: number;
  chartColor: string;
  onClear?: () => void;
  canvasRef: React.RefObject<HTMLCanvasElement>;
}

const Canvas = ({
  width,
  height,
  chartWidth,
  chartColor,
  onClear,
  canvasRef,
}: CanvasProps) => {
  const isDrawing = useRef(false);
  const lastX = useRef(0);
  const lastY = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const startDrawing = (e: PointerEvent) => {
      isDrawing.current = true;
      [lastX.current, lastY.current] = [
        e.offsetX,
        e.offsetY,
      ];
    };

    const draw = (e: PointerEvent) => {
      if (!isDrawing.current) return;
      if (ctx) {
        ctx.beginPath();
        ctx.strokeStyle = chartColor;
        ctx.lineWidth = chartWidth;
        ctx.lineJoin = "round";
        ctx.moveTo(lastX.current, lastY.current);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.closePath();
        ctx.stroke();
      }
      [lastX.current, lastY.current] = [e.offsetX, e.offsetY];
    };

    const stopDrawing = () => {
      isDrawing.current = false;
    };

    canvas.addEventListener("pointerdown", startDrawing);
    canvas.addEventListener("pointermove", draw);
    canvas.addEventListener("pointerup", stopDrawing);
    canvas.addEventListener("pointerout", stopDrawing);

    return () => {
      canvas.removeEventListener("pointerdown", startDrawing);
      canvas.removeEventListener("pointermove", draw);
      canvas.removeEventListener("pointerup", stopDrawing);
      canvas.removeEventListener("pointerout", stopDrawing);
    };
  }, [chartColor, chartWidth, canvasRef]);

  return (
    <canvas ref={canvasRef} width={width} height={height} id="myCanvas" className="active"></canvas>
  );
};

export default Canvas;
