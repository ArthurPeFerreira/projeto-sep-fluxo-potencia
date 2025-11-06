import { z } from "zod";

export const powerSystemSchemaB = z.object({
  Vi: z
    .number()
    .min(0, "Tensão Vi deve ser maior ou igual a 0")
    .max(1000, "Tensão Vi deve ser menor ou igual a 1000"),
  Vj: z
    .number()
    .min(0, "Tensão Vj deve ser maior ou igual a 0")
    .max(1000, "Tensão Vj deve ser menor ou igual a 1000"),
  Vk: z
    .number()
    .min(0, "Tensão Vk deve ser maior ou igual a 0")
    .max(1000, "Tensão Vk deve ser menor ou igual a 1000"),
  angleVi: z
    .number()
    .min(-180, "Ângulo Vi deve ser entre -180 e 180")
    .max(180, "Ângulo Vi deve ser entre -180 e 180"),
  angleVj: z
    .number()
    .min(-180, "Ângulo Vj deve ser entre -180 e 180")
    .max(180, "Ângulo Vj deve ser entre -180 e 180"),
  angleVk: z
    .number()
    .min(-180, "Ângulo Vk deve ser entre -180 e 180")
    .max(180, "Ângulo Vk deve ser entre -180 e 180"),
  Vn: z
    .number()
    .min(0, "Tensão Nominal deve ser maior ou igual a 0")
    .max(1000, "Tensão Nominal deve ser menor ou igual a 1000"),
  L: z
    .number()
    .min(0, "Comprimento deve ser maior ou igual a 0")
    .max(10000, "Comprimento deve ser menor ou igual a 10000"),
  zR: z
    .number()
    .min(-1000, "Resistência deve ser entre -1000 e 1000")
    .max(1000, "Resistência deve ser entre -1000 e 1000"),
  zX: z
    .number()
    .min(-1000, "Reatância deve ser entre -1000 e 1000")
    .max(1000, "Reatância deve ser entre -1000 e 1000"),
});
