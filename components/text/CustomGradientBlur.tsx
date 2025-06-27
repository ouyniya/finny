// inspired by Aceternity UI 3D Pin component: https://ui.aceternity.com/components/3d-pin

import React from "react";

type GradientStop = {
  stop: string; // เช่น '25%' หรือ '50%'
  color: string; // เช่น 'rgba(255,255,255,1)'
};

type CustomGradientBlurProps = {
  height?: string;
  direction?: "to bottom" | "to top" | "to left" | "to right";
  stops?: GradientStop[][];
};

const defaultStops: GradientStop[][] = [
  [
    { stop: "12.5%", color: "rgba(255,255,255,0)" },
    { stop: "25%", color: "rgba(255,255,255,1)" },
    { stop: "37.5%", color: "rgba(255,255,255,0)" },
  ],
  [
    { stop: "25%", color: "rgba(255,255,255,0)" },
    { stop: "37.5%", color: "rgba(255,255,255,1)" },
    { stop: "50%", color: "rgba(255,255,255,0)" },
  ],
  [
    { stop: "37.5%", color: "rgba(255,255,255,0)" },
    { stop: "50%", color: "rgba(255,255,255,1)" },
    { stop: "62.5%", color: "rgba(255,255,255,0)" },
  ],
];

const CustomGradientBlur: React.FC<CustomGradientBlurProps> = ({
  height = "65%",
  direction = "to bottom",
  stops = defaultStops,
}) => {
  const blurLevels = [1, 2, 4];

  return (
    <div
      className="absolute inset-x-0 bottom-0 pointer-events-none"
      style={{ height, zIndex: 5 }}
    >
      {stops.map((stopSet, i) => {
        const gradient = `linear-gradient(${direction}, ${stopSet
          .map((s) => `${s.color} ${s.stop}`)
          .join(", ")})`;

        const blur = `blur(${blurLevels[i] || 8}px)`;

        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              zIndex: i + 1,
              backdropFilter: blur,
              WebkitBackdropFilter: blur,
              maskImage: gradient,
              WebkitMaskImage: gradient,
            }}
          />
        );
      })}
    </div>
  );
};

export default CustomGradientBlur;