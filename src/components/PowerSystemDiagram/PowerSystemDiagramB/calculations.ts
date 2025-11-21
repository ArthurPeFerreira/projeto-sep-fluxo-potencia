import Decimal from "decimal.js";
import { PI } from "@/lib/constants";

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

const cos = (x: Decimal) => new Decimal(Math.cos(x.toNumber()));
const sin = (x: Decimal) => new Decimal(Math.sin(x.toNumber()));

const activePower = (
  Vi: Decimal,
  Vj: Decimal,
  R: Decimal,
  X: Decimal,
  theta: Decimal
) => {
  const denom = R.pow(2).plus(X.pow(2));

  return R.times(Vi.pow(2))
    .minus(R.times(Vi).times(Vj).times(cos(theta)))
    .plus(X.times(Vi).times(Vj).times(sin(theta)))
    .dividedBy(denom);
};

const reactivePower = (
  Vi: Decimal,
  Vj: Decimal,
  R: Decimal,
  X: Decimal,
  theta: Decimal
) => {
  const denom = R.pow(2).plus(X.pow(2));

  return X.times(Vi.pow(2))
    .minus(X.times(Vi).times(Vj).times(cos(theta)))
    .minus(R.times(Vi).times(Vj).times(sin(theta)))
    .dividedBy(denom);
};

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

  const θij = angleVi.minus(angleVj).times(PI).dividedBy(180);
  const θik = angleVi.minus(angleVk).times(PI).dividedBy(180);
  const θjk = angleVj.minus(angleVk).times(PI).dividedBy(180);

  const Pij = activePower(Vi, Vj, zR_ij, zX_ij, θij);
  const Pji = activePower(Vj, Vi, zR_ij, zX_ij, θij.neg());
  const Pik = activePower(Vi, Vk, zR_ik, zX_ik, θik);
  const Pki = activePower(Vk, Vi, zR_ik, zX_ik, θik.neg());
  const Pjk = activePower(Vj, Vk, zR_jk, zX_jk, θjk);
  const Pkj = activePower(Vk, Vj, zR_jk, zX_jk, θjk.neg());

  const Qij = reactivePower(Vi, Vj, zR_ij, zX_ij, θij);
  const Qji = reactivePower(Vj, Vi, zR_ij, zX_ij, θij.neg());
  const Qik = reactivePower(Vi, Vk, zR_ik, zX_ik, θik);
  const Qki = reactivePower(Vk, Vi, zR_ik, zX_ik, θik.neg());
  const Qjk = reactivePower(Vj, Vk, zR_jk, zX_jk, θjk);
  const Qkj = reactivePower(Vk, Vj, zR_jk, zX_jk, θjk.neg());

  const deltaPij = Pij.abs().minus(Pji.abs()).abs();
  const deltaPik = Pik.abs().minus(Pki.abs()).abs();
  const deltaPjk = Pjk.abs().minus(Pkj.abs()).abs();
  const deltaQij = Qij.abs().minus(Qji.abs()).abs();
  const deltaQik = Qik.abs().minus(Qki.abs()).abs();
  const deltaQjk = Qjk.abs().minus(Qkj.abs()).abs();

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
