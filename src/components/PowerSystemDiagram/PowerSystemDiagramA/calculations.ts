import Decimal from "decimal.js";

export interface PowerSystemParamsDecimal {
  Vi: Decimal;
  Vj: Decimal;
  angleVi: Decimal;
  angleVj: Decimal;
  zR: Decimal;
  zX: Decimal;
}

export interface PowerFlowResults {
  Pij: Decimal;
  Pji: Decimal;
  Qij: Decimal;
  Qji: Decimal;
  deltaP: Decimal;
  deltaQ: Decimal;
}

export interface ResultRow {
  parametro: string;
  valor: string;
  unidade: string;
}

export const calculatePowerFlow = (
  data: PowerSystemParamsDecimal
): PowerFlowResults => {
  const { Vi, Vj, angleVi, angleVj, zR, zX } = data;

  const R = zR;
  const X = zX;
  const ViDecimal = Vi;
  const VjDecimal = Vj;

  const angleDiff = angleVi.minus(angleVj);
  const PI = new Decimal(Math.PI);
  const thetaIjRadians = angleDiff.times(PI).dividedBy(180);

  const denominator = R.pow(2).plus(X.pow(2));

  const thetaIjForTrig = thetaIjRadians.toNumber();
  const cosTheta = new Decimal(Math.cos(thetaIjForTrig));
  const sinTheta = new Decimal(Math.sin(thetaIjForTrig));

  const Pij = new Decimal(1)
    .dividedBy(denominator)
    .times(
      R.times(ViDecimal.pow(2))
        .minus(R.times(ViDecimal).times(VjDecimal).times(cosTheta))
        .plus(X.times(ViDecimal).times(VjDecimal).times(sinTheta))
    );

  const Pji = new Decimal(1)
    .dividedBy(denominator)
    .times(
      R.times(VjDecimal.pow(2))
        .minus(R.times(ViDecimal).times(VjDecimal).times(cosTheta))
        .minus(X.times(ViDecimal).times(VjDecimal).times(sinTheta))
    );

  const Qij = new Decimal(1)
    .dividedBy(denominator)
    .times(
      X.times(ViDecimal.pow(2))
        .minus(X.times(ViDecimal).times(VjDecimal).times(cosTheta))
        .minus(R.times(ViDecimal).times(VjDecimal).times(sinTheta))
    );

  const Qji = new Decimal(1)
    .dividedBy(denominator)
    .times(
      X.times(VjDecimal.pow(2))
        .minus(X.times(ViDecimal).times(VjDecimal).times(cosTheta))
        .plus(R.times(ViDecimal).times(VjDecimal).times(sinTheta))
    );

  const deltaP = Pij.abs().minus(Pji.abs()).abs();
  const deltaQ = Qij.abs().minus(Qji.abs()).abs();

  return {
    Pij,
    Pji,
    Qij,
    Qji,
    deltaP,
    deltaQ,
  };
};
