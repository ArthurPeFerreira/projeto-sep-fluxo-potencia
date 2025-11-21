"use client";

import React from "react";
import PowerSystemDiagramA from "./PowerSystemDiagramA";
import PowerSystemDiagramB from "./PowerSystemDiagramB";
import { useDiagramType } from "./DiagramTypeContext";

interface PowerSystemDiagramSelectorProps {
  className?: string;
}

export const PowerSystemDiagramSelector: React.FC<
  PowerSystemDiagramSelectorProps
> = ({ className = "" }) => {
  const { selectedDiagram } = useDiagramType();

  return (
    <div className={className}>
      {selectedDiagram === "A" ? (
        <PowerSystemDiagramA
          initialValues={{
            Vi: 345,
            Vj: 360,
            angleVi: 10,
            angleVj: 0,
            Vn: 345,
            L: 80,
            zR: 5,
            zX: 40,
          }}
        />
      ) : (
        <PowerSystemDiagramB
          initialValues={{
            Vi: 345,
            Vj: 360,
            Vk: 350,
            angleVi: 0,
            angleVj: 0,
            angleVk: 10,
            Vn: 345,
            L: 80,
            zR_ik: 5,
            zX_ik: 40,
            zR_jk: 5,
            zX_jk: 40,
            zR_ij: 5,
            zX_ij: 40,
          }}
        />
      )}
    </div>
  );
};

export default PowerSystemDiagramSelector;
