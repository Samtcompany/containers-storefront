'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { JsonValue, Lang, StorefrontConfig } from '@/lib/types';
import { bi, fmt, fmt0, section, str } from '@/lib/config';
import { estimate, readRates, modeName, portName } from '@/lib/calculator';
import { kbSearch, kbText, parseEstimateQuestion } from '@/lib/kb';
import { u, ui } from '@/lib/ui';
import { Mark } from './Logo';

/** The two floating buttons: WhatsApp (a number from the published contact) and the assistant (knowledge base only). */
export function Floats({ lang, config, products }: { lang: Lang; config: StorefrontConfig; products: JsonValue[] }) {
  const [open, setOpen] = useState<'wa' | 'ai' | null>(null);
  const waRaw = str(config.contact.whatsapp).replace(/[^0-9+]/g, '');
  const waDigits = waRaw.replace(/^\+/, '').replace(/^00/, '');
  const hours = bi(config.contact, 'workingHours', lang);
  const [copied, setCopied] = useState(false);
  return (
    <>
      <div className="floats">
        <button className="fab ai" type="button" aria-label={u(ui.assistant.open, lang)} aria-expanded={open === 'ai'} onClick={() => setOpen(open === 'ai' ? null : 'ai')}>
          <span className="lbl">{u(ui.assistant.open, lang)}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M12 3l1.8 4.6L18 9.4l-4.2 1.8L12 16l-1.8-4.8L6 9.4l4.2-1.8z" /><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z" /><path d="M4 16l.6 1.4 1.4.6-1.4.6L4 20l-.6-1.4L2 18l1.4-.6z" /></svg>
        </button>
        <button className="fab wa" type="button" aria-label="WhatsApp" aria-expanded={open === 'wa'} onClick={() => setOpen(open === 'wa' ? null : 'wa')}>
          <span className="lbl">{u(ui.wa.open, lang)}</span>
          <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.6.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.8 12 12 0 0 0 4.6 4c1.7.7 2.3.8 3.1.7a2.7 2.7 0 0 0 1.8-1.3 2.2 2.2 0 0 0 .1-1.2c0-.1-.2-.2-.5-.3z" /></svg>
        </button>
      </div>
      <div className="wa-pop" hidden={open !== 'wa'}>
        <b>{u(ui.wa.title, lang)}</b>
        {hours ? <span className="muted" style={{ fontSize: '.85rem' }}>{hours}</span> : null}
        {waDigits ? (
          <>
            <div className="num"><span dir="ltr">{waRaw}</span><button type="button" onClick={() => { navigator.clipboard?.writeText(waRaw).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }).catch(() => undefined); }}>{u(copied ? ui.wa.copied : ui.wa.copy, lang)}</button></div>
            <a className="btn btn-primary" href={`https://wa.me/${waDigits}`} target="_blank" rel="noopener">{u(ui.wa.go, lang)}</a>
          </>
        ) : <small>{u(ui.wa.placeholder, lang)}</small>}
      </div>
      {open === 'ai' ? <Assistant lang={lang} config={config} products={products} onClose={() => setOpen(null)} /> : null}
    </>
  );
}

type Msg = { role: 'a' | 'u'; html: string };

function Assistant({ lang, config, products, onClose }: { lang: Lang; config: StorefrontConfig; products: JsonValue[]; onClose: () => void }) {
  const rates = useMemo(() => readRates(config.calculator), [config.calculator]);
  const text = useMemo(() => kbText(config.assistant, section(config, 'faq')?.items ?? [], products), [config, products]);
  const [msgs, setMsgs] = useState<Msg[]>([{ role: 'a', html: esc(u(ui.assistant.welcome, lang)) }]);
  const [input, setInput] = useState('');
  const bodyRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bodyRef.current?.scrollTo({ top: 1e9 }); }, [msgs]);

  const answer = (q: string): string => {
    const p = parseEstimateQuestion(q);
    if (p.value && p.value >= 500) {
      const volume = !p.volume && !p.weight ? Math.max(1, Math.round(p.value / 4000)) : p.volume;
      const e = estimate(rates, { value: p.value, volume, weight: p.weight, cat: p.cat, mode: p.mode, port: rates.ports[0]?.id ?? 'JED', insurance: true });
      const intro = u(ui.assistant.estimateIntro, lang)
        .replace('{v}', fmt0(p.value)).replace('{vol}', volume ? (lang === 'en' ? `, ${volume} m³` : ` بحجم ${volume} م³`) : '')
        .replace('{kg}', p.weight ? (lang === 'en' ? `, ${p.weight} kg` : ` ووزن ${p.weight} كجم`) : '').replace('{mode}', modeName(rates, e.mode, lang)).replace('{port}', portName(rates, e.port, lang));
      const cur = u(ui.sar, lang);
      const rows: Array<[string, number]> = [[u(ui.assistant.estRows.goods, lang), e.value], [u(ui.assistant.estRows.freight, lang), e.freight], [u(ui.assistant.estRows.duty, lang), e.duty], [u(ui.assistant.estRows.clearance, lang), e.clearance + e.handling + e.local], [u(ui.assistant.estRows.service, lang), e.service], [`${u(ui.assistant.estRows.vat, lang)} ${Math.round(rates.vatRate * 100)}%`, e.vat]];
      return `${esc(intro)}<div class="est">${rows.map((r) => `<div><span>${esc(r[0])}</span><span>${fmt(r[1])}</span></div>`).join('')}<div class="t"><span>${esc(u(ui.assistant.estTotal, lang))}</span><span>${fmt(e.total)} ${esc(cur)}</span></div></div><br>${esc(u(ui.assistant.wantQuote, lang))}`;
    }
    if (/عرض سعر|quote/i.test(q)) { setTimeout(() => document.getElementById('rfq')?.scrollIntoView({ behavior: 'smooth' }), 400); return esc(u(ui.assistant.openedRfq, lang)); }
    const hits = kbSearch(text, q);
    if (hits.length) return hits.map(esc).join('<br>') + `<br><small class="muted">${esc(u(ui.assistant.fromKb, lang))}</small>`;
    if (process.env.NEXT_PUBLIC_SNAPSHOT !== '1') void fetch('/api/unanswered', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question: q.slice(0, 500), language: lang }) }).catch(() => undefined);
    return esc(u(ui.assistant.noAnswer, lang));
  };
  const send = (q: string) => {
    const t = q.trim(); if (!t) return;
    setMsgs((m) => [...m, { role: 'u', html: esc(t) }, { role: 'a', html: answer(t) }]); setInput('');
  };
  return (
    <div className="ai-panel" role="dialog" aria-labelledby="ai-title">
      <div className="ai-h">
        <span className="av"><Mark light /></span>
        <div><b id="ai-title">{bi(config.assistant, 'name', lang) || 'Prime assistant'}</b><small><i /><span>{u(ui.assistant.status, lang)}</span></small></div>
        <button type="button" className="x" aria-label={u(ui.assistant.close, lang)} onClick={onClose}>×</button>
      </div>
      <div className="ai-body" ref={bodyRef}>
        {msgs.map((m, i) => <div key={i} className={`msg ${m.role}`} dangerouslySetInnerHTML={{ __html: m.html }} />)}
        {msgs.length === 1 ? <div className="chips-ai">{ui.assistant.chips.map((c, i) => <button key={i} type="button" onClick={() => send(u(c, lang))}>{u(c, lang)}</button>)}</div> : null}
      </div>
      <div className="ai-f">
        <textarea rows={1} aria-label="Message" placeholder={u(ui.assistant.placeholder, lang)} value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input); } }} />
        <button className="btn btn-primary" type="button" onClick={() => send(input)}>{u(ui.assistant.send, lang)}</button>
      </div>
      <div className="ai-note">{u(ui.assistant.note, lang)}</div>
    </div>
  );
}
/** Everything the assistant prints came from a visitor or the company's text: escape it, then add only our own markup. */
function esc(s: string): string { return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string)); }
