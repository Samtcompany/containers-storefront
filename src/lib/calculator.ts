import type { JsonObject, Lang } from './types';
import { isObject, num, objects, str } from './config';

/**
 * The import-cost estimator — the prototype's `estimate()` with every rate read from the published
 * `calculator` document, never hard-coded. Indicative figures, as the storefront says on every output.
 */
export interface CalculatorRates {
  currency: string; vatRate: number; insuranceRate: number; clearanceFee: number; handlingRate: number; serviceFeeRate: number;
  duty: Record<string, number>;
  categories: Array<{ id: string; nameAr: string; nameEn: string; dutyRate: number }>;
  modes: Array<{ id: string; nameAr: string; nameEn: string; days: string }>;
  freight: { air: { base: number; perChargeableKg: number; volumetricKgPerM3: number }; land: { minimum: number; perKg: number; perM3: number };
    sea: { lclMinimum: number; lclPerM3: number; lclMaxM3: number; container20Flat: number; container20MaxM3: number; container40HcFlat: number } };
  ports: Array<{ id: string; nameAr: string; nameEn: string; inlandFcl: number; inlandLcl: number }>;
}

export function readRates(calculator: JsonObject): CalculatorRates {
  const f = isObject(calculator.freight) ? calculator.freight : {};
  const air = isObject(f.air) ? f.air : {}, land = isObject(f.land) ? f.land : {}, sea = isObject(f.sea) ? f.sea : {};
  const duty: Record<string, number> = {};
  if (isObject(calculator.duty)) for (const [k, v] of Object.entries(calculator.duty)) duty[k] = num(v);
  return {
    currency: str(calculator.currency, 'SAR'), vatRate: num(calculator.vatRate, 0.15), insuranceRate: num(calculator.insuranceRate, 0.005),
    clearanceFee: num(calculator.clearanceFee, 1200), handlingRate: num(calculator.handlingRate, 0.02), serviceFeeRate: num(calculator.serviceFeeRate, 0.1),
    duty,
    categories: objects(calculator.categories).map((c) => ({ id: str(c.id), nameAr: str(c.nameAr), nameEn: str(c.nameEn), dutyRate: num(c.dutyRate, duty[str(c.id)] ?? duty.general ?? 0.05) })),
    modes: objects(calculator.modes).map((m) => ({ id: str(m.id), nameAr: str(m.nameAr), nameEn: str(m.nameEn), days: str(m.days) })),
    freight: {
      air: { base: num(air.base, 350), perChargeableKg: num(air.perChargeableKg, 24), volumetricKgPerM3: num(air.volumetricKgPerM3, 167) },
      land: { minimum: num(land.minimum, 2000), perKg: num(land.perKg, 9), perM3: num(land.perM3, 120) },
      sea: { lclMinimum: num(sea.lclMinimum, 900), lclPerM3: num(sea.lclPerM3, 380), lclMaxM3: num(sea.lclMaxM3, 15), container20Flat: num(sea.container20Flat, 8500), container20MaxM3: num(sea.container20MaxM3, 28), container40HcFlat: num(sea.container40HcFlat, 11000) },
    },
    ports: objects(calculator.ports).map((p) => ({ id: str(p.id), nameAr: str(p.nameAr), nameEn: str(p.nameEn), inlandFcl: num(p.inlandFcl), inlandLcl: num(p.inlandLcl) })),
  };
}

export interface EstimateInput { value: number; qty?: number; cat: string; mode: string; volume: number; weight: number; port: string; insurance: boolean }
export interface Estimate {
  value: number; freight: number; unit: { ar: string; en: string }; insurance: number; duty: number; dutyRate: number; clearance: number; handling: number;
  local: number; service: number; vat: number; total: number; perUnit: number | null; mode: string; days: string; cat: string; port: string;
}

export function estimate(r: CalculatorRates, i: EstimateInput): Estimate {
  const val = Math.max(0, i.value || 0), vol = Math.max(0, i.volume || 0), kg = Math.max(0, i.weight || 0), qty = Math.max(0, i.qty || 0);
  const mode = r.modes.some((m) => m.id === i.mode) ? i.mode : (r.modes[0]?.id ?? 'sea');
  const category = r.categories.find((c) => c.id === i.cat) ?? r.categories.find((c) => c.id === 'general') ?? r.categories[0];
  const dutyRate = category ? category.dutyRate : (r.duty.general ?? 0.05);
  const port = r.ports.find((p) => p.id === i.port) ?? r.ports[0] ?? { id: '—', nameAr: '', nameEn: '', inlandFcl: 0, inlandLcl: 0 };
  let freight: number, unit: { ar: string; en: string };
  if (mode === 'air') {
    const ch = Math.max(kg, vol * r.freight.air.volumetricKgPerM3);
    freight = r.freight.air.base + ch * r.freight.air.perChargeableKg;
    unit = { ar: `جوي · ${Math.round(ch)} كجم محسوب`, en: `air · ${Math.round(ch)} kg chargeable` };
  } else if (mode === 'land') {
    freight = Math.max(r.freight.land.minimum, kg * r.freight.land.perKg + vol * r.freight.land.perM3);
    unit = { ar: 'بري', en: 'land' };
  } else if (vol > r.freight.sea.container20MaxM3) {
    freight = r.freight.sea.container40HcFlat; unit = { ar: 'حاوية 40 قدماً مرتفعة', en: "40' high cube" };
  } else if (vol > r.freight.sea.lclMaxM3) {
    freight = r.freight.sea.container20Flat; unit = { ar: 'حاوية 20 قدماً', en: "20' container" };
  } else {
    freight = Math.max(r.freight.sea.lclMinimum, vol * r.freight.sea.lclPerM3); unit = { ar: `شحنة مجمّعة · ${vol} م³`, en: `LCL · ${vol} m³` };
  }
  const insurance = i.insurance ? val * r.insuranceRate : 0;
  const cif = val + freight + insurance;
  const duty = cif * dutyRate;
  const clearance = r.clearanceFee, handling = cif * r.handlingRate;
  const local = mode === 'sea' && vol <= r.freight.sea.lclMaxM3 ? port.inlandLcl : port.inlandFcl;
  const service = val * r.serviceFeeRate;
  const base = cif + duty + clearance + handling + local + service;
  const vat = base * r.vatRate, total = base + vat;
  const days = r.modes.find((m) => m.id === mode)?.days ?? '';
  return {
    value: val, freight: Math.round(freight), unit, insurance: Math.round(insurance), duty: Math.round(duty), dutyRate, clearance, handling: Math.round(handling),
    local, service: Math.round(service), vat: Math.round(vat), total: Math.round(total), perUnit: qty ? total / qty : null, mode, days, cat: category?.id ?? 'general', port: port.id,
  };
}

export const modeName = (r: CalculatorRates, id: string, lang: Lang) => { const m = r.modes.find((x) => x.id === id); return m ? (lang === 'en' ? m.nameEn : m.nameAr) : id; };
export const portName = (r: CalculatorRates, id: string, lang: Lang) => { const p = r.ports.find((x) => x.id === id); return p ? (lang === 'en' ? p.nameEn : p.nameAr) : id; };
export const categoryName = (r: CalculatorRates, id: string, lang: Lang) => { const c = r.categories.find((x) => x.id === id); return c ? (lang === 'en' ? c.nameEn : c.nameAr) : id; };
