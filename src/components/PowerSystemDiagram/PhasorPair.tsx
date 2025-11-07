"use client";

import React from "react";
import Decimal from "decimal.js";
import { PI } from "@/lib/constants";

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

const toRad = (deg: number) => {
  const degDecimal = new Decimal(deg);
  return Number(degDecimal.mul(PI).div(180).toString());
};

const cos = (rad: number) => {
  return Math.cos(rad);
};

const sin = (rad: number) => {
  return Math.sin(rad);
};

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
  const ax = length * cos(toRad(angleA));
  const ay = length * sin(toRad(angleA)) * -1;
  const bx = length * cos(toRad(angleB));
  const by = length * sin(toRad(angleB)) * -1;

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

  const sx = arcRadius * cos(toRad(startAngle));
  const sy = arcRadius * sin(toRad(startAngle)) * -1;
  const ex = arcRadius * cos(toRad(endAngle));
  const ey = arcRadius * sin(toRad(endAngle)) * -1;

  const midAngle = startAngle + (endAngle - startAngle) / 2;
  const tx = (arcRadius + 18) * cos(toRad(midAngle));
  const ty = (arcRadius + 18) * sin(toRad(midAngle)) * -1;

  const labelOffsetA = 15;
  const labelOffsetB = 15;
  const labelAx = ax + labelOffsetA * cos(toRad(angleA));
  const labelAy = ay - labelOffsetA * sin(toRad(angleA));
  const labelBx = bx + labelOffsetB * cos(toRad(angleB));
  const labelBy = by - labelOffsetB * sin(toRad(angleB));

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
        x={labelAx}
        y={labelAy}
        className="text-sm font-medium"
        fill={colorA}
        textAnchor="middle"
        dominantBaseline="middle"
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
        x={labelBx}
        y={labelBy}
        className="text-sm font-medium"
        fill={colorB}
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {labelB}
      </text>

      <path
        d={`M ${sx} ${sy} A ${arcRadius} ${arcRadius} 0 ${largeArcFlag} ${sweepFlag} ${ex} ${ey}`}
        stroke="#6b7280"
        strokeWidth={2}
        fill="none"
      />
      <text
        x={tx}
        y={ty}
        className="text-xs font-medium"
        fill="#6b7280"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {new Decimal(delta).toDecimalPlaces(0).toString()}°
      </text>
    </g>
  );
};

export default PhasorPair;
