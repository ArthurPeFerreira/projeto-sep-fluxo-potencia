"use client";

import Image from "next/image";
import logo_ifc from "@/../public/logo_ifc.png";
import { NavbarDiagramSelector } from "./NavbarDiagramSelector";
import { useDiagramType } from "./DiagramTypeContext";
import { useImpedanceFormat } from "./ImpedanceFormatContext";
import { Switch } from "@/components/ui/Switch";
import { DropdownMenu } from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useState, useRef, useMemo } from "react";

const parseMathExpression = (input: string): number | null => {
  if (!input || input.trim() === "") return null;

  let normalized = input.trim().toLowerCase();

  try {
    normalized = normalized.replace(/\s+/g, "");

    normalized = normalized.replace(
      /√\(([^)]+)\)/g,
      (match, expr) => `Math.sqrt(${expr})`
    );
    normalized = normalized.replace(
      /√(\d+(?:\.\d+)?)/g,
      (match, num) => `Math.sqrt(${num})`
    );
    normalized = normalized.replace(
      /sqrt\(([^)]+)\)/g,
      (match, expr) => `Math.sqrt(${expr})`
    );

    normalized = normalized
      .replace(/(\d+)([πp])/g, "$1*$2")
      .replace(/(\))([π])/g, "$1*$2");

    normalized = normalized.replace(/π/g, `(${Math.PI})`);
    normalized = normalized.replace(/pi/g, `(${Math.PI})`);

    normalized = normalized
      .replace(/(\d+)(math\.)/gi, "$1*$2")
      .replace(/(\))(math\.)/gi, "$1*$2")
      .replace(/(\))(\d+)/g, "$1*$2")
      .replace(/(\d+)(\()/g, "$1*$2")
      .replace(/(\))(\()/g, "$1*$2");

    normalized = normalized.replace(
      /(\d+(?:\.\d+)?)\/(\d+(?:\.\d+)?)/g,
      (match, num, den) => `(${num})/(${den})`
    );

    const result = Function(`"use strict"; return (${normalized})`)();
    return typeof result === "number" && !isNaN(result) && isFinite(result)
      ? result
      : null;
  } catch {
    const numValue = parseFloat(input.trim());
    return isNaN(numValue) ? null : numValue;
  }
};

const simplifyRadiansExpression = (value: number): string => {
  const pi = Math.PI;
  const tolerance = 1e-10;

  const piMultiple = value / pi;
  if (Math.abs(piMultiple - Math.round(piMultiple)) < tolerance) {
    const n = Math.round(piMultiple);
    if (n === 0) return "0";
    if (n === 1) return "π";
    if (n === -1) return "-π";
    return `${n}π`;
  }

  const commonFractions = [
    { num: 1, den: 2, str: "π/2" },
    { num: 1, den: 3, str: "π/3" },
    { num: 1, den: 4, str: "π/4" },
    { num: 1, den: 6, str: "π/6" },
    { num: 2, den: 3, str: "2π/3" },
    { num: 3, den: 4, str: "3π/4" },
    { num: 5, den: 6, str: "5π/6" },
    { num: 3, den: 2, str: "3π/2" },
  ];

  for (const frac of commonFractions) {
    const expected = (frac.num * pi) / frac.den;
    if (Math.abs(value - expected) < tolerance) {
      return frac.str;
    }
    if (Math.abs(value + expected) < tolerance) {
      return `-${frac.str}`;
    }
  }

  for (const frac of commonFractions) {
    for (let mult = 2; mult <= 10; mult++) {
      const expected = (mult * frac.num * pi) / frac.den;
      if (Math.abs(value - expected) < tolerance) {
        return `${mult} × ${frac.str}`;
      }
      if (Math.abs(value + expected) < tolerance) {
        return `-${mult} × ${frac.str}`;
      }
    }
  }

  return value.toFixed(6).replace(/\.?0+$/, "");
};

const simplifyDegreesExpression = (value: number): string => {
  const tolerance = 1e-6;
  const rounded = Math.round(value);

  if (Math.abs(value - rounded) < tolerance) {
    return `${rounded}°`;
  }

  const commonDegrees = [30, 45, 60, 90, 120, 135, 150, 180, 270, 360];
  for (const deg of commonDegrees) {
    if (Math.abs(value - deg) < tolerance) {
      return `${deg}°`;
    }
  }

  return `${value.toFixed(4)}°`;
};

export const NavbarContent: React.FC = () => {
  const { selectedDiagram } = useDiagramType();
  const { impedanceFormat, setImpedanceFormat } = useImpedanceFormat();
  const [radiansInput, setRadiansInput] = useState<string>("");
  const [degreesInput, setDegreesInput] = useState<string>("");
  const updatingRef = useRef(false);

  const radiansValue = useMemo(
    () => parseMathExpression(radiansInput),
    [radiansInput]
  );
  const degreesValue = useMemo(
    () => parseMathExpression(degreesInput),
    [degreesInput]
  );

  const radiansExpression = useMemo(() => {
    if (radiansValue === null) return "";
    return simplifyRadiansExpression(radiansValue);
  }, [radiansValue]);

  const degreesExpression = useMemo(() => {
    if (degreesValue === null) return "";
    return simplifyDegreesExpression(degreesValue);
  }, [degreesValue]);

  const handleRadiansInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (updatingRef.current) return;
    const value = e.target.value;
    setRadiansInput(value);

    const numValue = parseMathExpression(value);
    if (numValue !== null) {
      updatingRef.current = true;
      const degValue = (numValue * 180) / Math.PI;
      const simplifiedDeg = simplifyDegreesExpression(degValue);
      if (
        simplifiedDeg &&
        Math.abs(degValue - parseFloat(simplifiedDeg.replace("°", ""))) < 1e-6
      ) {
        setDegreesInput(simplifiedDeg.replace("°", ""));
      } else {
        setDegreesInput(degValue.toString());
      }
      setTimeout(() => {
        updatingRef.current = false;
      }, 0);
    } else {
      setDegreesInput("");
    }
  };

  const handleDegreesInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (updatingRef.current) return;
    const value = e.target.value;
    setDegreesInput(value);

    const numValue = parseMathExpression(value);
    if (numValue !== null) {
      updatingRef.current = true;
      const radValue = (numValue * Math.PI) / 180;
      const simplifiedRad = simplifyRadiansExpression(radValue);
      const numRad = parseMathExpression(simplifiedRad);
      if (
        simplifiedRad &&
        numRad !== null &&
        Math.abs(radValue - numRad) < 1e-10
      ) {
        setRadiansInput(simplifiedRad);
      } else {
        setRadiansInput(radValue.toString());
      }
      setTimeout(() => {
        updatingRef.current = false;
      }, 0);
    } else {
      setRadiansInput("");
    }
  };

  return (
    <div className="p-4 flex items-center gap-4 w-full justify-between">
      <Image src={logo_ifc} alt="Logo" width={250} height={250} />
      <h1 className="text-lg font-semibold">Projeto SEP - Fluxo de Potência</h1>
      <div className="flex items-center gap-4">
        <NavbarDiagramSelector />
        {selectedDiagram === "A" && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm font-medium">Formato da Impedância:</span>
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
                  setImpedanceFormat(checked ? "polar" : "rectangular")
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
        )}
        <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <Button variant="outline" size="sm">
              Conversor Rad ↔ Graus
            </Button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="w-96 p-4">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-semibold mb-1">
                  Conversor de Ângulos
                </h3>
                <p className="text-xs text-muted-foreground">
                  Aceita expressões como: 2π, π/2, 2√3π, 45.
                </p>
              </div>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Input
                    type="text"
                    title="Radianos (rad)"
                    value={radiansInput}
                    onChange={handleRadiansInputChange}
                    placeholder="Ex: 2π, π/2, 1.5"
                    showButtons={false}
                  />
                  {radiansValue !== null && (
                    <div className="text-xs text-muted-foreground flex items-center gap-2 flex-wrap">
                      <span>≈ {radiansValue.toFixed(6)} rad</span>
                      {radiansExpression &&
                        radiansExpression !==
                          radiansValue.toFixed(6).replace(/\.?0+$/, "") &&
                        parseMathExpression(radiansExpression) !== null &&
                        Math.abs(
                          (parseMathExpression(radiansExpression) || 0) -
                            radiansValue
                        ) < 1e-10 && (
                          <span className="text-primary font-medium">
                            = {radiansExpression}
                          </span>
                        )}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Input
                    type="text"
                    title="Graus (°)"
                    value={degreesInput}
                    onChange={handleDegreesInputChange}
                    placeholder="Ex: 90, 180, 45"
                    showButtons={false}
                  />
                  {degreesExpression && degreesValue !== null && (
                    <div className="text-xs text-muted-foreground">
                      ≈ {degreesValue.toFixed(6)}°
                    </div>
                  )}
                </div>
              </div>
            </div>
          </DropdownMenu.Content>
        </DropdownMenu.Root>
      </div>
      <h1 className="text-lg font-semibold">Arthur Pedro Ferreira</h1>
    </div>
  );
};
