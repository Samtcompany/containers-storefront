import { describe, expect, it } from 'vitest';
import { estimate, readRates } from '../src/lib/calculator';
import { kbSearch, kbText, parseEstimateQuestion } from '../src/lib/kb';
import v1 from './fixtures/prime-containers.v1.json';

const rates = readRates(v1.calculator as never);

describe('the calculator reads every rate from the published document', () => {
  it('reproduces the approved prototype\'s figures for its default example', () => {
    // 50,000 SAR, 12 m³, 1,800 kg, medical (duty 0), sea via Jeddah, insured — the prototype's defaults.
    const e = estimate(rates, { value: 50000, qty: 2000, cat: 'medical', mode: 'sea', volume: 12, weight: 1800, port: 'JED', insurance: true });
    expect(e.freight).toBe(4560);          // LCL: 12 m³ × 380
    expect(e.insurance).toBe(250);         // 0.5 %
    expect(e.duty).toBe(0);                // medical
    expect(e.local).toBe(900);             // Jeddah LCL inland
    expect(e.service).toBe(5000);          // 10 %
    expect(e.total).toBe(Math.round((50000 + 4560 + 250 + 0 + 1200 + (54810 * 0.02) + 900 + 5000) * 1.15));
    expect(e.perUnit).toBeCloseTo(e.total / 2000, 2);
  });
  it('picks the container by volume and the duty by category', () => {
    expect(estimate(rates, { value: 10000, cat: 'furniture', mode: 'sea', volume: 30, weight: 0, port: 'DMM', insurance: false }).unit.en).toBe("40' high cube");
    expect(estimate(rates, { value: 10000, cat: 'furniture', mode: 'sea', volume: 20, weight: 0, port: 'DMM', insurance: false }).unit.en).toBe("20' container");
    expect(estimate(rates, { value: 10000, cat: 'furniture', mode: 'sea', volume: 20, weight: 0, port: 'DMM', insurance: false }).dutyRate).toBe(0.15);
    expect(estimate(rates, { value: 10000, cat: 'nothing-like-this', mode: 'sea', volume: 1, weight: 0, port: 'DMM', insurance: false }).dutyRate).toBe(0.05);
  });
  it('air freight charges the greater of weight and volumetric weight', () => {
    const light = estimate(rates, { value: 1000, cat: 'general', mode: 'air', volume: 2, weight: 100, port: 'RUH', insurance: false });
    expect(light.freight).toBe(350 + Math.round(2 * 167) * 24);
  });
});

describe('the assistant answers only from the knowledge base', () => {
  const text = kbText(v1.assistant as never, (v1.sections.find((s) => s.id === 'faq')?.items ?? []) as never, []);
  it('finds the payment terms when asked how to pay', () => {
    const hits = kbSearch(text, 'كيف أدفع في الاستيراد؟');
    expect(hits.length).toBeGreaterThan(0);
    expect(hits.join(' ')).toMatch(/عربون|30%/);
  });
  it('finds nothing for a question outside the company\'s text', () => {
    expect(kbSearch(text, 'ما هي عاصمة فرنسا؟')).toEqual([]);
  });
  it('reads figures and keywords out of a free-text cost question', () => {
    expect(parseEstimateQuestion('كم تكلفة استيراد بضاعة بقيمة 50,000 ر.س حجمها 12 م³ بحراً؟')).toEqual({ value: 50000, volume: 12, weight: 0, cat: 'general', mode: 'sea' });
    expect(parseEstimateQuestion('importing SAR 20000 of gloves, 300 kg by air')).toMatchObject({ value: 20000, weight: 300, cat: 'medical', mode: 'air' });
  });
});
