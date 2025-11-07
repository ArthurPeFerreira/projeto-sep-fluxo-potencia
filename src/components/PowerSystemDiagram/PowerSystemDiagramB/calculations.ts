import Decimal from "decimal.js";

export interface PowerSystemParamsDecimalB {
  Vi: Decimal;
  Vj: Decimal;
  Vk: Decimal;
  angleVi: Decimal;
  angleVj: Decimal;
  angleVk: Decimal;
  zR_ik: Decimal;
  zX_ik: Decimal;
  zR_jk: Decimal;
  zX_jk: Decimal;
  zR_ij: Decimal;
  zX_ij: Decimal;
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
  const {
    Vi,
    Vj,
    Vk,
    angleVi,
    angleVj,
    angleVk,
    zR_ik,
    zX_ik,
    zR_jk,
    zX_jk,
    zR_ij,
    zX_ij,
  } = data;

  const ViDecimal = Vi;
  const VjDecimal = Vj;
  const VkDecimal = Vk;

  const denominatorIk = zR_ik.pow(2).plus(zX_ik.pow(2));
  const denominatorJk = zR_jk.pow(2).plus(zX_jk.pow(2));
  const denominatorIj = zR_ij.pow(2).plus(zX_ij.pow(2));

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
    .dividedBy(denominatorIj)
    .times(
      zR_ij
        .times(ViDecimal.pow(2))
        .minus(zR_ij.times(ViDecimal).times(VjDecimal).times(cosThetaIj))
        .plus(zX_ij.times(ViDecimal).times(VjDecimal).times(sinThetaIj))
    );

  const Pji = new Decimal(1)
    .dividedBy(denominatorIj)
    .times(
      zR_ij
        .times(VjDecimal.pow(2))
        .minus(zR_ij.times(ViDecimal).times(VjDecimal).times(cosThetaIj))
        .minus(zX_ij.times(ViDecimal).times(VjDecimal).times(sinThetaIj))
    );

  const Pik = new Decimal(1)
    .dividedBy(denominatorIk)
    .times(
      zR_ik
        .times(ViDecimal.pow(2))
        .minus(zR_ik.times(ViDecimal).times(VkDecimal).times(cosThetaIk))
        .plus(zX_ik.times(ViDecimal).times(VkDecimal).times(sinThetaIk))
    );

  const Pki = new Decimal(1)
    .dividedBy(denominatorIk)
    .times(
      zR_ik
        .times(VkDecimal.pow(2))
        .minus(zR_ik.times(ViDecimal).times(VkDecimal).times(cosThetaIk))
        .minus(zX_ik.times(ViDecimal).times(VkDecimal).times(sinThetaIk))
    );

  const Pjk = new Decimal(1)
    .dividedBy(denominatorJk)
    .times(
      zR_jk
        .times(VjDecimal.pow(2))
        .minus(zR_jk.times(VjDecimal).times(VkDecimal).times(cosThetaJk))
        .plus(zX_jk.times(VjDecimal).times(VkDecimal).times(sinThetaJk))
    );

  const Pkj = new Decimal(1)
    .dividedBy(denominatorJk)
    .times(
      zR_jk
        .times(VkDecimal.pow(2))
        .minus(zR_jk.times(VjDecimal).times(VkDecimal).times(cosThetaJk))
        .minus(zX_jk.times(VjDecimal).times(VkDecimal).times(sinThetaJk))
    );

  const Qij = new Decimal(1)
    .dividedBy(denominatorIj)
    .times(
      zX_ij
        .times(ViDecimal.pow(2))
        .minus(zX_ij.times(ViDecimal).times(VjDecimal).times(cosThetaIj))
        .minus(zR_ij.times(ViDecimal).times(VjDecimal).times(sinThetaIj))
    );

  const Qji = new Decimal(1)
    .dividedBy(denominatorIj)
    .times(
      zX_ij
        .times(VjDecimal.pow(2))
        .minus(zX_ij.times(ViDecimal).times(VjDecimal).times(cosThetaIj))
        .plus(zR_ij.times(ViDecimal).times(VjDecimal).times(sinThetaIj))
    );

  const Qik = new Decimal(1)
    .dividedBy(denominatorIk)
    .times(
      zX_ik
        .times(ViDecimal.pow(2))
        .minus(zX_ik.times(ViDecimal).times(VkDecimal).times(cosThetaIk))
        .minus(zR_ik.times(ViDecimal).times(VkDecimal).times(sinThetaIk))
    );

  const Qki = new Decimal(1)
    .dividedBy(denominatorIk)
    .times(
      zX_ik
        .times(VkDecimal.pow(2))
        .minus(zX_ik.times(ViDecimal).times(VkDecimal).times(cosThetaIk))
        .plus(zR_ik.times(ViDecimal).times(VkDecimal).times(sinThetaIk))
    );

  const Qjk = new Decimal(1)
    .dividedBy(denominatorJk)
    .times(
      zX_jk
        .times(VjDecimal.pow(2))
        .minus(zX_jk.times(VjDecimal).times(VkDecimal).times(cosThetaJk))
        .minus(zR_jk.times(VjDecimal).times(VkDecimal).times(sinThetaJk))
    );

  const Qkj = new Decimal(1)
    .dividedBy(denominatorJk)
    .times(
      zX_jk
        .times(VkDecimal.pow(2))
        .minus(zX_jk.times(VjDecimal).times(VkDecimal).times(cosThetaJk))
        .plus(zR_jk.times(VjDecimal).times(VkDecimal).times(sinThetaJk))
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
