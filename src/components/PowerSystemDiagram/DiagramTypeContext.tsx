"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

type DiagramType = "A" | "B";

interface DiagramTypeContextType {
  selectedDiagram: DiagramType;
  setSelectedDiagram: (type: DiagramType) => void;
}

const DiagramTypeContext = createContext<DiagramTypeContextType | undefined>(
  undefined
);

export const DiagramTypeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [selectedDiagram, setSelectedDiagram] = useState<DiagramType>("A");

  return (
    <DiagramTypeContext.Provider
      value={{ selectedDiagram, setSelectedDiagram }}
    >
      {children}
    </DiagramTypeContext.Provider>
  );
};

export const useDiagramType = () => {
  const context = useContext(DiagramTypeContext);
  if (!context) {
    throw new Error("useDiagramType must be used within DiagramTypeProvider");
  }
  return context;
};
