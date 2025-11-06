import { z } from "zod";
import { powerSystemSchemaB } from "./schema";

export type PowerSystemParamsB = z.infer<typeof powerSystemSchemaB>;
export type ImpedanceFormat = "rectangular" | "polar";

export interface PowerSystemDiagramBProps {
  className?: string;
  initialValues?: Partial<PowerSystemParamsB>;
}
