"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { Form } from "@/components/ui/Form";
import { Modal } from "@/components/ui/Modal";
import { LoadingIcon } from "@/components/ui/Icons/LoadingIcon";
import GroundIcon from "../GroundIcon";
import PhasorPair from "../PhasorPair";
import { powerSystemSchemaB } from "./schema";
import {
  PowerSystemParamsB,
  ImpedanceFormat,
  PowerSystemDiagramBProps,
} from "./types";
import { getComplexFromRectangular, getComplexFromPolar } from "./utils";
import {
  calculatePowerFlowB,
  PowerFlowResultsB,
  ResultRowB,
  PowerSystemParamsDecimalB,
} from "./calculations";
import { Table } from "@/components/ui/Table";
import Decimal from "decimal.js";

export const PowerSystemDiagramB: React.FC<PowerSystemDiagramBProps> = ({
  className = "",
  initialValues,
}) => {
  const [impedanceFormat, setImpedanceFormat] =
    useState<ImpedanceFormat>("rectangular");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState<PowerFlowResultsB | null>(null);
  const [inputData, setInputData] = useState<PowerSystemParamsB | null>(null);

  const form = useForm<PowerSystemParamsB>({
    resolver: zodResolver(powerSystemSchemaB),
    defaultValues: {
      Vi: initialValues?.Vi ?? 345,
      Vj: initialValues?.Vj ?? 360,
      Vk: initialValues?.Vk ?? 350,
      angleVi: initialValues?.angleVi ?? 0,
      angleVj: initialValues?.angleVj ?? 0,
      angleVk: initialValues?.angleVk ?? 10,
      Vn: initialValues?.Vn ?? 345,
      L: initialValues?.L ?? 80,
      zR: initialValues?.zR ?? 10,
      zX: initialValues?.zX ?? 5,
    },
  });

  const params = form.watch();

  const currentComplex = getComplexFromRectangular(params.zR, params.zX);

  const [polarMagnitude, setPolarMagnitude] = useState<string>("");
  const [polarAngle, setPolarAngle] = useState<string>("");

  const polarMagnitudeValue = currentComplex.abs();
  const polarAngleValue = (currentComplex.arg() * 180) / Math.PI;

  useEffect(() => {
    if (impedanceFormat === "polar") {
      setPolarMagnitude(polarMagnitudeValue.toFixed(2));
      setPolarAngle(polarAngleValue.toFixed(2));
    }
  }, [
    params.zR,
    params.zX,
    impedanceFormat,
    polarMagnitudeValue,
    polarAngleValue,
  ]);

  const handleImpedanceFormatChange = (format: ImpedanceFormat) => {
    if (format === "polar") {
      setPolarMagnitude(polarMagnitudeValue.toFixed(2));
      setPolarAngle(polarAngleValue.toFixed(2));
    }
    setImpedanceFormat(format);
  };

  const handlePolarMagnitudeChange = (value: string) => {
    setPolarMagnitude(value);
    const magnitude = parseFloat(value) || 0;
    const angle = parseFloat(polarAngle) || 0;
    const complex = getComplexFromPolar(magnitude, angle);
    form.setValue("zR", complex.re);
    form.setValue("zX", complex.im);
  };

  const handlePolarAngleChange = (value: string) => {
    setPolarAngle(value);
    const magnitude = parseFloat(polarMagnitude) || 0;
    const angle = parseFloat(value) || 0;
    const complex = getComplexFromPolar(magnitude, angle);
    form.setValue("zR", complex.re);
    form.setValue("zX", complex.im);
  };

  const handleCalculate = (data: PowerSystemParamsB) => {
    setIsLoading(true);
    setInputData(data);

    setTimeout(() => {
      const decimalData: PowerSystemParamsDecimalB = {
        Vi: new Decimal(data.Vi),
        Vj: new Decimal(data.Vj),
        Vk: new Decimal(data.Vk),
        angleVi: new Decimal(data.angleVi),
        angleVj: new Decimal(data.angleVj),
        angleVk: new Decimal(data.angleVk),
        zR: new Decimal(data.zR),
        zX: new Decimal(data.zX),
      };

      const calculatedResults = calculatePowerFlowB(decimalData);
      setResults(calculatedResults);
      setIsLoading(false);
      setIsModalOpen(true);
    }, 1500);
  };

  const tableData: ResultRowB[] = React.useMemo(() => {
    if (!inputData || !results) return [];

    return [
      {
        parametro: "Vi",
        valor: `${inputData.Vi}∠${inputData.angleVi}°`,
        unidade: "kV",
      },
      {
        parametro: "Vj",
        valor: `${inputData.Vj}∠${inputData.angleVj}°`,
        unidade: "kV",
      },
      {
        parametro: "Vk",
        valor: `${inputData.Vk}∠${inputData.angleVk}°`,
        unidade: "kV",
      },
      {
        parametro: "Pij",
        valor: results.Pij.toFixed(2),
        unidade: "MW",
      },
      {
        parametro: "Pji",
        valor: results.Pji.toFixed(2),
        unidade: "MW",
      },
      {
        parametro: "ΔPij",
        valor: results.deltaPij.toFixed(2),
        unidade: "MW",
      },
      {
        parametro: "Pik",
        valor: results.Pik.toFixed(2),
        unidade: "MW",
      },
      {
        parametro: "Pki",
        valor: results.Pki.toFixed(2),
        unidade: "MW",
      },
      {
        parametro: "ΔPik",
        valor: results.deltaPik.toFixed(2),
        unidade: "MW",
      },
      {
        parametro: "Pjk",
        valor: results.Pjk.toFixed(2),
        unidade: "MW",
      },
      {
        parametro: "Pkj",
        valor: results.Pkj.toFixed(2),
        unidade: "MW",
      },
      {
        parametro: "ΔPjk",
        valor: results.deltaPjk.toFixed(2),
        unidade: "MW",
      },
      {
        parametro: "Qij",
        valor: results.Qij.toFixed(2),
        unidade: "MVAr",
      },
      {
        parametro: "Qji",
        valor: results.Qji.toFixed(2),
        unidade: "MVAr",
      },
      {
        parametro: "ΔQij",
        valor: results.deltaQij.toFixed(2),
        unidade: "MVAr",
      },
      {
        parametro: "Qik",
        valor: results.Qik.toFixed(2),
        unidade: "MVAr",
      },
      {
        parametro: "Qki",
        valor: results.Qki.toFixed(2),
        unidade: "MVAr",
      },
      {
        parametro: "ΔQik",
        valor: results.deltaQik.toFixed(2),
        unidade: "MVAr",
      },
      {
        parametro: "Qjk",
        valor: results.Qjk.toFixed(2),
        unidade: "MVAr",
      },
      {
        parametro: "Qkj",
        valor: results.Qkj.toFixed(2),
        unidade: "MVAr",
      },
      {
        parametro: "ΔQjk",
        valor: results.deltaQjk.toFixed(2),
        unidade: "MVAr",
      },
    ];
  }, [inputData, results]);

  const tableColumns = [
    {
      key: "parametro" as keyof ResultRowB,
      title: "Parâmetro",
      width: "auto",
      align: "center" as const,
      sortable: false,
      searchable: false,
      render: (value: any) => (
        <span className="font-semibold">{String(value)}</span>
      ),
    },
    {
      key: "valor" as keyof ResultRowB,
      title: "Valor",
      width: "auto",
      align: "center" as const,
      sortable: false,
      searchable: false,
      render: (value: any, row: ResultRowB) => (
        <span className={row.parametro.startsWith("Δ") ? "font-bold" : ""}>
          {String(value)}
        </span>
      ),
    },
    {
      key: "unidade" as keyof ResultRowB,
      title: "Unidade",
      width: "auto",
      align: "center" as const,
      sortable: false,
      searchable: false,
      render: (value: any) => (
        <span className="text-muted-foreground">{String(value)}</span>
      ),
    },
  ];

  useEffect(() => {
    const initialComplex = getComplexFromRectangular(
      initialValues?.zR ?? 10,
      initialValues?.zX ?? 5
    );
    setPolarMagnitude(initialComplex.abs().toFixed(2));
    setPolarAngle(((initialComplex.arg() * 180) / Math.PI).toFixed(2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`flex gap-6 w-full h-fit ${className}`}>
      <Card.Root className="w-96 h-fit overflow-y-auto">
        <Card.Header>
          <h2 className="text-xl font-semibold">Parâmetros do Sistema</h2>
        </Card.Header>
        <Form.Root form={form} onSubmit={handleCalculate}>
          <div className="space-y-4 p-4">
            <Form.Item
              control={form.control}
              name="Vi"
              render={({ field }) => (
                <Input
                  type="number"
                  title="Tensão Vi (kV)"
                  value={field.value}
                  onChange={(e: any) =>
                    field.onChange(
                      typeof e === "number"
                        ? e
                        : parseFloat(e.target.value) || 0
                    )
                  }
                  min={0}
                  max={1000}
                  step={1}
                />
              )}
            />
            <Form.Item
              control={form.control}
              name="Vj"
              render={({ field }) => (
                <Input
                  type="number"
                  title="Tensão Vj (kV)"
                  value={field.value}
                  onChange={(e: any) =>
                    field.onChange(
                      typeof e === "number"
                        ? e
                        : parseFloat(e.target.value) || 0
                    )
                  }
                  min={0}
                  max={1000}
                  step={1}
                />
              )}
            />
            <Form.Item
              control={form.control}
              name="Vk"
              render={({ field }) => (
                <Input
                  type="number"
                  title="Tensão Vk (kV)"
                  value={field.value}
                  onChange={(e: any) =>
                    field.onChange(
                      typeof e === "number"
                        ? e
                        : parseFloat(e.target.value) || 0
                    )
                  }
                  min={0}
                  max={1000}
                  step={1}
                />
              )}
            />
            <Form.Item
              control={form.control}
              name="angleVi"
              render={({ field }) => (
                <Input
                  type="number"
                  title="Ângulo Vi (graus)"
                  value={field.value}
                  onChange={(e: any) =>
                    field.onChange(
                      typeof e === "number"
                        ? e
                        : parseFloat(e.target.value) || 0
                    )
                  }
                  min={-180}
                  max={180}
                  step={1}
                />
              )}
            />
            <Form.Item
              control={form.control}
              name="angleVj"
              render={({ field }) => (
                <Input
                  type="number"
                  title="Ângulo Vj (graus)"
                  value={field.value}
                  onChange={(e: any) =>
                    field.onChange(
                      typeof e === "number"
                        ? e
                        : parseFloat(e.target.value) || 0
                    )
                  }
                  min={-180}
                  max={180}
                  step={1}
                />
              )}
            />
            <Form.Item
              control={form.control}
              name="angleVk"
              render={({ field }) => (
                <Input
                  type="number"
                  title="Ângulo Vk (graus)"
                  value={field.value}
                  onChange={(e: any) =>
                    field.onChange(
                      typeof e === "number"
                        ? e
                        : parseFloat(e.target.value) || 0
                    )
                  }
                  min={-180}
                  max={180}
                  step={1}
                />
              )}
            />
            <Form.Item
              control={form.control}
              name="Vn"
              render={({ field }) => (
                <Input
                  type="number"
                  title="Tensão Nominal Vn (kV)"
                  value={field.value}
                  onChange={(e: any) =>
                    field.onChange(
                      typeof e === "number"
                        ? e
                        : parseFloat(e.target.value) || 0
                    )
                  }
                  min={0}
                  max={1000}
                  step={1}
                />
              )}
            />
            <Form.Item
              control={form.control}
              name="L"
              render={({ field }) => (
                <Input
                  type="number"
                  title="Comprimento L (km)"
                  value={field.value}
                  onChange={(e: any) =>
                    field.onChange(
                      typeof e === "number"
                        ? e
                        : parseFloat(e.target.value) || 0
                    )
                  }
                  min={0}
                  max={10000}
                  step={0.1}
                />
              )}
            />
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">
                Formato da Impedância:
              </label>
              <div className="flex items-center gap-2">
                <span
                  className={`text-xs ${
                    impedanceFormat === "rectangular" ? "font-semibold" : ""
                  }`}
                >
                  Retangular
                </span>
                <Switch
                  checked={impedanceFormat === "polar"}
                  onCheckedChange={(checked) =>
                    handleImpedanceFormatChange(
                      checked ? "polar" : "rectangular"
                    )
                  }
                />
                <span
                  className={`text-xs ${
                    impedanceFormat === "polar" ? "font-semibold" : ""
                  }`}
                >
                  Polar
                </span>
              </div>
            </div>
            {impedanceFormat === "rectangular" ? (
              <>
                <Form.Item
                  control={form.control}
                  name="zR"
                  render={({ field }) => (
                    <Input
                      type="number"
                      title="Resistência R (Ω)"
                      value={field.value}
                      onChange={(e: any) =>
                        field.onChange(
                          typeof e === "number"
                            ? e
                            : parseFloat(e.target.value) || 0
                        )
                      }
                      min={-1000}
                      max={1000}
                      step={0.1}
                    />
                  )}
                />
                <Form.Item
                  control={form.control}
                  name="zX"
                  render={({ field }) => (
                    <Input
                      type="number"
                      title="Reatância X (Ω)"
                      value={field.value}
                      onChange={(e: any) =>
                        field.onChange(
                          typeof e === "number"
                            ? e
                            : parseFloat(e.target.value) || 0
                        )
                      }
                      min={-1000}
                      max={1000}
                      step={0.1}
                    />
                  )}
                />
                <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                  z = {params.zR.toFixed(2)} + j{params.zX.toFixed(2)} Ω
                </div>
              </>
            ) : (
              <>
                <Input
                  type="number"
                  title="Magnitude |Z| (Ω)"
                  value={polarMagnitude}
                  onChange={(e: any) => {
                    handlePolarMagnitudeChange(e.target.value);
                  }}
                  min={0}
                  max={10000}
                  step={0.1}
                />
                <Input
                  type="number"
                  title="Ângulo θ (graus)"
                  value={polarAngle}
                  onChange={(e: any) => {
                    handlePolarAngleChange(e.target.value);
                  }}
                  min={-180}
                  max={180}
                  step={0.1}
                />
                <div className="text-xs text-muted-foreground p-2 bg-muted rounded">
                  z = {polarMagnitudeValue.toFixed(2)}∠
                  {polarAngleValue.toFixed(2)}° Ω
                </div>
              </>
            )}
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <LoadingIcon size={16} />
                  <span>Calculando...</span>
                </div>
              ) : (
                "Calcular"
              )}
            </Button>
          </div>
        </Form.Root>
      </Card.Root>

      <div className="flex-1 items-start">
        <Card.Root className="w-full h-[890px] bg-white">
          <Card.Content className="p-2 h-fit flex flex-col overflow-hidden">
            <div className="w-full h-full overflow-hidden">
              <svg
                viewBox="0 90 950 500"
                className="w-fit h-fit"
                preserveAspectRatio="xMidYMid meet"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <marker
                    id="arrowhead-b"
                    markerWidth="10"
                    markerHeight="7"
                    refX="9"
                    refY="3.5"
                    orient="auto"
                  >
                    <polygon points="0 0, 10 3.5, 0 7" fill="#2563eb" />
                  </marker>
                  <marker
                    id="arrowhead-red-b"
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
                  y2="100"
                  stroke="#000000"
                  strokeWidth="3"
                />
                <line
                  x1="850"
                  y1="450"
                  x2="500"
                  y2="100"
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
                  y1="100"
                  x2="550"
                  y2="100"
                  stroke="#000000"
                  strokeWidth="8"
                />

                <line
                  x1="500"
                  y1="100"
                  x2="500"
                  y2="180"
                  stroke="#000000"
                  strokeWidth="3"
                />

                <GroundIcon x={150} y={450} direction="down" />
                <GroundIcon x={850} y={450} direction="down" />
                <GroundIcon x={500} y={180} direction="down" />

                <g transform="translate(200, 300)">
                  <PhasorPair
                    angleA={params.angleVi}
                    angleB={params.angleVk}
                    labelA="Vi"
                    labelB="Vk"
                    colorA="#2563eb"
                    colorB="#dc2626"
                    markerAId="arrowhead-b"
                    markerBId="arrowhead-red-b"
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
                    markerAId="arrowhead-b"
                    markerBId="arrowhead-red-b"
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
                    markerAId="arrowhead-b"
                    markerBId="arrowhead-red-b"
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
                  y="85"
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
                  y="65"
                  className="text-sm font-medium fill-black"
                  textAnchor="middle"
                >
                  Vk = {params.Vk} kV
                </text>
              </svg>
            </div>
          </Card.Content>
        </Card.Root>
      </div>

      <Modal.Root
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
        onClose={() => setIsModalOpen(false)}
        className="max-w-4xl w-[90vw] max-h-[90vh] overflow-y-auto"
      >
        <Modal.Header>
          <h2 className="text-xl font-semibold">Resultados do Cálculo</h2>
        </Modal.Header>
        <Modal.Content>
          <div className="space-y-4">
            {results && inputData && tableData.length > 0 && (
              <div className="space-y-4">
                <Table.Root
                  columns={tableColumns}
                  data={tableData}
                  pagination={false}
                  className="w-full"
                >
                  <Table.Header />
                  <Table.Rows />
                </Table.Root>
              </div>
            )}
          </div>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};

export default PowerSystemDiagramB;
