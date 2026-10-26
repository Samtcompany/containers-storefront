'use client';
import { useMemo, useState } from 'react';
import { bi, fmt, fmt0 } from '@/lib/config';
import { estimate, readRates, type Estimate } from '@/lib/calculator';
import { u, ui } from '@/lib/ui';
import { SecHead, type SectionProps } from './shared';

export const RFQ_PREFILL_KEY = 'pc-rfq-prefill';

export function Calculator({ s, ctx }: SectionProps) {
  const { lang } = ctx;
  const rates = useMemo(() => readRates(ctx.config.calculator), [ctx.config.calculator]);
  const [v, setV] = useState({ value: '50000', qty: '2000', cat: rates.categories[0]?.id ?? 'general', mode: rates.modes[0]?.id ?? 'sea', volume: '12', weight: '1800', port: rates.ports[0]?.id ?? 'JED', insurance: true });
  const [cmp, setCmp] = useState(false);
  const input = { value: Number(v.value) || 0, qty: Number(v.qty) || 0, cat: v.cat, mode: v.mode, volume: Number(v.volume) || 0, weight: Number(v.weight) || 0, port: v.port, insurance: v.insurance };
  const e = estimate(rates, input);
  const cur = rates.currency === 'SAR' ? u(ui.sar, lang) : rates.currency;
  const rows: Array<[string, number, string]> = [
    [u(ui.calc.rows.goods, lang), e.value, 'var(--c-grey)'], [`${u(ui.calc.rows.freight, lang)} (${lang === 'en' ? e.unit.en : e.unit.ar})`, e.freight, 'var(--steel)'],
    [u(ui.calc.rows.insurance, lang), e.insurance, 'var(--c-green)'], [`${u(ui.calc.rows.duty, lang)} ${Math.round(e.dutyRate * 100)}%`, e.duty, 'var(--signal)'],
    [u(ui.calc.rows.clearance, lang), e.clearance + e.handling, 'var(--warn)'], [u(ui.calc.rows.inland, lang), e.local, 'var(--muted)'],
    [u(ui.calc.rows.service, lang), e.service, 'var(--ink)'], [`${u(ui.calc.rows.vat, lang)} ${Math.round(rates.vatRate * 100)}%`, e.vat, 'var(--grey-2)'],
  ];
  const sum = rows.reduce((a, r) => a + r[1], 0);
  const set = (k: keyof typeof v) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => setV({ ...v, [k]: ev.target.type === 'checkbox' ? (ev.target as HTMLInputElement).checked : ev.target.value });
  const requestQuote = () => {
    try { sessionStorage.setItem(RFQ_PREFILL_KEY, JSON.stringify({ category: v.cat, estimate: e, input })); } catch { /* storage unavailable */ }
    document.getElementById('rfq')?.scrollIntoView({ behavior: 'smooth' });
    window.dispatchEvent(new CustomEvent('pc-rfq-prefill'));
  };
  const air = estimate(rates, { ...input, mode: 'air' }), sea = estimate(rates, { ...input, mode: 'sea' });
  const diff = air.total - sea.total, pct = sea.total ? Math.round((diff / sea.total) * 100) : 0;
  return (
    <section id="calc" className="bg-grey"><div className="wrap">
      <SecHead s={s} lang={lang} />
      <div className="calc-grid rv">
        <form className="calc-form" noValidate onSubmit={(ev) => ev.preventDefault()}>
          <div className="field"><label htmlFor="c-val">{u(ui.calc.value, lang)}</label><input id="c-val" inputMode="numeric" dir="ltr" value={v.value} onChange={set('value')} /></div>
          <div className="field"><label htmlFor="c-qty">{u(ui.calc.qty, lang)}</label><input id="c-qty" inputMode="numeric" dir="ltr" value={v.qty} onChange={set('qty')} /></div>
          <div className="field"><label htmlFor="c-cat">{u(ui.calc.category, lang)}</label><select id="c-cat" value={v.cat} onChange={set('cat')}>{rates.categories.map((c) => <option key={c.id} value={c.id}>{lang === 'en' ? c.nameEn : c.nameAr} · {u(ui.calc.duty, lang)}{Math.round(c.dutyRate * 100)}%</option>)}</select></div>
          <div className="field"><label htmlFor="c-mode">{u(ui.calc.mode, lang)}</label><select id="c-mode" value={v.mode} onChange={set('mode')}>{rates.modes.map((m) => <option key={m.id} value={m.id}>{lang === 'en' ? m.nameEn : m.nameAr} · {m.days} {u(ui.days, lang)}</option>)}</select></div>
          <div className="field"><label htmlFor="c-vol">{u(ui.calc.volume, lang)}</label><input id="c-vol" inputMode="decimal" dir="ltr" value={v.volume} onChange={set('volume')} /></div>
          <div className="field"><label htmlFor="c-kg">{u(ui.calc.weight, lang)}</label><input id="c-kg" inputMode="numeric" dir="ltr" value={v.weight} onChange={set('weight')} /></div>
          <div className="field"><label htmlFor="c-port">{u(ui.calc.port, lang)}</label><select id="c-port" value={v.port} onChange={set('port')}>{rates.ports.map((p) => <option key={p.id} value={p.id}>{lang === 'en' ? p.nameEn : p.nameAr}</option>)}</select></div>
          <div className="field"><label className="toggle" style={{ marginTop: 28 }}><input type="checkbox" checked={v.insurance} onChange={set('insurance')} /><span>{u(ui.calc.insurance, lang)} ({(rates.insuranceRate * 100).toLocaleString('en-US')}%)</span></label></div>
        </form>
        <div className="calc-out">
          <div className="calc-top">
            <small>{u(ui.calc.landed, lang)}</small>
            <b>{fmt(e.total)} <span style={{ fontSize: '1rem', fontWeight: 500 }}>{cur}</span></b>
            <span className="per">{e.perUnit ? <>{u(ui.about, lang)}{fmt(e.perUnit)} {cur} {u(ui.perUnit, lang)} · </> : null}{u(ui.arrivesIn, lang)}<span dir="ltr">{e.days}</span> {u(ui.days, lang)}</span>
          </div>
          <div className="calc-bar">{rows.map((r, i) => <i key={i} style={{ width: `${sum ? (r[1] / sum) * 100 : 0}%`, background: r[2] }} />)}</div>
          <div className="calc-leg">{rows.filter((r) => r[1] > 0).map((r, i) => <span key={i}><i style={{ background: r[2] }} />{r[0]}</span>)}</div>
          <div className="calc-rows">
            {rows.map((r, i) => <div key={i} className={r[1] === 0 ? 'sub' : undefined}><span>{r[0]}</span><span>{fmt(r[1])}</span></div>)}
            <div className="t"><span>{u(ui.calc.rows.total, lang)}</span><span>{fmt(e.total)} {cur}</span></div>
          </div>
          {cmp ? <Compare lang={lang} air={air} sea={sea} diff={diff} pct={pct} cur={cur} /> : null}
          <div className="calc-foot">
            <button type="button" className="btn btn-accent" onClick={requestQuote}>{u(ui.calc.rfq, lang)}</button>
            <button type="button" className="btn btn-ghost" onClick={() => setCmp(!cmp)}>{u(cmp ? ui.calc.hide : ui.calc.compare, lang)}</button>
            <p className="calc-note">{bi(s.fields, 'note', lang)}</p>
          </div>
        </div>
      </div>
    </div></section>
  );
}

function Compare({ lang, air, sea, diff, pct, cur }: { lang: 'ar' | 'en'; air: Estimate; sea: Estimate; diff: number; pct: number; cur: string }) {
  const mx = Math.max(air.total, sea.total) || 1;
  const col = (e: Estimate, name: string, c: string) => (
    <div className="col"><h4><i style={{ background: c }} />{name}</h4><b>{fmt(e.total)}</b><small>{cur} {u(ui.calc.inclVat, lang)}</small>
      {e.perUnit ? <span className="d">{fmt(e.perUnit)} {cur} {u(ui.perUnit, lang)}</span> : null}
      <span className="d">{u(ui.arrivesIn, lang)}<span dir="ltr">{e.days}</span> {u(ui.days, lang)}</span>
      <span className="d muted" style={{ fontSize: '.78rem' }}>{u(ui.calc.freightAlone, lang)}{fmt0(e.freight)}</span></div>
  );
  const verdict = diff > 0
    ? (lang === 'en'
      ? <>Air costs <b>SAR {fmt0(diff)}</b> more ({pct}%) but arrives weeks earlier. {pct < 15 ? 'A small gap, so air is worth it if time matters.' : pct < 40 ? 'If you have the time, sea saves a meaningful amount.' : 'Sea is the sensible choice for this shipment, unless it is urgent.'}</>
      : <>الجوي أغلى بـ <b>{fmt0(diff)} {cur}</b> ({pct}%) لكنه يصل قبل البحري بأسابيع. {pct < 15 ? 'الفرق صغير، فالجوي يستحق إن كان الوقت مهماً.' : pct < 40 ? 'إن كان لديك وقت، البحري يوفر لك مبلغاً معتبراً.' : 'البحري هو الخيار المنطقي لهذه الشحنة، إلا لطلب عاجل.'}</>)
    : (lang === 'en' ? 'For this shipment air is no more expensive than sea, so take the faster one.' : 'لهذه الشحنة الجوي ليس أغلى من البحري، فاختر الأسرع.');
  return (
    <div className="cmp">
      <div className="cols">{col(air, u(ui.calc.air, lang), 'var(--signal)')}{col(sea, u(ui.calc.sea, lang), 'var(--steel)')}</div>
      <div className="bars"><div><span>{u(ui.calc.air, lang)}</span><i style={{ background: 'var(--signal)', width: `${(air.total / mx) * 100}%` }} /><span>{fmt0(air.total)}</span></div><div><span>{u(ui.calc.sea, lang)}</span><i style={{ background: 'var(--steel)', width: `${(sea.total / mx) * 100}%` }} /><span>{fmt0(sea.total)}</span></div></div>
      <div className="verdict">{verdict}</div>
    </div>
  );
}
