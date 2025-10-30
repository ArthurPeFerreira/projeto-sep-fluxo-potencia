"use client";

import React from "react";

interface GroundIconProps {
  x: number;
  y: number;
  direction?: "down" | "up";
  stroke?: string;
}

export const GroundIcon: React.FC<GroundIconProps> = ({
  x,
  y,
  direction = "down",
  stroke = "#000000",
}) => {
  const sign = direction === "down" ? 1 : -1;
  const baseY = y + sign * 40;
  return (
    <g>
      <line x1={x} y1={y} x2={x} y2={baseY} stroke={stroke} strokeWidth={4} />
      <line
        x1={x - 20}
        y1={baseY + sign * 1}
        x2={x + 20}
        y2={baseY + sign * 1}
        stroke={stroke}
        strokeWidth={4}
      />
      <line
        x1={x - 10}
        y1={baseY + sign * 10}
        x2={x + 10}
        y2={baseY + sign * 10}
        stroke={stroke}
        strokeWidth={4}
      />
      <line
        x1={x - 4}
        y1={baseY + sign * 20}
        x2={x + 4}
        y2={baseY + sign * 20}
        stroke={stroke}
        strokeWidth={4}
      />
    </g>
  );
};

export default GroundIcon;
