import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface EfficientFrontierChartProps {
  efficientFrontier: { volatility: number; expectedReturn: number }[];
  bestPortfolio: { volatility: number; expectedReturn: number };
}

const EfficientFrontierCanvas: React.FC<EfficientFrontierChartProps> = ({
  efficientFrontier,
  bestPortfolio,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
  }>({
    width: 600,
    height: 400,
  });

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width, height } = entries[0].contentRect;
      setDimensions({ width, height });
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!canvasRef.current || efficientFrontier.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // อัปเดตขนาด Canvas จริง (ต้องตั้ง width/height ไม่ใช่แค่ CSS)
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    const width = canvas.width;
    const height = canvas.height;

    // Scale
    const xScale = d3
      .scaleLinear()
      .domain(
        d3.extent(efficientFrontier, (d) => d.volatility) as [number, number]
      )
      .range([40, width - 20]);

    const yScale = d3
      .scaleLinear()
      .domain(
        d3.extent(efficientFrontier, (d) => d.expectedReturn) as [
          number,
          number
        ]
      )
      .range([height - 30, 20]);

    // Clear
    ctx.clearRect(0, 0, width, height);

    // จุด Port ทั้งหมด
    ctx.fillStyle = "#8884d8";
    efficientFrontier.forEach((d) => {
      ctx.beginPath();
      ctx.arc(
        xScale(d.volatility),
        yScale(d.expectedReturn),
        1.5,
        0,
        2 * Math.PI
      );
      ctx.fill();
    });

    // จุด Best Portfolio
    ctx.fillStyle = "#FF4D4F";
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(
      xScale(bestPortfolio.volatility),
      yScale(bestPortfolio.expectedReturn),
      6,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.stroke();

    // Axes
    ctx.fillStyle = "#FFF";
    ctx.font = "12px sans-serif";
    ctx.fillText("Volatility", width / 2 - 20, height - 5);
    ctx.save();
    ctx.translate(10, height / 2 + 20);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Expected Return", 0, 0);
    ctx.restore();

    // Draw X Axis Line
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(40, height - 30);
    ctx.lineTo(width - 20, height - 30);
    ctx.stroke();

    // Draw Y Axis Line
    ctx.beginPath();
    ctx.moveTo(40, height - 30);
    ctx.lineTo(40, 20);
    ctx.stroke();
  }, [efficientFrontier, bestPortfolio, dimensions]);

  return (
    <div ref={containerRef} className="w-full h-[400px] relative">
      <h2 className="text-lg mb-2">Efficient Frontier</h2>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};

export default EfficientFrontierCanvas;
