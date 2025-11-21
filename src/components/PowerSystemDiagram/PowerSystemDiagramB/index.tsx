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
import { getComplexFromRectangular, getComplexFromPolar } from "../utils";
import {
  calculatePowerFlowB,
  PowerFlowResultsB,
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
  };

  interface TableRowB {
    parametro1: string;
    valor1: string;
    unidade1: string;
    parametro2: string;
    valor2: string;
    unidade2: string;
    parametro3: string;
    valor3: string;
    unidade3: string;
  }

  const tableData: TableRowB[] = React.useMemo(() => {
    if (!inputData || !results) return [];

    const groups = [
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
      [
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
      ],
    ];

    const rows: TableRowB[] = [];

    for (const group of groups) {
      const item1 = group[0] || { parametro: "", valor: "", unidade: "" };
      const item2 = group[1] || { parametro: "", valor: "", unidade: "" };
      const item3 = group[2] || { parametro: "", valor: "", unidade: "" };

      rows.push({
        parametro1: item1.parametro,
        valor1: item1.valor,
        unidade1: item1.unidade,
        parametro2: item2.parametro,
        valor2: item2.valor,
        unidade2: item2.unidade,
        parametro3: item3.parametro,
        valor3: item3.valor,
        unidade3: item3.unidade,
      });
    }

    return rows;
  }, [inputData, results]);

  const tableColumns = [
    {
      key: "parametro1" as keyof TableRowB,
      title: "Parâmetro",
      width: "auto",
      align: "center" as const,
      sortable: false,
      searchable: false,
      render: (value: any, row: TableRowB) => {
        if (row.parametro1 === "separator") {
          return (
            <div className="relative -mx-4">
              <div
                className="absolute left-0 right-0 top-0 h-px bg-gray-300"
                style={{ left: "-100vw", right: "-100vw", width: "200vw" }}
              ></div>
            </div>
          );
        }
        return <span className="font-semibold">{String(value) || ""}</span>;
      },
    },
    {
      key: "valor1" as keyof TableRowB,
      title: "Valor",
      width: "auto",
      align: "center" as const,
      sortable: false,
      searchable: false,
      render: (value: any, row: TableRowB) => {
        if (row.parametro1 === "separator") return null;
        return (
          <span className={row.parametro1.startsWith("Δ") ? "font-bold" : ""}>
            {String(value) || ""}
          </span>
        );
      },
    },
    {
      key: "unidade1" as keyof TableRowB,
      title: "Unidade",
      width: "auto",
      align: "center" as const,
      sortable: false,
      searchable: false,
      render: (value: any, row: TableRowB) => {
        if (row.parametro1 === "separator") return null;
        return (
          <span className="text-muted-foreground">{String(value) || ""}</span>
        );
      },
    },
    {
      key: "parametro2" as keyof TableRowB,
      title: "Parâmetro",
      width: "auto",
      align: "center" as const,
      sortable: false,
      searchable: false,
      render: (value: any, row: TableRowB) => {
        if (row.parametro1 === "separator") return null;
        return <span className="font-semibold">{String(value) || ""}</span>;
      },
    },
    {
      key: "valor2" as keyof TableRowB,
      title: "Valor",
      width: "auto",
      align: "center" as const,
      sortable: false,
      searchable: false,
      render: (value: any, row: TableRowB) => {
        if (row.parametro1 === "separator") return null;
        return (
          <span className={row.parametro2.startsWith("Δ") ? "font-bold" : ""}>
            {String(value) || ""}
          </span>
        );
      },
    },
    {
      key: "unidade2" as keyof TableRowB,
      title: "Unidade",
      width: "auto",
      align: "center" as const,
      sortable: false,
      searchable: false,
      render: (value: any, row: TableRowB) => {
        if (row.parametro1 === "separator") return null;
        return (
          <span className="text-muted-foreground">{String(value) || ""}</span>
        );
      },
    },
    {
      key: "parametro3" as keyof TableRowB,
      title: "Parâmetro",
      width: "auto",
      align: "center" as const,
      sortable: false,
      searchable: false,
      render: (value: any, row: TableRowB) => {
        if (row.parametro1 === "separator") return null;
        return <span className="font-semibold">{String(value) || ""}</span>;
      },
    },
    {
      key: "valor3" as keyof TableRowB,
      title: "Valor",
      width: "auto",
      align: "center" as const,
      sortable: false,
      searchable: false,
      render: (value: any, row: TableRowB) => {
        if (row.parametro1 === "separator") return null;
        return (
          <span className={row.parametro3.startsWith("Δ") ? "font-bold" : ""}>
            {String(value) || ""}
          </span>
        );
      },
    },
    {
      key: "unidade3" as keyof TableRowB,
      title: "Unidade",
      width: "auto",
      align: "center" as const,
      sortable: false,
      searchable: false,
      render: (value: any, row: TableRowB) => {
        if (row.parametro1 === "separator") return null;
        return (
          <span className="text-muted-foreground">{String(value) || ""}</span>
        );
      },
    },
  ];

  const nodePositions = {
    i: { x: 190, y: 470 },
    j: { x: 810, y: 470 },
    k: { x: 500, y: 160 },
  };

  const busHalfWidth = 50;
  const topBusHalfWidth = 50;
  const topConnectionOffset = 22;
  const busConnectionOffset = 22;

  const busSegments = {
    i: {
      start: { x: nodePositions.i.x - busHalfWidth, y: nodePositions.i.y },
      end: { x: nodePositions.i.x + busHalfWidth, y: nodePositions.i.y },
    },
    j: {
      start: { x: nodePositions.j.x - busHalfWidth, y: nodePositions.j.y },
      end: { x: nodePositions.j.x + busHalfWidth, y: nodePositions.j.y },
    },
  };

  const topBusSegment = {
    start: { x: nodePositions.k.x - topBusHalfWidth, y: nodePositions.k.y },
    end: { x: nodePositions.k.x + topBusHalfWidth, y: nodePositions.k.y },
  };

  const topConnections = {
    left: {
      x: topBusSegment.start.x + topConnectionOffset,
      y: topBusSegment.start.y,
    },
    right: {
      x: topBusSegment.end.x - topConnectionOffset,
      y: topBusSegment.end.y,
    },
    ground: {
      x: nodePositions.k.x,
      y: topBusSegment.start.y,
    },
  };

  const busConnections = {
    i: {
      ik: {
        x: busSegments.i.end.x - busConnectionOffset,
        y: busSegments.i.end.y,
      },
    },
    j: {
      jk: {
        x: busSegments.j.start.x + busConnectionOffset,
        y: busSegments.j.start.y,
      },
    },
  };

  const branchSegments = {
    ik: {
      start: busConnections.i.ik,
      end: topConnections.left,
    },
    jk: {
      start: busConnections.j.jk,
      end: topConnections.right,
    },
    ij: {
      start: { x: busSegments.i.end.x, y: busSegments.i.end.y },
      end: { x: busSegments.j.start.x, y: busSegments.j.start.y },
    },
  };

  const getMidpoint = (segment: {
    start: { x: number; y: number };
    end: { x: number; y: number };
  }) => ({
    x: (segment.start.x + segment.end.x) / 2,
    y: (segment.start.y + segment.end.y) / 2,
  });

  const branchMidpoints = {
    ik: getMidpoint(branchSegments.ik),
    jk: getMidpoint(branchSegments.jk),
    ij: getMidpoint(branchSegments.ij),
  };

  const impedanceBoxSize = { width: 170, height: 48 };

  const branchBoxes = {
    ik: {
      x: branchMidpoints.ik.x - impedanceBoxSize.width / 2,
      y: branchMidpoints.ik.y - impedanceBoxSize.height / 2,
    },
    jk: {
      x: branchMidpoints.jk.x - impedanceBoxSize.width / 2,
      y: branchMidpoints.jk.y - impedanceBoxSize.height / 2,
    },
    ij: {
      x: branchMidpoints.ij.x - impedanceBoxSize.width / 2,
      y: branchMidpoints.ij.y - impedanceBoxSize.height / 2,
    },
  };

  const currentLabelOffsets = {
    ik: { x: -15, y: -30 },
    jk: { x: 15, y: -30 },
    ij: { x: 0, y: -30 },
  };

  const groundPositions = {
    i: { x: busSegments.i.start.x + 30, y: nodePositions.i.y },
    j: { x: busSegments.j.end.x - 30, y: nodePositions.j.y },
    k: { x: nodePositions.k.x, y: nodePositions.k.y },
  };

  const branchPaths = {
    ik: `M ${branchSegments.ik.start.x} ${branchSegments.ik.start.y} L ${branchSegments.ik.end.x} ${branchSegments.ik.end.y}`,
    ki: `M ${branchSegments.ik.end.x} ${branchSegments.ik.end.y} L ${branchSegments.ik.start.x} ${branchSegments.ik.start.y}`,
    jk: `M ${branchSegments.jk.start.x} ${branchSegments.jk.start.y} L ${branchSegments.jk.end.x} ${branchSegments.jk.end.y}`,
    kj: `M ${branchSegments.jk.end.x} ${branchSegments.jk.end.y} L ${branchSegments.jk.start.x} ${branchSegments.jk.start.y}`,
    ij: `M ${branchSegments.ij.start.x} ${branchSegments.ij.start.y} L ${branchSegments.ij.end.x} ${branchSegments.ij.end.y}`,
    ji: `M ${branchSegments.ij.end.x} ${branchSegments.ij.end.y} L ${branchSegments.ij.start.x} ${branchSegments.ij.start.y}`,
  };

  const flowOffsets = {
    ik: { x: 0, y: 0 },
    ki: { x: 0, y: 0 },
    jk: { x: 0, y: 0 },
    kj: { x: 0, y: 0 },
    ij: { x: 0, y: 0 },
    ji: { x: 0, y: 0 },
  };

  const phasorOffsets = {
    ik: { x: -70, y: -120 },
    jk: { x: 70, y: -120 },
    ij: { x: 0, y: 110 },
  };

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
      <Card.Root className="w-150 h-fit overflow-y-auto">
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
            <div className="space-y-4 col-span-2">
              <div className="space-y-2">
                <p className="text-xs font-medium text-primary">Linha i-j:</p>
                {impedanceFormat === "rectangular" ? (
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
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      title="|Z| (Ω)"
                      value={polarMagnitudeIj}
                      onChange={
                        ((value: number) => {
                          handlePolarMagnitudeChangeIj(value.toString());
                        }) as any
                      }
                      min={0}
                      max={10000}
                      step={0.1}
                    />
                    <Input
                      type="number"
                      title="θ (graus)"
                      value={polarAngleIj}
                      onChange={
                        ((value: number) => {
                          handlePolarAngleChangeIj(value.toString());
                        }) as any
                      }
                      min={-180}
                      max={180}
                      step={0.1}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-primary">Linha j-k:</p>
                {impedanceFormat === "rectangular" ? (
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
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      title="|Z| (Ω)"
                      value={polarMagnitudeJk}
                      onChange={
                        ((value: number) => {
                          handlePolarMagnitudeChangeJk(value.toString());
                        }) as any
                      }
                      min={0}
                      max={10000}
                      step={0.1}
                    />
                    <Input
                      type="number"
                      title="θ (graus)"
                      value={polarAngleJk}
                      onChange={
                        ((value: number) => {
                          handlePolarAngleChangeJk(value.toString());
                        }) as any
                      }
                      min={-180}
                      max={180}
                      step={0.1}
                    />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium text-primary">Linha i-k:</p>
                {impedanceFormat === "rectangular" ? (
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
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="number"
                      title="|Z| (Ω)"
                      value={polarMagnitudeIk}
                      onChange={
                        ((value: number) => {
                          handlePolarMagnitudeChangeIk(value.toString());
                        }) as any
                      }
                      min={0}
                      max={10000}
                      step={0.1}
                    />
                    <Input
                      type="number"
                      title="θ (graus)"
                      value={polarAngleIk}
                      onChange={
                        ((value: number) => {
                          handlePolarAngleChangeIk(value.toString());
                        }) as any
                      }
                      min={-180}
                      max={180}
                      step={0.1}
                    />
                  </div>
                )}
              </div>
            </div>
            <Button
              type="submit"
              className="w-full col-span-2"
              disabled={isLoading}
            >
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
        <Card.Root className="w-full h-[770px] bg-white">
          <Card.Content className="p-2 h-fit flex flex-col overflow-hidden">
            <div className="w-full h-full overflow-hidden">
              <svg
                viewBox="0 100 970 650"
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
                  x1={branchSegments.ik.start.x}
                  y1={branchSegments.ik.start.y}
                  x2={branchSegments.ik.end.x}
                  y2={branchSegments.ik.end.y}
                  stroke="#000000"
                  strokeWidth="3"
                />
                <line
                  x1={branchSegments.jk.start.x}
                  y1={branchSegments.jk.start.y}
                  x2={branchSegments.jk.end.x}
                  y2={branchSegments.jk.end.y}
                  stroke="#000000"
                  strokeWidth="3"
                />
                <line
                  x1={branchSegments.ij.start.x}
                  y1={branchSegments.ij.start.y}
                  x2={branchSegments.ij.end.x}
                  y2={branchSegments.ij.end.y}
                  stroke="#000000"
                  strokeWidth="3"
                />

                {params.Vi === params.Vk &&
                params.angleVi === params.angleVk ? null : params.Vi >
                    params.Vk ||
                  (params.Vi === params.Vk &&
                    params.angleVi > params.angleVk) ? (
                  <>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((delay, idx) => (
                      <React.Fragment key={`flow-ik-${idx}`}>
                        <circle
                          cx="0"
                          cy="0"
                          r="3"
                          fill="#16a34a"
                          opacity="0.8"
                        >
                          <animateMotion
                            path={branchPaths.ik}
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
                        <circle
                          cx="0"
                          cy="0"
                          r="3"
                          fill="#16a34a"
                          opacity="0.8"
                        >
                          <animateMotion
                            path={branchPaths.ki}
                            dur="10s"
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      </React.Fragment>
                    ))}
                  </>
                )}

                {params.Vj === params.Vk &&
                params.angleVj === params.angleVk ? null : params.Vj >
                    params.Vk ||
                  (params.Vj === params.Vk &&
                    params.angleVj > params.angleVk) ? (
                  <>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((delay, idx) => (
                      <React.Fragment key={`flow-jk-${idx}`}>
                        <circle
                          cx="0"
                          cy="0"
                          r="3"
                          fill="#16a34a"
                          opacity="0.8"
                        >
                          <animateMotion
                            path={branchPaths.jk}
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
                        <circle
                          cx="0"
                          cy="0"
                          r="3"
                          fill="#16a34a"
                          opacity="0.8"
                        >
                          <animateMotion
                            path={branchPaths.kj}
                            dur="10s"
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      </React.Fragment>
                    ))}
                  </>
                )}

                {params.Vi === params.Vj &&
                params.angleVi === params.angleVj ? null : params.Vi >
                    params.Vj ||
                  (params.Vi === params.Vj &&
                    params.angleVi > params.angleVj) ? (
                  <>
                    {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((delay, idx) => (
                      <React.Fragment key={`flow-ij-${idx}`}>
                        <circle
                          cx="0"
                          cy="0"
                          r="3"
                          fill="#16a34a"
                          opacity="0.8"
                        >
                          <animateMotion
                            path={branchPaths.ij}
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
                        <circle
                          cx="0"
                          cy="0"
                          r="3"
                          fill="#16a34a"
                          opacity="0.8"
                        >
                          <animateMotion
                            path={branchPaths.ji}
                            dur="10s"
                            begin={`${delay}s`}
                            repeatCount="indefinite"
                          />
                        </circle>
                      </React.Fragment>
                    ))}
                  </>
                )}

                <line
                  x1={busSegments.i.start.x}
                  y1={busSegments.i.start.y}
                  x2={busSegments.i.end.x}
                  y2={busSegments.i.end.y}
                  stroke="#000000"
                  strokeWidth="8"
                />
                <GroundIcon
                  x={groundPositions.i.x}
                  y={groundPositions.i.y}
                  direction="down"
                />

                <line
                  x1={busSegments.j.start.x}
                  y1={busSegments.j.start.y}
                  x2={busSegments.j.end.x}
                  y2={busSegments.j.end.y}
                  stroke="#000000"
                  strokeWidth="8"
                />
                <GroundIcon
                  x={groundPositions.j.x}
                  y={groundPositions.j.y}
                  direction="down"
                />

                <line
                  x1={topBusSegment.start.x}
                  y1={topBusSegment.start.y}
                  x2={topBusSegment.end.x}
                  y2={topBusSegment.end.y}
                  stroke="#000000"
                  strokeWidth="8"
                />
                <GroundIcon
                  x={groundPositions.k.x}
                  y={groundPositions.k.y}
                  direction="down"
                />

                <rect
                  x={branchBoxes.ik.x}
                  y={branchBoxes.ik.y}
                  width={impedanceBoxSize.width}
                  height={impedanceBoxSize.height}
                  fill="white"
                  stroke="#000000"
                  strokeWidth="1"
                  rx="4"
                />
                <text
                  x={branchMidpoints.ik.x}
                  y={branchBoxes.ik.y + 18}
                  className="text-xs font-semibold fill-black"
                  textAnchor="middle"
                >
                  Z(i-k)
                </text>
                <text
                  x={branchMidpoints.ik.x}
                  y={branchBoxes.ik.y + 34}
                  className="text-xs fill-black"
                  textAnchor="middle"
                >
                  {new Decimal(params.zR_ik).toDecimalPlaces(2).toString()}+j
                  {new Decimal(params.zX_ik).toDecimalPlaces(2).toString()}Ω
                </text>

                <rect
                  x={branchBoxes.jk.x}
                  y={branchBoxes.jk.y}
                  width={impedanceBoxSize.width}
                  height={impedanceBoxSize.height}
                  fill="white"
                  stroke="#000000"
                  strokeWidth="1"
                  rx="4"
                />
                <text
                  x={branchMidpoints.jk.x}
                  y={branchBoxes.jk.y + 18}
                  className="text-xs font-semibold fill-black"
                  textAnchor="middle"
                >
                  Z(j-k)
                </text>
                <text
                  x={branchMidpoints.jk.x}
                  y={branchBoxes.jk.y + 34}
                  className="text-xs fill-black"
                  textAnchor="middle"
                >
                  {new Decimal(params.zR_jk).toDecimalPlaces(2).toString()}+j
                  {new Decimal(params.zX_jk).toDecimalPlaces(2).toString()}Ω
                </text>

                <rect
                  x={branchBoxes.ij.x}
                  y={branchBoxes.ij.y}
                  width={impedanceBoxSize.width}
                  height={impedanceBoxSize.height}
                  fill="white"
                  stroke="#000000"
                  strokeWidth="1"
                  rx="4"
                />
                <text
                  x={branchMidpoints.ij.x}
                  y={branchBoxes.ij.y + 18}
                  className="text-xs font-semibold fill-black"
                  textAnchor="middle"
                >
                  Z(i-j)
                </text>
                <text
                  x={branchMidpoints.ij.x}
                  y={branchBoxes.ij.y + 34}
                  className="text-xs fill-black"
                  textAnchor="middle"
                >
                  {new Decimal(params.zR_ij).toDecimalPlaces(2).toString()}+j
                  {new Decimal(params.zX_ij).toDecimalPlaces(2).toString()}Ω
                </text>

                <text
                  x={branchMidpoints.ik.x + currentLabelOffsets.ik.x}
                  y={branchMidpoints.ik.y + currentLabelOffsets.ik.y}
                  className="text-sm font-bold"
                  fill="#16a34a"
                  textAnchor="middle"
                >
                  {params.Vi === params.Vk && params.angleVi === params.angleVk
                    ? ""
                    : params.Vi > params.Vk ||
                      (params.Vi === params.Vk &&
                        params.angleVi > params.angleVk)
                    ? "I(i→k)"
                    : "I(k→i)"}
                </text>

                <text
                  x={branchMidpoints.jk.x + currentLabelOffsets.jk.x}
                  y={branchMidpoints.jk.y + currentLabelOffsets.jk.y}
                  className="text-sm font-bold"
                  fill="#16a34a"
                  textAnchor="middle"
                >
                  {params.Vj === params.Vk && params.angleVj === params.angleVk
                    ? ""
                    : params.Vj > params.Vk ||
                      (params.Vj === params.Vk &&
                        params.angleVj > params.angleVk)
                    ? "I(j→k)"
                    : "I(k→j)"}
                </text>

                <text
                  x={branchMidpoints.ij.x + currentLabelOffsets.ij.x}
                  y={branchMidpoints.ij.y + currentLabelOffsets.ij.y}
                  className="text-sm font-bold"
                  fill="#16a34a"
                  textAnchor="middle"
                >
                  {params.Vi === params.Vj && params.angleVi === params.angleVj
                    ? ""
                    : params.Vi > params.Vj ||
                      (params.Vi === params.Vj &&
                        params.angleVi > params.angleVj)
                    ? "I(i→j)"
                    : "I(j→i)"}
                </text>

                <g
                  transform={`translate(${
                    branchMidpoints.ik.x + phasorOffsets.ik.x
                  }, ${branchMidpoints.ik.y + phasorOffsets.ik.y})`}
                >
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

                <g
                  transform={`translate(${
                    branchMidpoints.jk.x + phasorOffsets.jk.x
                  }, ${branchMidpoints.jk.y + phasorOffsets.jk.y})`}
                >
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

                <g
                  transform={`translate(${
                    branchMidpoints.ij.x + phasorOffsets.ij.x
                  }, ${branchMidpoints.ij.y + phasorOffsets.ij.y})`}
                >
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
                  x={nodePositions.i.x - 10}
                  y={nodePositions.i.y - 32}
                  className="text-sm font-medium fill-black"
                  textAnchor="middle"
                >
                  Vi = {params.Vi}∠{params.angleVi}° kV
                </text>
                <text
                  x={nodePositions.j.x + 10}
                  y={nodePositions.j.y - 32}
                  className="text-sm font-medium fill-black"
                  textAnchor="middle"
                >
                  Vj = {params.Vj}∠{params.angleVj}° kV
                </text>
                <text
                  x={nodePositions.k.x}
                  y={nodePositions.k.y - 32}
                  className="text-sm font-medium fill-black"
                  textAnchor="middle"
                >
                  Vk = {params.Vk}∠{params.angleVk}° kV
                </text>

                <text
                  x={nodePositions.i.x - 10}
                  y={nodePositions.i.y - 14}
                  className="text-lg font-bold fill-black"
                  textAnchor="middle"
                >
                  Barra i
                </text>
                <text
                  x={nodePositions.j.x + 10}
                  y={nodePositions.j.y - 14}
                  className="text-lg font-bold fill-black"
                  textAnchor="middle"
                >
                  Barra j
                </text>
                <text
                  x={nodePositions.k.x}
                  y={nodePositions.k.y - 14}
                  className="text-lg font-bold fill-black"
                  textAnchor="middle"
                >
                  Barra k
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
        className="max-w-7xl w-[95vw] max-h-[95vh] overflow-y-auto"
      >
        <Modal.Header>
          <h2 className="text-xl font-semibold">Resultados do Cálculo</h2>
        </Modal.Header>
        <Modal.Content>
          <div className="space-y-4">
            {results && inputData && tableData.length > 0 && (
              <div className="space-y-4">
                <style
                  dangerouslySetInnerHTML={{
                    __html: `
                    .results-table th:nth-child(3),
                    .results-table th:nth-child(6),
                    .results-table td:nth-child(3),
                    .results-table td:nth-child(6) {
                      border-right: 1px solid #d1d5db !important;
                    }
                  `,
                  }}
                />
                <Table.Root
                  columns={tableColumns}
                  data={tableData}
                  pagination={false}
                  className="w-full results-table"
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
