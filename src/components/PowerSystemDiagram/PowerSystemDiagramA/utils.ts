import Complex from "complex.js";

export const getComplexFromRectangular = (r: number, x: number): Complex => {
  return new Complex(r, x);
};

export const getComplexFromPolar = (magnitude: number, angle: number): Complex => {
  const radians = (angle * Math.PI) / 180;
  return new Complex({ abs: magnitude, arg: radians });
};
