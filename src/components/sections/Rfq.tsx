'use client';
import { useEffect, useState } from 'react';
import { bi, objects, str } from '@/lib/config';
import { u, ui } from '@/lib/ui';
import { RFQ_PREFILL_KEY } from './Calculator';
import type { SectionProps } from './shared';

/** The quote form → POST /api/requests → Aamer's public door. The reference the door minted is the whole confirmation. */
export function Rfq({ s, ctx }: SectionProps) {
  const { lang } = ctx; const f = s.fields;
  const orgTypes = objects(f.organisationTypes);
  const shop = ctx.config.sections.find((x) => x.id === 'shop');
  const cats = shop ? objects(shop.items) : [];
  const [v, setV] = useState({ org: 0, name: '', company: '', phone: '', email: '', cat: str(cats[0]?.id), tender: '', product: '', urg: 0 });
  const [state, setState] = useState<{ kind: 'idle' | 'sending' | 'done' | 'error'; text?: string; reference?: string }>({ kind: 'idle' });
  const [prefill, setPrefill] = useState<Record<string, unknown> | null>(null);
  useEffect(() => {
    const load = () => { try { const raw = sessionStorage.getItem(RFQ_PREFILL_KEY); if (raw) { const p = JSON.parse(raw) as Record<string, unknown>; setPrefill(p); if (typeof p.category === 'string') setV((x) => ({ ...x, cat: p.category as string })); } } catch { /* ignore */ } };
    load(); window.addEventListener('pc-rfq-prefill', load); return () => window.removeEventListener('pc-rfq-prefill', load);
  }, []);
  const isGov = orgTypes.length === 0 ? v.org === 0 : /gov|حكوم/i.test(bi(orgTypes[v.org], 'label', 'en') + bi(orgTypes[v.org], 'label', 'ar'));
  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!v.name.trim()) return setState({ kind: 'error', text: u(ui.rfq.needName, lang) });
    if (!/^05\d{8}$/.test(v.phone.trim())) return setState({ kind: 'error', text: u(ui.rfq.needPhone, lang) });
    if (!v.product.trim()) return setState({ kind: 'error', text: u(ui.rfq.needProduct, lang) });
    setState({ kind: 'sending' });
    const category = cats.find((c) => str(c.id) === v.cat);
    const payload = {
      organisationType: orgTypes[v.org] ? bi(orgTypes[v.org], 'label', 'en') : (v.org === 0 ? 'government' : 'other'),
      category: v.cat, categoryName: category ? bi(category, 'name', 'ar') : null, tender: v.tender.trim() || null,
      urgency: ui.rfq.urgencies[v.urg]?.[1] ?? null, estimate: prefill?.estimate ?? null, calculatorInput: prefill?.input ?? null,
    };
    try {
      const res = await fetch('/api/requests', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind: 'quote', customerName: v.name.trim(), organization: v.company.trim() || null, email: v.email.trim() || null, phone: `+966${v.phone.trim().slice(1)}`, message: v.product.trim(), payload, source: { page: 'rfq', lang, path: window.location.pathname } }),
      });
      if (res.status === 429) return setState({ kind: 'error', text: u(ui.rfq.tooMany, lang) });
      if (!res.ok) return setState({ kind: 'error', text: u(ui.rfq.failed, lang) });
      const body = (await res.json()) as { reference?: string };
      setState({ kind: 'done', reference: body.reference });
      try { sessionStorage.removeItem(RFQ_PREFILL_KEY); } catch { /* ignore */ }
    } catch { setState({ kind: 'error', text: u(ui.rfq.failed, lang) }); }
  };
  const set = (k: keyof typeof v) => (ev: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setV({ ...v, [k]: ev.target.value });
  return (
    <section id="rfq" className="bg-white">
      <div className="wrap rfq-grid">
        <div className="rv">
          <p className="eyebrow">{bi(f, 'eyebrow', lang)}</p>
          <h2 style={{ marginTop: 14 }}>{bi(f, 'title', lang)}</h2>
          <p className="lead" style={{ marginTop: 14 }}>{bi(f, 'lead', lang)}</p>
          <ol className="steps-mini">{objects(s.items).map((st, i) => <li key={i}><span>{bi(st, 'text', lang)}</span></li>)}</ol>
        </div>
        {state.kind === 'done' ? (
          <div className="done" role="status" style={{ display: 'block' }}>
            <b>{u(ui.rfq.done, lang)}<span className="mono" dir="ltr">{state.reference}</span></b><br />{u(ui.rfq.doneHint, lang)}
          </div>
        ) : (
          <form noValidate onSubmit={submit}>
            {orgTypes.length ? (
              <div className="field full"><fieldset className="seg"><legend>{u(ui.rfq.orgType, lang)}</legend>
                {orgTypes.map((o, i) => <span key={i}><input type="radio" name="org" id={`o${i}`} checked={v.org === i} onChange={() => setV({ ...v, org: i })} /><label htmlFor={`o${i}`}>{bi(o, 'label', lang)}</label></span>)}
              </fieldset></div>
            ) : null}
            <div className="field"><label htmlFor="f-name">{u(ui.rfq.name, lang)}</label><input id="f-name" required value={v.name} onChange={set('name')} /></div>
            <div className="field"><label htmlFor="f-company">{u(ui.rfq.org, lang)}</label><input id="f-company" value={v.company} onChange={set('company')} /></div>
            <div className="field"><label htmlFor="f-phone">{u(ui.rfq.phone, lang)}</label><input id="f-phone" inputMode="numeric" dir="ltr" placeholder="05XXXXXXXX" value={v.phone} onChange={set('phone')} /></div>
            <div className="field"><label htmlFor="f-email">{u(ui.rfq.email, lang)}</label><input id="f-email" type="email" dir="ltr" value={v.email} onChange={set('email')} /></div>
            {cats.length ? <div className="field"><label htmlFor="f-cat">{u(ui.rfq.category, lang)}</label><select id="f-cat" value={v.cat} onChange={set('cat')}>{cats.map((c) => <option key={str(c.id)} value={str(c.id)}>{bi(c, 'name', lang)}</option>)}</select></div> : null}
            {isGov ? <div className="field full"><label htmlFor="f-tender">{u(ui.rfq.tender, lang)}</label><input id="f-tender" dir="ltr" value={v.tender} onChange={set('tender')} /></div> : null}
            <div className="field full"><label htmlFor="f-product">{u(ui.rfq.product, lang)}</label><textarea id="f-product" value={v.product} onChange={set('product')} /></div>
            <div className="field full"><fieldset className="seg"><legend>{u(ui.rfq.urgency, lang)}</legend>
              {ui.rfq.urgencies.map((x, i) => <span key={i}><input type="radio" name="urg" id={`u${i}`} checked={v.urg === i} onChange={() => setV({ ...v, urg: i })} /><label htmlFor={`u${i}`}>{u(x, lang)}</label></span>)}
            </fieldset></div>
            <button className="btn btn-accent" type="submit" disabled={state.kind === 'sending'}>{u(state.kind === 'sending' ? ui.rfq.sending : ui.rfq.send, lang)}</button>
            {state.kind === 'error' ? <div className="done" role="status" style={{ display: 'block' }}>{state.text}</div> : null}
          </form>
        )}
      </div>
    </section>
  );
}
