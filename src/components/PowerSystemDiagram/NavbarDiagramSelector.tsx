"use client";

import React from "react";
import { Button } from "@/components/ui/Button";
import { useDiagramType } from "./DiagramTypeContext";

export const NavbarDiagramSelector: React.FC = () => {
  const { selectedDiagram, setSelectedDiagram } = useDiagramType();

  return (
    <div className="flex flex-col items-center gap-2 ml-auto">
      <span className="text-sm font-medium">Tipo de Diagrama:</span>
      <div className="flex items-center gap-2">
        <Button
          onClick={() => setSelectedDiagram("A")}
          variant={selectedDiagram === "A" ? "default" : "outline"}
          size="sm"
        >
          A (2 Barras)
        </Button>
        <Button
          onClick={() => setSelectedDiagram("B")}
          variant={selectedDiagram === "B" ? "default" : "outline"}
          size="sm"
        >
          B (3 Barras)
        </Button>
      </div>
    </div>
  );
};
