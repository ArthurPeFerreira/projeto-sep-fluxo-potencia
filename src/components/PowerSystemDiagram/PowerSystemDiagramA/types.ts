import { z } from "zod";
import { powerSystemSchemaA } from "./schema";

export type PowerSystemParamsA = z.infer<typeof powerSystemSchemaA>;
export type ImpedanceFormat = "rectangular" | "polar";

export interface PowerSystemDiagramAProps {
  className?: string;
  initialValues?: Partial<PowerSystemParamsA>;
}

