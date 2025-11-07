"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Form } from "@/components/ui/Form";
import { Modal } from "@/components/ui/Modal";
import { LoadingIcon } from "@/components/ui/Icons/LoadingIcon";
import GroundIcon from "../GroundIcon";
import PhasorPair from "../PhasorPair";
import { powerSystemSchemaB } from "./schema";
import { PowerSystemParamsB, PowerSystemDiagramBProps } from "./types";
import { getComplexFromRectangular, getComplexFromPolar } from "./utils";
import {
  calculatePowerFlowB,
  PowerFlowResultsB,
  ResultRowB,
  PowerSystemParamsDecimalB,
} from "./calculations";
import { Table } from "@/components/ui/Table";
import Decimal from "decimal.js";
import { PI } from "@/lib/constants";
import { useImpedanceFormat } from "../ImpedanceFormatContext";

export const PowerSystemDiagramB: React.FC<PowerSystemDiagramBProps> = ({
  className = "",
  initialValues,
}) => {
  const { impedanceFormat } = useImpedanceFormat();
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
      zR_ik: initialValues?.zR_ik ?? 5,
      zX_ik: initialValues?.zX_ik ?? 40,
      zR_jk: initialValues?.zR_jk ?? 5,
      zX_jk: initialValues?.zX_jk ?? 40,
      zR_ij: initialValues?.zR_ij ?? 5,
      zX_ij: initialValues?.zX_ij ?? 40,
    },
  });

  const params = form.watch();

  const complexIk = getComplexFromRectangular(params.zR_ik, params.zX_ik);
  const complexJk = getComplexFromRectangular(params.zR_jk, params.zX_jk);
  const complexIj = getComplexFromRectangular(params.zR_ij, params.zX_ij);

  const [polarMagnitudeIk, setPolarMagnitudeIk] = useState<string>("");
  const [polarAngleIk, setPolarAngleIk] = useState<string>("");
  const [polarMagnitudeJk, setPolarMagnitudeJk] = useState<string>("");
  const [polarAngleJk, setPolarAngleJk] = useState<string>("");
  const [polarMagnitudeIj, setPolarMagnitudeIj] = useState<string>("");
  const [polarAngleIj, setPolarAngleIj] = useState<string>("");

  const polarMagnitudeValueIk = new Decimal(complexIk.abs());
  const polarAngleValueIk = new Decimal(complexIk.arg()).mul(180).div(PI);
  const polarMagnitudeValueJk = new Decimal(complexJk.abs());
  const polarAngleValueJk = new Decimal(complexJk.arg()).mul(180).div(PI);
  const polarMagnitudeValueIj = new Decimal(complexIj.abs());
  const polarAngleValueIj = new Decimal(complexIj.arg()).mul(180).div(PI);

  useEffect(() => {
    if (impedanceFormat === "polar") {
      setPolarMagnitudeIk(polarMagnitudeValueIk.toDecimalPlaces(2).toString());
      setPolarAngleIk(polarAngleValueIk.toDecimalPlaces(2).toString());
      setPolarMagnitudeJk(polarMagnitudeValueJk.toDecimalPlaces(2).toString());
      setPolarAngleJk(polarAngleValueJk.toDecimalPlaces(2).toString());
      setPolarMagnitudeIj(polarMagnitudeValueIj.toDecimalPlaces(2).toString());
      setPolarAngleIj(polarAngleValueIj.toDecimalPlaces(2).toString());
    }
  }, [
    params.zR_ik,
    params.zX_ik,
    params.zR_jk,
    params.zX_jk,
    params.zR_ij,
    params.zX_ij,
    impedanceFormat,
    polarMagnitudeValueIk,
    polarAngleValueIk,
    polarMagnitudeValueJk,
    polarAngleValueJk,
    polarMagnitudeValueIj,
    polarAngleValueIj,
  ]);

  const handlePolarMagnitudeChangeIk = (value: string) => {
    setPolarMagnitudeIk(value);
    try {
      const magnitude = new Decimal(value || "0");
      const angle = new Decimal(polarAngleIk || "0");
      const complex = getComplexFromPolar(magnitude, angle);
      form.setValue("zR_ik", complex.re);
      form.setValue("zX_ik", complex.im);
    } catch (e) {}
  };

  const handlePolarAngleChangeIk = (value: string) => {
    setPolarAngleIk(value);
    try {
      const magnitude = new Decimal(polarMagnitudeIk || "0");
      const angle = new Decimal(value || "0");
      const complex = getComplexFromPolar(magnitude, angle);
      form.setValue("zR_ik", complex.re);
      form.setValue("zX_ik", complex.im);
    } catch (e) {}
  };

  const handlePolarMagnitudeChangeJk = (value: string) => {
    setPolarMagnitudeJk(value);
    try {
      const magnitude = new Decimal(value || "0");
      const angle = new Decimal(polarAngleJk || "0");
      const complex = getComplexFromPolar(magnitude, angle);
      form.setValue("zR_jk", complex.re);
      form.setValue("zX_jk", complex.im);
    } catch (e) {}
  };

  const handlePolarAngleChangeJk = (value: string) => {
    setPolarAngleJk(value);
    try {
      const magnitude = new Decimal(polarMagnitudeJk || "0");
      const angle = new Decimal(value || "0");
      const complex = getComplexFromPolar(magnitude, angle);
      form.setValue("zR_jk", complex.re);
      form.setValue("zX_jk", complex.im);
    } catch (e) {}
  };

  const handlePolarMagnitudeChangeIj = (value: string) => {
    setPolarMagnitudeIj(value);
    try {
      const magnitude = new Decimal(value || "0");
      const angle = new Decimal(polarAngleIj || "0");
      const complex = getComplexFromPolar(magnitude, angle);
      form.setValue("zR_ij", complex.re);
      form.setValue("zX_ij", complex.im);
    } catch (e) {}
  };

  const handlePolarAngleChangeIj = (value: string) => {
    setPolarAngleIj(value);
    try {
      const magnitude = new Decimal(polarMagnitudeIj || "0");
      const angle = new Decimal(value || "0");
      const complex = getComplexFromPolar(magnitude, angle);
      form.setValue("zR_ij", complex.re);
      form.setValue("zX_ij", complex.im);
    } catch (e) {}
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
        zR_ik: new Decimal(data.zR_ik),
        zX_ik: new Decimal(data.zX_ik),
        zR_jk: new Decimal(data.zR_jk),
        zX_jk: new Decimal(data.zX_jk),
        zR_ij: new Decimal(data.zR_ij),
        zX_ij: new Decimal(data.zX_ij),
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
        valor: results.Pij.toDecimalPlaces(10).toString(),
        unidade: "MW",
      },
      {
        parametro: "Pji",
        valor: results.Pji.toDecimalPlaces(10).toString(),
        unidade: "MW",
      },
      {
        parametro: "ΔPij",
        valor: results.deltaPij.toDecimalPlaces(10).toString(),
        unidade: "MW",
      },
      {
        parametro: "Pik",
        valor: results.Pik.toDecimalPlaces(10).toString(),
        unidade: "MW",
      },
      {
        parametro: "Pki",
        valor: results.Pki.toDecimalPlaces(10).toString(),
        unidade: "MW",
      },
      {
        parametro: "ΔPik",
        valor: results.deltaPik.toDecimalPlaces(10).toString(),
        unidade: "MW",
      },
      {
        parametro: "Pjk",
        valor: results.Pjk.toDecimalPlaces(10).toString(),
        unidade: "MW",
      },
      {
        parametro: "Pkj",
        valor: results.Pkj.toDecimalPlaces(10).toString(),
        unidade: "MW",
      },
      {
        parametro: "ΔPjk",
        valor: results.deltaPjk.toDecimalPlaces(10).toString(),
        unidade: "MW",
      },
      {
        parametro: "Qij",
        valor: results.Qij.toDecimalPlaces(10).toString(),
        unidade: "MVAr",
      },
      {
        parametro: "Qji",
        valor: results.Qji.toDecimalPlaces(10).toString(),
        unidade: "MVAr",
      },
      {
        parametro: "ΔQij",
        valor: results.deltaQij.toDecimalPlaces(10).toString(),
        unidade: "MVAr",
      },
      {
        parametro: "Qik",
        valor: results.Qik.toDecimalPlaces(10).toString(),
        unidade: "MVAr",
      },
      {
        parametro: "Qki",
        valor: results.Qki.toDecimalPlaces(10).toString(),
        unidade: "MVAr",
      },
      {
        parametro: "ΔQik",
        valor: results.deltaQik.toDecimalPlaces(10).toString(),
        unidade: "MVAr",
      },
      {
        parametro: "Qjk",
        valor: results.Qjk.toDecimalPlaces(10).toString(),
        unidade: "MVAr",
      },
      {
        parametro: "Qkj",
        valor: results.Qkj.toDecimalPlaces(10).toString(),
        unidade: "MVAr",
      },
      {
        parametro: "ΔQjk",
        valor: results.deltaQjk.toDecimalPlaces(10).toString(),
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
    const initialComplexIk = getComplexFromRectangular(
      initialValues?.zR_ik ?? 5,
      initialValues?.zX_ik ?? 40
    );
    const initialComplexJk = getComplexFromRectangular(
      initialValues?.zR_jk ?? 5,
      initialValues?.zX_jk ?? 40
    );
    const initialComplexIj = getComplexFromRectangular(
      initialValues?.zR_ij ?? 5,
      initialValues?.zX_ij ?? 40
    );

    const magnitudeIk = new Decimal(initialComplexIk.abs());
    const angleIk = new Decimal(initialComplexIk.arg()).mul(180).div(PI);
    setPolarMagnitudeIk(magnitudeIk.toDecimalPlaces(2).toString());
    setPolarAngleIk(angleIk.toDecimalPlaces(2).toString());

    const magnitudeJk = new Decimal(initialComplexJk.abs());
    const angleJk = new Decimal(initialComplexJk.arg()).mul(180).div(PI);
    setPolarMagnitudeJk(magnitudeJk.toDecimalPlaces(2).toString());
    setPolarAngleJk(angleJk.toDecimalPlaces(2).toString());

    const magnitudeIj = new Decimal(initialComplexIj.abs());
    const angleIj = new Decimal(initialComplexIj.arg()).mul(180).div(PI);
    setPolarMagnitudeIj(magnitudeIj.toDecimalPlaces(2).toString());
    setPolarAngleIj(angleIj.toDecimalPlaces(2).toString());
  }, []);

  return (
    <div className={`flex gap-6 w-full h-fit ${className}`}>
      <Card.Root className="w-200 h-fit overflow-y-auto">
        <Card.Header>
          <h2 className="text-xl font-semibold">Parâmetros do Sistema</h2>
        </Card.Header>
        <Form.Root form={form} onSubmit={handleCalculate}>
          <div className="grid grid-cols-2 gap-4 p-4">
            <Form.Item
              control={form.control}
              name="Vi"
              render={({ field }) => (
                <Input
                  type="number"
                  title="Tensão Vi (kV)"
                  value={field.value}
                  onChange={(e: any) =>
                    field.onChange(typeof e === "number" ? e : 0)
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
                    field.onChange(typeof e === "number" ? e : 0)
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
                    field.onChange(typeof e === "number" ? e : 0)
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
                    field.onChange(typeof e === "number" ? e : 0)
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
                    field.onChange(typeof e === "number" ? e : 0)
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
                    field.onChange(typeof e === "number" ? e : 0)
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
                    field.onChange(typeof e === "number" ? e : 0)
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
                    field.onChange(typeof e === "number" ? e : 0)
                  }
                  min={0}
                  max={10000}
                  step={0.1}
                />
              )}
            />
            <div className="border-t pt-4 space-y-4 col-span-2">
              <h3 className="text-sm font-semibold">Impedâncias</h3>

              <div className="space-y-2">
                <p className="text-xs font-medium text-primary">Linha i-k:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Form.Item
                    control={form.control}
                    name="zR_ik"
                    render={({ field }) => (
                      <Input
                        type="number"
                        title="R (Ω)"
                        value={field.value}
                        onChange={(e: any) =>
                          field.onChange(typeof e === "number" ? e : 0)
                        }
                        min={-1000}
                        max={1000}
                        step={0.1}
                      />
                    )}
                  />
                  <Form.Item
                    control={form.control}
                    name="zX_ik"
                    render={({ field }) => (
                      <Input
                        type="number"
                        title="X (Ω)"
                        value={field.value}
                        onChange={(e: any) =>
                          field.onChange(typeof e === "number" ? e : 0)
                        }
                        min={-1000}
                        max={1000}
                        step={0.1}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-primary">Linha j-k:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Form.Item
                    control={form.control}
                    name="zR_jk"
                    render={({ field }) => (
                      <Input
                        type="number"
                        title="R (Ω)"
                        value={field.value}
                        onChange={(e: any) =>
                          field.onChange(typeof e === "number" ? e : 0)
                        }
                        min={-1000}
                        max={1000}
                        step={0.1}
                      />
                    )}
                  />
                  <Form.Item
                    control={form.control}
                    name="zX_jk"
                    render={({ field }) => (
                      <Input
                        type="number"
                        title="X (Ω)"
                        value={field.value}
                        onChange={(e: any) =>
                          field.onChange(typeof e === "number" ? e : 0)
                        }
                        min={-1000}
                        max={1000}
                        step={0.1}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-primary">Linha i-j:</p>
                <div className="grid grid-cols-2 gap-2">
                  <Form.Item
                    control={form.control}
                    name="zR_ij"
                    render={({ field }) => (
                      <Input
                        type="number"
                        title="R (Ω)"
                        value={field.value}
                        onChange={(e: any) =>
                          field.onChange(typeof e === "number" ? e : 0)
                        }
                        min={-1000}
                        max={1000}
                        step={0.1}
                      />
                    )}
                  />
                  <Form.Item
                    control={form.control}
                    name="zX_ij"
                    render={({ field }) => (
                      <Input
                        type="number"
                        title="X (Ω)"
                        value={field.value}
                        onChange={(e: any) =>
                          field.onChange(typeof e === "number" ? e : 0)
                        }
                        min={-1000}
                        max={1000}
                        step={0.1}
                      />
                    )}
                  />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full col-span-2" disabled={isLoading}>
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
                  <marker
                    id="current-direction-b"
                    markerWidth="12"
                    markerHeight="10"
                    refX="6"
                    refY="5"
                    orient="auto"
                  >
                    <polygon points="0 0, 12 5, 0 10" fill="#16a34a" />
                  </marker>
                </defs>

                <line
                  x1="170"
                  y1="450"
                  x2="170"
                  y2="475"
                  stroke="#000000"
                  strokeWidth="3"
                />
                <line
                  x1="170"
                  y1="475"
                  x2="480"
                  y2="125"
                  stroke="#000000"
                  strokeWidth="3"
                />
                <line
                  x1="480"
                  y1="125"
                  x2="500"
                  y2="100"
                  stroke="#000000"
                  strokeWidth="3"
                />

                <line
                  x1="830"
                  y1="450"
                  x2="830"
                  y2="475"
                  stroke="#000000"
                  strokeWidth="3"
                />
                <line
                  x1="830"
                  y1="475"
                  x2="520"
                  y2="125"
                  stroke="#000000"
                  strokeWidth="3"
                />
                <line
                  x1="520"
                  y1="125"
                  x2="500"
                  y2="100"
                  stroke="#000000"
                  strokeWidth="3"
                />

                <line
                  x1="170"
                  y1="450"
                  x2="830"
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
                <GroundIcon x={130} y={450} direction="down" />

                <line
                  x1="800"
                  y1="450"
                  x2="900"
                  y2="450"
                  stroke="#000000"
                  strokeWidth="8"
                />
                <GroundIcon x={870} y={450} direction="down" />

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
                <GroundIcon x={500} y={180} direction="down" />

                {params.Vi === params.Vk && params.angleVi === params.angleVk ? null : params.Vi > params.Vk || (params.Vi === params.Vk && params.angleVi > params.angleVk) ? (
                  <>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((delay, idx) => (
                      <React.Fragment key={`flow-ik-${idx}`}>
                        <circle cx="0" cy="0" r="3" fill="#16a34a" opacity="0.8">
                          <animateMotion
                            path="M 170 450 L 170 475 L 480 125 L 500 100"
                            dur="10s"
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((delay, idx) => (
                      <React.Fragment key={`flow-ki-${idx}`}>
                        <circle cx="0" cy="0" r="3" fill="#16a34a" opacity="0.8">
                          <animateMotion
                            path="M 500 100 L 480 125 L 170 475 L 170 450"
                            dur="10s"
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      </React.Fragment>
                    ))}
                  </>
                )}

                {params.Vj === params.Vk && params.angleVj === params.angleVk ? null : params.Vj > params.Vk || (params.Vj === params.Vk && params.angleVj > params.angleVk) ? (
                  <>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((delay, idx) => (
                      <React.Fragment key={`flow-jk-${idx}`}>
                        <circle cx="0" cy="0" r="3" fill="#16a34a" opacity="0.8">
                          <animateMotion
                            path="M 830 450 L 830 475 L 520 125 L 500 100"
                            dur="10s"
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((delay, idx) => (
                      <React.Fragment key={`flow-kj-${idx}`}>
                        <circle cx="0" cy="0" r="3" fill="#16a34a" opacity="0.8">
                          <animateMotion
                            path="M 500 100 L 520 125 L 830 475 L 830 450"
                            dur="10s"
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      </React.Fragment>
                    ))}
                  </>
                )}

                {params.Vi === params.Vj && params.angleVi === params.angleVj ? null : params.Vi > params.Vj || (params.Vi === params.Vj && params.angleVi > params.angleVj) ? (
                  <>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((delay, idx) => (
                      <React.Fragment key={`flow-ij-${idx}`}>
                        <circle cx="0" cy="0" r="3" fill="#16a34a" opacity="0.8">
                          <animateMotion
                            path="M 170 450 L 830 450"
                            dur="10s"
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      </React.Fragment>
                    ))}
                  </>
                ) : (
                  <>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((delay, idx) => (
                      <React.Fragment key={`flow-ji-${idx}`}>
                        <circle cx="0" cy="0" r="3" fill="#16a34a" opacity="0.8">
                          <animateMotion
                            path="M 830 450 L 170 450"
                            dur="10s"
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      </React.Fragment>
                    ))}
                  </>
                )}

                <rect
                  x="200"
                  y="220"
                  width="150"
                  height="40"
                  fill="white"
                  stroke="#000000"
                  strokeWidth="1"
                  rx="4"
                />
                <text
                  x="275"
                  y="235"
                  className="text-xs font-semibold fill-black"
                  textAnchor="middle"
                >
                  Z(i-k)
                </text>
                <text
                  x="275"
                  y="252"
                  className="text-xs fill-black"
                  textAnchor="middle"
                >
                  {new Decimal(params.zR_ik).toDecimalPlaces(2).toString()}+j
                  {new Decimal(params.zX_ik).toDecimalPlaces(2).toString()}Ω
                </text>

                <rect
                  x="600"
                  y="220"
                  width="150"
                  height="40"
                  fill="white"
                  stroke="#000000"
                  strokeWidth="1"
                  rx="4"
                />
                <text
                  x="675"
                  y="235"
                  className="text-xs font-semibold fill-black"
                  textAnchor="middle"
                >
                  Z(j-k)
                </text>
                <text
                  x="675"
                  y="252"
                  className="text-xs fill-black"
                  textAnchor="middle"
                >
                  {new Decimal(params.zR_jk).toDecimalPlaces(2).toString()}+j
                  {new Decimal(params.zX_jk).toDecimalPlaces(2).toString()}Ω
                </text>

                <rect
                  x="425"
                  y="460"
                  width="150"
                  height="40"
                  fill="white"
                  stroke="#000000"
                  strokeWidth="1"
                  rx="4"
                />
                <text
                  x="500"
                  y="475"
                  className="text-xs font-semibold fill-black"
                  textAnchor="middle"
                >
                  Z(i-j)
                </text>
                <text
                  x="500"
                  y="492"
                  className="text-xs fill-black"
                  textAnchor="middle"
                >
                  {new Decimal(params.zR_ij).toDecimalPlaces(2).toString()}+j
                  {new Decimal(params.zX_ij).toDecimalPlaces(2).toString()}Ω
                </text>

                <text
                  x="275"
                  y="200"
                  className="text-sm font-bold"
                  fill="#16a34a"
                  textAnchor="middle"
                >
                  {params.Vi === params.Vk && params.angleVi === params.angleVk ? "" : params.Vi > params.Vk || (params.Vi === params.Vk && params.angleVi > params.angleVk) ? "I(i→k)" : "I(k→i)"}
                </text>

                <text
                  x="675"
                  y="200"
                  className="text-sm font-bold"
                  fill="#16a34a"
                  textAnchor="middle"
                >
                  {params.Vj === params.Vk && params.angleVj === params.angleVk ? "" : params.Vj > params.Vk || (params.Vj === params.Vk && params.angleVj > params.angleVk) ? "I(j→k)" : "I(k→j)"}
                </text>

                <text
                  x="500"
                  y="440"
                  className="text-sm font-bold"
                  fill="#16a34a"
                  textAnchor="middle"
                >
                  {params.Vi === params.Vj && params.angleVi === params.angleVj ? "" : params.Vi > params.Vj || (params.Vi === params.Vj && params.angleVi > params.angleVj) ? "I(i→j)" : "I(j→i)"}
                </text>

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
