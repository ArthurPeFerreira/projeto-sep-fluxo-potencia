import Decimal from "decimal.js";

export interface PowerSystemParamsDecimalB {
  Vi: Decimal;
  Vj: Decimal;
  Vk: Decimal;
  angleVi: Decimal;
  angleVj: Decimal;
  angleVk: Decimal;
  zR: Decimal;
  zX: Decimal;
}

export interface PowerFlowResultsB {
  Pij: Decimal;
  Pji: Decimal;
  Pik: Decimal;
  Pki: Decimal;
  Pjk: Decimal;
  Pkj: Decimal;
  Qij: Decimal;
  Qji: Decimal;
  Qik: Decimal;
  Qki: Decimal;
  Qjk: Decimal;
  Qkj: Decimal;
  deltaPij: Decimal;
  deltaPik: Decimal;
  deltaPjk: Decimal;
  deltaQij: Decimal;
  deltaQik: Decimal;
  deltaQjk: Decimal;
}

export interface ResultRowB {
  parametro: string;
  valor: string;
  unidade: string;
}

export const calculatePowerFlowB = (
  data: PowerSystemParamsDecimalB
): PowerFlowResultsB => {
  const { Vi, Vj, Vk, angleVi, angleVj, angleVk, zR, zX } = data;

  const R = zR;
  const X = zX;
  const ViDecimal = Vi;
  const VjDecimal = Vj;
  const VkDecimal = Vk;

  const denominator = R.pow(2).plus(X.pow(2));
  const PI = new Decimal(Math.PI);

  const thetaIjRadians = angleVi.minus(angleVj).times(PI).dividedBy(180);
  const thetaIkRadians = angleVi.minus(angleVk).times(PI).dividedBy(180);
  const thetaJkRadians = angleVj.minus(angleVk).times(PI).dividedBy(180);

  const cosThetaIj = new Decimal(Math.cos(thetaIjRadians.toNumber()));
  const sinThetaIj = new Decimal(Math.sin(thetaIjRadians.toNumber()));

  const cosThetaIk = new Decimal(Math.cos(thetaIkRadians.toNumber()));
  const sinThetaIk = new Decimal(Math.sin(thetaIkRadians.toNumber()));

  const cosThetaJk = new Decimal(Math.cos(thetaJkRadians.toNumber()));
  const sinThetaJk = new Decimal(Math.sin(thetaJkRadians.toNumber()));

  const Pij = new Decimal(1)
    .dividedBy(denominator)
    .times(
      R.times(ViDecimal.pow(2))
        .minus(R.times(ViDecimal).times(VjDecimal).times(cosThetaIj))
        .plus(X.times(ViDecimal).times(VjDecimal).times(sinThetaIj))
    );

  const Pji = new Decimal(1)
    .dividedBy(denominator)
    .times(
      R.times(VjDecimal.pow(2))
        .minus(R.times(ViDecimal).times(VjDecimal).times(cosThetaIj))
        .minus(X.times(ViDecimal).times(VjDecimal).times(sinThetaIj))
    );

  const Pik = new Decimal(1)
    .dividedBy(denominator)
    .times(
      R.times(ViDecimal.pow(2))
        .minus(R.times(ViDecimal).times(VkDecimal).times(cosThetaIk))
        .plus(X.times(ViDecimal).times(VkDecimal).times(sinThetaIk))
    );

  const Pki = new Decimal(1)
    .dividedBy(denominator)
    .times(
      R.times(VkDecimal.pow(2))
        .minus(R.times(ViDecimal).times(VkDecimal).times(cosThetaIk))
        .minus(X.times(ViDecimal).times(VkDecimal).times(sinThetaIk))
    );

  const Pjk = new Decimal(1)
    .dividedBy(denominator)
    .times(
      R.times(VjDecimal.pow(2))
        .minus(R.times(VjDecimal).times(VkDecimal).times(cosThetaJk))
        .plus(X.times(VjDecimal).times(VkDecimal).times(sinThetaJk))
    );

  const Pkj = new Decimal(1)
    .dividedBy(denominator)
    .times(
      R.times(VkDecimal.pow(2))
        .minus(R.times(VjDecimal).times(VkDecimal).times(cosThetaJk))
        .minus(X.times(VjDecimal).times(VkDecimal).times(sinThetaJk))
    );

  const Qij = new Decimal(1)
    .dividedBy(denominator)
    .times(
      X.times(ViDecimal.pow(2))
        .minus(X.times(ViDecimal).times(VjDecimal).times(cosThetaIj))
        .minus(R.times(ViDecimal).times(VjDecimal).times(sinThetaIj))
    );

  const Qji = new Decimal(1)
    .dividedBy(denominator)
    .times(
      X.times(VjDecimal.pow(2))
        .minus(X.times(ViDecimal).times(VjDecimal).times(cosThetaIj))
        .plus(R.times(ViDecimal).times(VjDecimal).times(sinThetaIj))
    );

  const Qik = new Decimal(1)
    .dividedBy(denominator)
    .times(
      X.times(ViDecimal.pow(2))
        .minus(X.times(ViDecimal).times(VkDecimal).times(cosThetaIk))
        .minus(R.times(ViDecimal).times(VkDecimal).times(sinThetaIk))
    );

  const Qki = new Decimal(1)
    .dividedBy(denominator)
    .times(
      X.times(VkDecimal.pow(2))
        .minus(X.times(ViDecimal).times(VkDecimal).times(cosThetaIk))
        .plus(R.times(ViDecimal).times(VkDecimal).times(sinThetaIk))
    );

  const Qjk = new Decimal(1)
    .dividedBy(denominator)
    .times(
      X.times(VjDecimal.pow(2))
        .minus(X.times(VjDecimal).times(VkDecimal).times(cosThetaJk))
        .minus(R.times(VjDecimal).times(VkDecimal).times(sinThetaJk))
    );

  const Qkj = new Decimal(1)
    .dividedBy(denominator)
    .times(
      X.times(VkDecimal.pow(2))
        .minus(X.times(VjDecimal).times(VkDecimal).times(cosThetaJk))
        .plus(R.times(VjDecimal).times(VkDecimal).times(sinThetaJk))
    );

  const deltaPij = Pij.plus(Pji);
  const deltaPik = Pik.plus(Pki);
  const deltaPjk = Pjk.plus(Pkj);
  const deltaQij = Qij.plus(Qji);
  const deltaQik = Qik.plus(Qki);
  const deltaQjk = Qjk.plus(Qkj);

  return {
    Pij,
    Pji,
    Pik,
    Pki,
    Pjk,
    Pkj,
    Qij,
    Qji,
    Qik,
    Qki,
    Qjk,
    Qkj,
    deltaPij,
    deltaPik,
    deltaPjk,
    deltaQij,
    deltaQik,
    deltaQjk,
  };
};
