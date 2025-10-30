"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import GroundIcon from "./GroundIcon";
import PhasorPair from "./PhasorPair";
import PowerSystemDiagramA from "./PowerSystemDiagramA";

interface PowerSystemParams {
  Vi: number;
  Vj: number;
  Vk: number;
  R: number;
  L: number;
  angleVi: number;
  angleVj: number;
  angleVk: number;
}

interface PowerSystemDiagramProps {
  className?: string;
  initialValues?: Partial<PowerSystemParams>;
}

type DiagramType = "A" | "B";

export const PowerSystemDiagramB: React.FC<PowerSystemDiagramProps> = ({
  className = "",
  initialValues,
}) => {
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramType>("A");
  const [params, setParams] = useState<PowerSystemParams>({
    Vi: initialValues?.Vi ?? 345,
    Vj: initialValues?.Vj ?? 360,
    Vk: initialValues?.Vk ?? 350,
    R: initialValues?.R ?? 10,
    L: initialValues?.L ?? 5,
    angleVi: initialValues?.angleVi ?? 0,
    angleVj: initialValues?.angleVj ?? 0,
    angleVk: initialValues?.angleVk ?? 10,
  });

  const handleParamChange = (key: keyof PowerSystemParams, value: number) => {
    setParams((prev) => ({ ...prev, [key]: value }));
  };

  const handleReset = () => {
    setParams({
      Vi: 345,
      Vj: 360,
      Vk: 350,
      R: 10,
      L: 5,
      angleVi: 0,
      angleVj: 0,
      angleVk: 10,
    });
  };

  const calculateVectorEnd = (angle: number, length: number) => {
    const radians = (angle * Math.PI) / 180;
    return {
      x: length * Math.cos(radians),
      y: length * Math.sin(radians) * -1,
    };
  };

  const viVector = calculateVectorEnd(params.angleVi, 60);
  const vjVector = calculateVectorEnd(params.angleVj, 60);
  const vkVector = calculateVectorEnd(params.angleVk, 60);

  return (
    <div className={`flex gap-6 w-full h-fit ${className}`}>
      <Card.Root className="w-80 h-fit overflow-y-auto">
        <Card.Header>
          <h2 className="text-xl font-semibold">Parâmetros do Sistema</h2>
        </Card.Header>
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Tipo de Diagrama:</label>
            <div className="flex gap-2">
              <Button
                onClick={() => setSelectedDiagram("A")}
                variant={selectedDiagram === "A" ? "default" : "outline"}
                className="flex-1"
              >
                A (2 Barras)
              </Button>
              <Button
                onClick={() => setSelectedDiagram("B")}
                variant={selectedDiagram === "B" ? "default" : "outline"}
                className="flex-1"
              >
                B (3 Barras)
              </Button>
            </div>
          </div>
          <Input
            type="number"
            title="Tensão Vi (kV)"
            value={params.Vi}
            onChange={(e: any) =>
              handleParamChange(
                "Vi",
                typeof e === "number" ? e : e.target.value
              )
            }
            min={0}
            max={1000}
            step={1}
          />
          <Input
            type="number"
            title="Tensão Vj (kV)"
            value={params.Vj}
            onChange={(e: any) =>
              handleParamChange(
                "Vj",
                typeof e === "number" ? e : e.target.value
              )
            }
            min={0}
            max={1000}
            step={1}
          />
          {selectedDiagram === "B" && (
            <>
              <Input
                type="number"
                title="Tensão Vk (kV)"
                value={params.Vk}
                onChange={(e: any) =>
                  handleParamChange(
                    "Vk",
                    typeof e === "number" ? e : e.target.value
                  )
                }
                min={0}
                max={1000}
                step={1}
              />
              <Input
                type="number"
                title="Resistência R (Ω)"
                value={params.R}
                onChange={(e: any) =>
                  handleParamChange(
                    "R",
                    typeof e === "number" ? e : e.target.value
                  )
                }
                min={0}
                max={1000}
                step={0.1}
              />
              <Input
                type="number"
                title="Indutância L (H)"
                value={params.L}
                onChange={(e: any) =>
                  handleParamChange(
                    "L",
                    typeof e === "number" ? e : e.target.value
                  )
                }
                min={0}
                max={1000}
                step={0.1}
              />
            </>
          )}
          <Input
            type="number"
            title="Ângulo Vi (graus)"
            value={params.angleVi}
            onChange={(e: any) =>
              handleParamChange(
                "angleVi",
                typeof e === "number" ? e : e.target.value
              )
            }
            min={-180}
            max={180}
            step={1}
          />
          <Input
            type="number"
            title="Ângulo Vj (graus)"
            value={params.angleVj}
            onChange={(e: any) =>
              handleParamChange(
                "angleVj",
                typeof e === "number" ? e : e.target.value
              )
            }
            min={-180}
            max={180}
            step={1}
          />
          {selectedDiagram === "B" && (
            <Input
              type="number"
              title="Ângulo Vk (graus)"
              value={params.angleVk}
              onChange={(e: any) =>
                handleParamChange(
                  "angleVk",
                  typeof e === "number" ? e : e.target.value
                )
              }
              min={-180}
              max={180}
              step={1}
            />
          )}
          <Button onClick={handleReset} variant="outline" className="w-full">
            Resetar Valores
          </Button>
        </div>
      </Card.Root>

      <div className="flex-1 items-start ">
        <Card.Root className="w-full h-[890px] bg-white">
          <Card.Content className="p-2 h-fit flex flex-col overflow-hidden">
            {selectedDiagram === "A" ? (
              <PowerSystemDiagramA
                vi={params.Vi}
                vj={params.Vj}
                angleVi={params.angleVi}
                angleVj={params.angleVj}
                className="w-full h-full"
              />
            ) : (
              <svg
                viewBox="0 90 950 500"
                className="w-fit h-fit"
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
                  y1="450"
                  x2="500"
                  y2="150"
                  stroke="#000000"
                  strokeWidth="3"
                />
                <line
                  x1="850"
                  y1="450"
                  x2="500"
                  y2="150"
                  stroke="#000000"
                  strokeWidth="3"
                />
                <line
                  x1="150"
                  y1="450"
                  x2="850"
                  y2="450"
                  stroke="#000000"
                  strokeWidth="3"
                />

                <line
                  x1="100"
                  y1="450"
                  x2="200"
                  y2="450"
                  stroke="#000000"
                  strokeWidth="8"
                />
                <line
                  x1="800"
                  y1="450"
                  x2="900"
                  y2="450"
                  stroke="#000000"
                  strokeWidth="8"
                />
                <line
                  x1="450"
                  y1="150"
                  x2="550"
                  y2="150"
                  stroke="#000000"
                  strokeWidth="8"
                />

                <GroundIcon x={150} y={450} direction="down" />
                <GroundIcon x={850} y={450} direction="down" />
                <GroundIcon x={500} y={150} direction="down" />

                <g transform="translate(200, 300)">
                  <PhasorPair
                    angleA={params.angleVi}
                    angleB={params.angleVk}
                    labelA="Vi"
                    labelB="Vk"
                    colorA="#2563eb"
                    colorB="#dc2626"
                    markerAId="arrowhead"
                    markerBId="arrowhead-red"
                    arcRadius={30}
                  />
                </g>

                <g transform="translate(750, 300)">
                  <PhasorPair
                    angleA={params.angleVj}
                    angleB={params.angleVk}
                    labelA="Vj"
                    labelB="Vk"
                    colorA="#2563eb"
                    colorB="#dc2626"
                    markerAId="arrowhead"
                    markerBId="arrowhead-red"
                    arcRadius={30}
                  />
                </g>

                <g transform="translate(500, 520)">
                  <PhasorPair
                    angleA={params.angleVj}
                    angleB={params.angleVi}
                    labelA="Vj"
                    labelB="Vi"
                    colorA="#2563eb"
                    colorB="#dc2626"
                    markerAId="arrowhead"
                    markerBId="arrowhead-red"
                    arcRadius={30}
                  />
                </g>

                <text
                  x="130"
                  y="430"
                  className="text-lg font-bold fill-black"
                  textAnchor="middle"
                >
                  Barra i
                </text>
                <text
                  x="870"
                  y="430"
                  className="text-lg font-bold fill-black"
                  textAnchor="middle"
                >
                  Barra j
                </text>
                <text
                  x="500"
                  y="130"
                  className="text-lg font-bold fill-black"
                  textAnchor="middle"
                >
                  Barra k
                </text>

                <text
                  x="130"
                  y="410"
                  className="text-sm font-medium fill-black"
                  textAnchor="middle"
                >
                  Vi = {params.Vi} kV
                </text>
                <text
                  x="870"
                  y="410"
                  className="text-sm font-medium fill-black"
                  textAnchor="middle"
                >
                  Vj = {params.Vj} kV
                </text>
                <text
                  x="500"
                  y="110"
                  className="text-sm font-medium fill-black"
                  textAnchor="middle"
                >
                  Vk = {params.Vk} kV
                </text>

                <text
                  x="500"
                  y="300"
                  className="text-sm font-medium fill-black"
                  textAnchor="middle"
                >
                  R = {params.R} Ω
                </text>
                <text
                  x="500"
                  y="320"
                  className="text-sm font-medium fill-black"
                  textAnchor="middle"
                >
                  L = {params.L} H
                </text>
              </svg>
            )}
          </Card.Content>
        </Card.Root>
      </div>
    </div>
  );
};

export default PowerSystemDiagramB;
