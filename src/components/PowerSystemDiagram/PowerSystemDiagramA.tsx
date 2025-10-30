"use client";

import React from "react";
import GroundIcon from "./GroundIcon";
import PhasorPair from "./PhasorPair";

interface PowerSystemDiagramAProps {
  vi: number;
  vj: number;
  angleVi: number;
  angleVj: number;
  className?: string;
}

export const PowerSystemDiagramA: React.FC<PowerSystemDiagramAProps> = ({
  vi,
  vj,
  angleVi,
  angleVj,
  className = "",
}) => {
  return (
    <div className={`w-full h-full overflow-hidden ${className}`}>
      <svg
        viewBox="50 50 700 300"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
          </marker>
          <marker
            id="arrowhead-red"
            markerWidth="10"
            markerHeight="7"
            refX="9"
            refY="3.5"
            orient="auto"
          >
            <polygon points="0 0, 10 3.5, 0 7" fill="#dc2626" />
          </marker>
        </defs>
        <line
          x1="150"
          y1="200"
          x2="150"
          y2="230"
          stroke="#000000"
          strokeWidth="3"
        />
        <line
          x1="150"
          y1="230"
          x2="650"
          y2="230"
          stroke="#000000"
          strokeWidth="3"
        />
        <line
          x1="650"
          y1="200"
          x2="650"
          y2="230"
          stroke="#000000"
          strokeWidth="3"
        />

        <line
          x1="100"
          y1="200"
          x2="200"
          y2="200"
          stroke="#000000"
          strokeWidth="8"
        />
        <GroundIcon x={150} y={200} direction="down" />

        <line
          x1="600"
          y1="200"
          x2="700"
          y2="200"
          stroke="#000000"
          strokeWidth="8"
        />
        <GroundIcon x={650} y={200} direction="down" />

        <text
          x="150"
          y="190"
          className="text-lg font-bold fill-black"
          textAnchor="middle"
        >
          Barra i
        </text>
        <text
          x="650"
          y="190"
          className="text-lg font-bold fill-black"
          textAnchor="middle"
        >
          Barra j
        </text>

        <text
          x="150"
          y="170"
          className="text-sm font-medium fill-black"
          textAnchor="middle"
        >
          Vi = {vi} kV
        </text>
        <text
          x="650"
          y="170"
          className="text-sm font-medium fill-black"
          textAnchor="middle"
        >
          Vj = {vj} kV
        </text>

        <g transform="translate(250, 250)">
          <PhasorPair
            angleA={angleVi}
            angleB={angleVj}
            labelA="Vj"
            labelB="Vi"
            colorA="#2563eb"
            colorB="#dc2626"
            markerAId="arrowhead"
            markerBId="arrowhead-red"
            arcRadius={30}
          />
        </g>
      </svg>
    </div>
  );
};

export default PowerSystemDiagramA;
