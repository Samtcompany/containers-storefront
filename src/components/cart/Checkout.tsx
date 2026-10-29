'use client';
import { useState } from 'react';
import { arr, bi, fmt, isObject, num, str } from '@/lib/config';
import { u, ui } from '@/lib/ui';
import { useCart } from './CartProvider';
import { door, prototype, rememberMine } from '@/lib/door';

/**
 * Three steps — the cart, the delivery address, the confirmation — and the last one is a QUOTE
 * REQUEST through Aamer's public door with the cart in its payload. Payment is arranged with the
 * company after confirmation (the document says how); no gateway is presupposed.
 */
type Addr = { name: string; phone: string; email: string; city: string; district: string; street: string; building: string; notes: string };
const EMPTY: Addr = { name: '', phone: '', email: '', city: '', district: '', street: '', building: '', notes: '' };

export function Checkout() {
  const c = useCart();
  const { lang } = c;
  const [step, setStep] = useState(0);
  const [addr, setAddr] = useState<Addr>(EMPTY);
  const [errs, setErrs] = useState<Partial<Record<keyof Addr, string>>>({});
  const [state, setState] = useState<{ kind: 'idle' | 'sending' | 'done' | 'error'; text?: string; reference?: string }>({ kind: 'idle' });
  if (!c.checkout) return null;
  const shop = c.config.sections.find((s) => s.id === 'shop');
  const co = shop && isObject(shop.fields.checkout) ? shop.fields.checkout : {};
  const cities = arr(co.cities).filter(Array.isArray).map((r) => ({ id: str(r[0]), name: lang === 'en' ? str(r[2]) : str(r[1]), fee: num(r[3]), days: str(r[4]) }));
  const freeFrom = num(co.freeShippingFrom, 500), vatRate = num(co.vatRate, 0.15);
  const city = cities.find((x) => x.id === addr.city) ?? null;
  const ship = step >= 1 && city ? (c.subtotal >= freeFrom ? 0 : city.fee) : null;
  const total = c.subtotal + (ship ?? 0);
  const money = (n: number) => <><span className="num" dir="ltr">{fmt(n)}</span> {u(ui.sar, lang)}</>;
  const close = () => { c.setCheckout(false); if (state.kind === 'done') { c.clear(); setStep(0); setState({ kind: 'idle' }); } };
  const set = (k: keyof Addr) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setAddr({ ...addr, [k]: e.target.value });
  const validate = () => {
    const e: typeof errs = {};
    if (!addr.name.trim()) e.name = u(ui.checkout.needName, lang);
    if (!/^05\d{8}$/.test(addr.phone.trim())) e.phone = u(ui.checkout.needPhone, lang);
    if (!addr.city) e.city = u(ui.checkout.needCity, lang);
    if (!addr.district.trim()) e.district = u(ui.checkout.needDistrict, lang);
    setErrs(e); return Object.keys(e).length === 0;
  };
  const submit = async () => {
    if (process.env.NEXT_PUBLIC_SNAPSHOT === '1' && !prototype) return setState({ kind: 'error', text: u(ui.rfq.preview, lang) });
    setState({ kind: 'sending' });
    const items = c.lines.map((l) => { const p = c.product(l.id); return { itemId: l.id, sku: p?.sku, name: p?.name, qty: l.qty, unitPrice: p?.price, lineTotal: (p?.price ?? 0) * l.qty }; });
    const message = `${u(ui.checkout.messageHead, lang)}\n${items.map((i) => `• ${i.name} × ${i.qty} = ${fmt(i.lineTotal)} ${u(ui.sar, lang)}`).join('\n')}\n${u(ui.checkout.messageTotal, lang)} ${fmt(total)} ${u(ui.sar, lang)}\n${u(ui.checkout.messageTo, lang)} ${city?.name ?? ''}، ${addr.district}${addr.street ? `، ${addr.street}` : ''}${addr.building ? ` ${addr.building}` : ''}${addr.notes ? `\n${addr.notes}` : ''}`;
    const body = {
      kind: 'quote', customerName: addr.name.trim(), organization: null, email: addr.email.trim() || null, phone: `+966${addr.phone.trim().slice(1)}`, message,
      payload: { origin: 'store-cart', cart: items, subtotal: c.subtotal, shipping: ship, total, vatIncluded: total - total / (1 + vatRate), delivery: { city: addr.city, cityName: city?.name, district: addr.district, street: addr.street, building: addr.building, notes: addr.notes, days: city?.days } },
      source: { page: 'store-checkout', lang, path: window.location.pathname },
    };
    if (prototype) {
      const r = door()?.submitRequest(body);
      if (!r || !r.reference) return setState({ kind: 'error', text: u(ui.rfq.failed, lang) });
      rememberMine(r.reference, addr.phone.trim());
      setState({ kind: 'done', reference: r.reference }); setStep(2); return;
    }
    try {
      const res = await fetch('/api/requests', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.status === 429) return setState({ kind: 'error', text: u(ui.rfq.tooMany, lang) });
      if (!res.ok) return setState({ kind: 'error', text: u(ui.rfq.failed, lang) });
      const reply = (await res.json()) as { reference?: string };
      setState({ kind: 'done', reference: reply.reference }); setStep(2);
    } catch { setState({ kind: 'error', text: u(ui.rfq.failed, lang) }); }
  };
  const steps = [ui.checkout.stepCart, ui.checkout.stepDelivery, ui.checkout.stepConfirm];
  const field = (k: keyof Addr, label: string, opts: { full?: boolean; ltr?: boolean; ph?: string; num?: boolean } = {}) => (
    <div className={`field${opts.full ? ' full' : ''}`}>
      <label htmlFor={`co-${k}`}>{label}</label>
      <input id={`co-${k}`} value={addr[k]} onChange={set(k)} dir={opts.ltr ? 'ltr' : undefined} placeholder={opts.ph} inputMode={opts.num ? 'numeric' : undefined} className={errs[k] ? 'invalid' : undefined} />
      <span className="err">{errs[k] ?? ''}</span>
    </div>
  );
  return (
    <div className="co-wrap">
      <div className="overlay" style={{ zIndex: 0 }} onClick={close} />
      <div className="co" role="dialog" aria-labelledby="co-title">
        <div className="dh"><h3 id="co-title">{u(ui.checkout.title, lang)}</h3><button type="button" className="x" aria-label={u(ui.assistant.close, lang)} onClick={close}>×</button></div>
        <div className="co-body">
          <div className="co-main">
            <ol className="steps">{steps.map((s, i) => <li key={i} className={i === step ? 'on' : i < step ? 'past' : ''}>{u(s, lang)}</li>)}</ol>
            {step === 0 ? (
              <>
                <div className="lines" style={{ padding: 0 }}>
                  {c.lines.map((l) => { const p = c.product(l.id); return p ? <div className="line" key={l.id}><span className="th"><span className="mono" style={{ fontSize: '.6rem' }}>{p.sku}</span></span><div><b>{p.name}</b><small>{money(p.price)}</small></div><div className="side"><span className="num">× {l.qty}</span><button type="button" className="rm" onClick={() => c.remove(l.id)}>{u(ui.cart.remove, lang)}</button></div></div> : null; })}
                </div>
                <div className="co-nav"><button type="button" className="btn btn-ghost" onClick={close}>{u(ui.checkout.continueShopping, lang)}</button><button type="button" className="btn btn-primary" disabled={c.lines.length === 0} onClick={() => setStep(1)}>{u(ui.checkout.next, lang)}</button></div>
              </>
            ) : null}
            {step === 1 ? (
              <>
                <div className="f-grid">
                  {field('name', u(ui.checkout.name, lang))}{field('phone', u(ui.rfq.phone, lang), { ltr: true, ph: '05XXXXXXXX', num: true })}
                  {field('email', u(ui.rfq.email, lang), { ltr: true, full: true })}
                  <div className="field"><label htmlFor="co-city">{u(ui.checkout.city, lang)}</label>
                    <select id="co-city" value={addr.city} onChange={set('city')} className={errs.city ? 'invalid' : undefined}><option value="">—</option>{cities.map((x) => <option key={x.id} value={x.id}>{x.name} · {x.days} {u(ui.days, lang)}</option>)}</select><span className="err">{errs.city ?? ''}</span></div>
                  {field('district', u(ui.checkout.district, lang))}{field('street', u(ui.checkout.street, lang))}{field('building', u(ui.checkout.building, lang), { ltr: true })}
                  <div className="field full"><label htmlFor="co-notes">{u(ui.checkout.notes, lang)}</label><textarea id="co-notes" value={addr.notes} onChange={set('notes')} /></div>
                </div>
                <p className="note-box">{bi(co, 'paymentNote', lang)}</p>
                {state.kind === 'error' ? <div className="done" role="status" style={{ display: 'block' }}>{state.text}</div> : null}
                <div className="co-nav"><button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>{u(ui.checkout.back, lang)}</button><button type="button" className="btn btn-accent" disabled={state.kind === 'sending'} onClick={() => { if (validate()) void submit(); }}>{u(state.kind === 'sending' ? ui.rfq.sending : ui.checkout.confirm, lang)}</button></div>
              </>
            ) : null}
            {step === 2 ? (
              <div className="center">
                <span className="ok-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m5 12 4.5 4.5L19 7" /></svg></span>
                <h3>{u(ui.checkout.doneTitle, lang)}</h3>
                <p className="lead" style={{ textAlign: 'center' }}>{u(ui.checkout.doneText, lang)}</p>
                <div className="receipt"><dl>
                  <dt>{u(ui.checkout.reference, lang)}</dt><dd className="mono" dir="ltr">{state.reference}</dd>
                  <dt>{u(ui.checkout.total, lang)}</dt><dd>{money(total)}</dd>
                  <dt>{u(ui.checkout.city, lang)}</dt><dd>{city?.name} · {city?.days} {u(ui.days, lang)}</dd>
                </dl></div>
                {prototype && state.reference ? <a className="btn btn-accent" href={`${window.location.pathname.replace(/store\/?(index\.html)?$/, '')}?track=${state.reference}#tracking`}>{u(ui.portal.openPortal, lang)}</a> : null}
                <button type="button" className="btn btn-primary" onClick={close}>{u(ui.checkout.finish, lang)}</button>
              </div>
            ) : null}
          </div>
          <aside className="co-side">
            <h3>{u(ui.checkout.summary, lang)}</h3>
            <div className="mini">{c.lines.map((l) => { const p = c.product(l.id); return p ? <div key={l.id}><span>{p.name} × {l.qty}</span><span>{money(p.price * l.qty)}</span></div> : null; })}</div>
            <div className="row"><span>{u(ui.cart.subtotal, lang)}</span><span>{money(c.subtotal)}</span></div>
            <div className="row"><span>{u(ui.cart.shipping, lang)}</span><span>{ship === null ? u(ui.checkout.byCity, lang) : ship === 0 ? u(ui.checkout.free, lang) : money(ship)}</span></div>
            <div className="row t"><span>{u(ui.checkout.total, lang)}</span><span>{money(total)}</span></div>
            <div className="row muted" style={{ fontSize: '.78rem' }}><span>{u(ui.cart.inclVat, lang)}</span><span>{money(total - total / (1 + vatRate))}</span></div>
            <p className="note-box">{bi(co, 'note', lang)}</p>
          </aside>
        </div>
      </div>
    </div>
  );
}
