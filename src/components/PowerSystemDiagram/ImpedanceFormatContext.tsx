"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ImpedanceFormat } from "./PowerSystemDiagramA/types";

interface ImpedanceFormatContextType {
  impedanceFormat: ImpedanceFormat;
  setImpedanceFormat: (format: ImpedanceFormat) => void;
}

const ImpedanceFormatContext = createContext<
  ImpedanceFormatContextType | undefined
>(undefined);

export const ImpedanceFormatProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [impedanceFormat, setImpedanceFormat] =
    useState<ImpedanceFormat>("rectangular");

  return (
    <ImpedanceFormatContext.Provider
      value={{ impedanceFormat, setImpedanceFormat }}
    >
      {children}
    </ImpedanceFormatContext.Provider>
  );
};

export const useImpedanceFormat = () => {
  const context = useContext(ImpedanceFormatContext);
  if (!context) {
    throw new Error(
      "useImpedanceFormat must be used within ImpedanceFormatProvider"
    );
  }
  return context;
};
