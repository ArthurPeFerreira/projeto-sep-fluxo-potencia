import Complex from "complex.js";
import Decimal from "decimal.js";
import { PI } from "@/lib/constants";

export const getComplexFromRectangular = (
  r: Decimal | number,
  x: Decimal | number
): Complex => {
  const rDecimal = r instanceof Decimal ? r : new Decimal(r);
  const xDecimal = x instanceof Decimal ? x : new Decimal(x);
  return new Complex(Number(rDecimal.toString()), Number(xDecimal.toString()));
};

export const getComplexFromPolar = (
  magnitude: Decimal | number,
  angle: Decimal | number
): Complex => {
  const magnitudeDecimal =
    magnitude instanceof Decimal ? magnitude : new Decimal(magnitude);
  const angleDecimal = angle instanceof Decimal ? angle : new Decimal(angle);
  const radians = angleDecimal.mul(PI).div(180);
  return new Complex({
    abs: Number(magnitudeDecimal.toString()),
    arg: Number(radians.toString()),
  });
};
