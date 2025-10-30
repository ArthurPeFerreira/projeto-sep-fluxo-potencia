"use client";

import React from "react";

interface PhasorPairProps {
  angleA: number;
  angleB: number;
  length?: number;
  labelA: string;
  labelB: string;
  colorA?: string;
  colorB?: string;
  markerAId?: string;
  markerBId?: string;
  arcRadius?: number;
  className?: string;
}

const toRad = (deg: number) => (deg * Math.PI) / 180;

const PhasorPair: React.FC<PhasorPairProps> = ({
  angleA,
  angleB,
  length = 60,
  labelA,
  labelB,
  colorA = "#2563eb",
  colorB = "#dc2626",
  markerAId = "arrowhead",
  markerBId = "arrowhead-red",
  arcRadius = 30,
  className,
}) => {
  const ax = length * Math.cos(toRad(angleA));
  const ay = length * Math.sin(toRad(angleA)) * -1;
  const bx = length * Math.cos(toRad(angleB));
  const by = length * Math.sin(toRad(angleB)) * -1;

  let delta = (((angleB - angleA) % 360) + 360) % 360;
  let startAngle = angleA;
  let endAngle = angleB;
  if (delta > 180) {
    delta = 360 - delta;
    startAngle = angleB;
    endAngle = angleA;
  }
  const largeArcFlag = 0;
  const sweepFlag = endAngle > startAngle ? 0 : 1;

  const sx = arcRadius * Math.cos(toRad(startAngle));
  const sy = arcRadius * Math.sin(toRad(startAngle)) * -1;
  const ex = arcRadius * Math.cos(toRad(endAngle));
  const ey = arcRadius * Math.sin(toRad(endAngle)) * -1;

  const midAngle = startAngle + (endAngle - startAngle) / 2;
  const tx = (arcRadius + 10) * Math.cos(toRad(midAngle));
  const ty = (arcRadius + 10) * Math.sin(toRad(midAngle)) * -1;

  return (
    <g className={className}>
      <line
        x1={0}
        y1={0}
        x2={ax}
        y2={ay}
        stroke={colorA}
        strokeWidth={3}
        markerEnd={`url(#${markerAId})`}
      />
      <text
        x={ax + 10}
        y={ay + 10}
        className="text-sm font-medium"
        fill={colorA}
      >
        {labelA}
      </text>

      <line
        x1={0}
        y1={0}
        x2={bx}
        y2={by}
        stroke={colorB}
        strokeWidth={3}
        markerEnd={`url(#${markerBId})`}
      />
      <text
        x={bx + 10}
        y={by + 10}
        className="text-sm font-medium"
        fill={colorB}
      >
        {labelB}
      </text>

      <path
        d={`M ${sx} ${sy} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${sweepFlag} ${ex} ${ey}`}
        stroke="#6b7280"
        strokeWidth={2}
        fill="none"
      />
      <text x={tx} y={ty} className="text-xs" fill="#6b7280">
        {delta.toFixed(0)}°
      </text>
    </g>
  );
};

export default PhasorPair;
