'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { u, ui } from '@/lib/ui';
import type { Lang } from '@/lib/types';
import { door, mine, minorText, type ActionResult, type CustomerDeal, type TrackResult } from '@/lib/door';

/**
 * PROTOTYPE MODE ONLY — the customer's deal-tracking portal (SF-3 in preview).
 *
 * Reads the customer view Aamer's door returns for a reference AND the mobile that placed it (the
 * live portal sends a one-time code instead). Every figure comes from that view; the portal never
 * sees cost, margin, supplier payments or internal reasons because the door never returns them.
 * A payment made here is a gateway notice: it shows «قيد التحقق» until Finance settles it in Aamer.
 */
export function Portal({ lang }: { lang: Lang }) {
  const p = ui.portal;
  const [ref, setRef] = useState('');
  const [mobile, setMobile] = useState('');
  const [res, setRes] = useState<TrackResult | null>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [why, setWhy] = useState('');
  const [note, setNote] = useState('');
  const [list, setList] = useState<Array<{ reference: string; phone: string }>>([]);
  const mobileRef = useRef(mobile);
  mobileRef.current = mobile;

  const look = useCallback((r: string, m: string) => {
    const d = door();
    if (!d) return;
    if (!/^05\d{8}$/.test(m.trim())) { setRes(null); setMsg({ ok: false, text: u(p.needMobile, lang) }); return; }
    setMsg(null);
    setRes(d.track(r.trim(), m.trim()));
  }, [lang, p.needMobile]);

  useEffect(() => {
    setList(mine());
    try {
      const q = new URLSearchParams(window.location.search).get('track');
      if (q) { setRef(q); const own = mine().find((x) => x.reference === q.toUpperCase()); if (own) { setMobile(own.phone); look(q, own.phone); } }
    } catch { /* no query string */ }
    // Aamer writes to the same browser state: refresh the open deal when it does.
    const onStorage = (e: StorageEvent) => { if (e.key === 'pc-proto-state-v1') setRes((cur) => { const d = door(); return cur && cur.reference && d ? d.track(cur.reference, mobileRef.current) : cur; }); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [look]);

  const after = (r: ActionResult) => {
    if (r.error) { setMsg({ ok: false, text: u(p.failedAction, lang) + r.error }); return; }
    setMsg({ ok: true, text: u(p.doneAction, lang) });
    if (res && res.reference) setRes(door()?.track(res.reference, mobile) ?? res);
  };

  const deal = res && !res.error ? res.deal ?? null : null;
  return (
    <div className="portal">
      <p className="portal-proto">{u(p.prototype, lang)}</p>
      <form className="portal-find" onSubmit={(e) => { e.preventDefault(); look(ref, mobile); }} noValidate>
        <div className="field"><label htmlFor="pt-ref">{u(p.reference, lang)}</label><input id="pt-ref" dir="ltr" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="SF-2026-00000 / PC-2026-0000" autoComplete="off" /></div>
        <div className="field"><label htmlFor="pt-mobile">{u(p.mobile, lang)}</label><input id="pt-mobile" dir="ltr" inputMode="numeric" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="05XXXXXXXX" /></div>
        <button className="btn btn-primary" type="submit">{u(p.open, lang)}</button>
      </form>
      {list.length ? (
        <p className="portal-mine">{u(p.mine, lang)} {list.map((x) => <button type="button" key={x.reference} className="chip-btn" onClick={() => { setRef(x.reference); setMobile(x.phone); look(x.reference, x.phone); }}><span className="mono" dir="ltr">{x.reference}</span></button>)}</p>
      ) : null}
      {msg ? <div className={`portal-msg ${msg.ok ? 'ok' : 'bad'}`} role="status">{msg.text}</div> : null}
      {res && res.error ? <div className="portal-msg bad" role="status">{u(p.notFound, lang)}</div> : null}
      {res && !res.error && res.mockPhone ? <p className="portal-note">{u(p.mockPhone, lang)}</p> : null}

      {res && !res.error && res.request && !deal ? (
        <div className="track-res" role="status"><div className="track-head">
          <div><b className="mono" dir="ltr">{res.request.ref}</b><br /><small>{res.request.category ?? ''} · {res.request.message}</small></div>
          <span className="pill">{u(res.request.status === 'lost' ? p.requestLost : res.request.status === 'new' ? p.requestNew : p.requestWork, lang)}</span>
        </div></div>
      ) : null}

      {deal ? <DealView deal={deal} lang={lang} mobile={mobile} why={why} setWhy={setWhy} note={note} setNote={setNote} after={after} requestRef={res?.request?.ref ?? null} /> : null}
    </div>
  );
}

function DealView({ deal, lang, mobile, why, setWhy, note, setNote, after, requestRef }: {
  deal: CustomerDeal; lang: Lang; mobile: string; why: string; setWhy: (v: string) => void; note: string; setNote: (v: string) => void; after: (r: ActionResult) => void; requestRef: string | null;
}) {
  const p = ui.portal; const d = door();
  const money = (m: number, c: string) => <><span className="num" dir="ltr">{minorText(m)}</span> {c === 'SAR' ? u(ui.sar, lang) : c}</>;
  const PAY: Record<string, readonly [string, string]> = { paid: p.paid, verifying: p.verifying, overdue: p.overdue, due: p.due, scheduled: p.scheduled };
  const RES: Record<string, readonly [string, string]> = { passed: p.passed, failed: p.failed, conditional: p.conditional };
  return (
    <div className="track-res portal-deal" role="region" aria-label={deal.no}>
      <div className="track-head">
        <div>
          <b className="mono" dir="ltr">{deal.no}</b>{requestRef ? <small className="mono" dir="ltr"> · {requestRef}</small> : null}<br />
          <small>{deal.title} · {deal.typeLabel}</small><br />
          {deal.expectedDelivery ? <small>{u(p.expected, lang)}: <span className="num" dir="ltr">{deal.expectedDelivery}</span></small> : null}
        </div>
        <span className="pill">{deal.cancelled ? '—' : lang === 'en' ? deal.milestones[deal.milestone].en : deal.milestones[deal.milestone].ar}</span>
      </div>
      {deal.cancelled ? <div className="portal-msg bad">{u(p.cancelled, lang)}</div> : null}

      <h4 className="portal-h">{u(p.milestones, lang)}</h4>
      <ol className="tl">
        {deal.milestones.map((m, i) => (
          <li key={m.key} className={deal.closed || i < deal.milestone ? 'done' : i === deal.milestone ? 'now' : 'todo'}>
            <span className="dot">{deal.closed || i < deal.milestone ? '✓' : i + 1}</span>
            <div><b>{lang === 'en' ? m.en : m.ar}</b></div>
          </li>
        ))}
      </ol>

      <div className="portal-grid">
        <section>
          <h4 className="portal-h">{u(p.items, lang)}</h4>
          <ul className="portal-list">{deal.lines.map((l, i) => <li key={i}><span>{l.description}</span><span className="num" dir="ltr">× {l.qty}</span></li>)}</ul>
        </section>

        {deal.quote ? (
          <section>
            <h4 className="portal-h">{u(p.quote, lang)} <small className="muted">{u(p.version, lang)} {deal.quote.version} · <span className="num" dir="ltr">{deal.quote.date}</span></small></h4>
            <p className="portal-big">{money(deal.quote.totalMinor, deal.quote.currency)}</p>
            {deal.quote.decision ? <p className={`portal-msg ${deal.quote.decision === 'accepted' ? 'ok' : 'bad'}`}>{u(deal.quote.decision === 'accepted' ? p.accepted : p.declined, lang)}</p> : null}
            {deal.actions.acceptQuote && d ? (
              <div className="portal-actions">
                <button className="btn btn-accent" type="button" onClick={() => after(d.decideQuote(deal.no, mobile, 'accepted'))}>{u(p.accept, lang)}</button>
                <input aria-label={u(p.declineWhy, lang)} placeholder={u(p.declineWhy, lang)} value={why} onChange={(e) => setWhy(e.target.value)} />
                <button className="btn btn-ghost" type="button" onClick={() => after(d.decideQuote(deal.no, mobile, 'rejected', why.trim()))}>{u(p.decline, lang)}</button>
              </div>
            ) : null}
          </section>
        ) : null}

        {deal.brokerage ? (
          <section>
            <h4 className="portal-h">{u(p.fees, lang)}</h4>
            <ul className="portal-list">
              <li><span>{u(deal.brokerage.feeBasis === 'fixed' ? p.feeFixed : p.feePercent, lang)}</span><span>{deal.brokerage.feeBasis === 'fixed' && deal.brokerage.feeAmountMinor !== null ? money(deal.brokerage.feeAmountMinor, 'SAR') : deal.brokerage.feeRateBp !== null ? <span className="num" dir="ltr">{(deal.brokerage.feeRateBp / 100).toFixed(2)}%</span> : '—'}</span></li>
              {deal.brokerage.factory ? <li><span>{u(p.factory, lang)}</span><span>{deal.brokerage.factory}</span></li> : null}
              {deal.brokerage.importerOfRecord ? <li><span>{u(p.importer, lang)}</span><span>{deal.brokerage.importerOfRecord}</span></li> : null}
            </ul>
            {deal.brokerage.acceptedAt ? <p className="portal-msg ok">{u(p.accepted, lang)}</p> : null}
            {deal.actions.acceptFees && d ? <div className="portal-actions"><button className="btn btn-accent" type="button" onClick={() => after(d.decideQuote(deal.no, mobile, 'accepted'))}>{u(p.acceptFees, lang)}</button></div> : null}
          </section>
        ) : null}

        {deal.payments.length ? (
          <section>
            <h4 className="portal-h">{u(p.payments, lang)}</h4>
            <ul className="portal-list">
              {deal.payments.map((pay) => (
                <li key={pay.id}>
                  <span>{pay.label}<br /><small className="muted num" dir="ltr">{pay.dueDate}</small></span>
                  <span className="portal-pay">
                    {money(pay.amountMinor, pay.currency)}
                    <span className={`portal-st st-${pay.status}`}>{u(PAY[pay.status], lang)}</span>
                    {pay.viaBank && pay.status !== 'paid' ? <small className="muted">{u(p.viaBank, lang)}</small> : null}
                    {deal.actions.pay.includes(pay.id) && d ? <button className="btn btn-primary" type="button" onClick={() => after(d.reportPayment(deal.no, mobile, pay.id))}>{u(p.pay, lang)}</button> : null}
                  </span>
                </li>
              ))}
            </ul>
            <p className="portal-note">{u(p.payNote, lang)}</p>
          </section>
        ) : null}

        {deal.refunds.length ? (
          <section>
            <h4 className="portal-h">{u(p.refunds, lang)}</h4>
            <ul className="portal-list">{deal.refunds.map((r) => <li key={r.id}><span>{r.label}<br /><small className="muted num" dir="ltr">{r.dueDate}</small></span><span className="portal-pay">{money(r.amountMinor, r.currency)}<span className={`portal-st st-${r.paid ? 'paid' : 'verifying'}`}>{u(r.paid ? p.refundPaid : p.refundDue, lang)}</span></span></li>)}</ul>
          </section>
        ) : null}

        {deal.inspection ? (
          <section>
            <h4 className="portal-h">{u(p.inspection, lang)}</h4>
            <ul className="portal-list">
              <li><span className="num" dir="ltr">{deal.inspection.date}</span><span className={`portal-st st-${deal.inspection.result === 'passed' ? 'paid' : 'overdue'}`}>{u(RES[deal.inspection.result] ?? p.conditional, lang)}</span></li>
              {deal.inspection.defectsPct !== null ? <li><span>{u(p.defects, lang)}</span><span className="num" dir="ltr">{deal.inspection.defectsPct}%</span></li> : null}
            </ul>
            {deal.inspectionAcknowledged ? <p className="portal-msg ok">{u(p.acked, lang)}</p> : null}
            {deal.actions.acknowledgeInspection && d ? <div className="portal-actions"><button className="btn btn-ghost" type="button" onClick={() => after(d.acknowledgeInspection(deal.no, mobile))}>{u(p.ack, lang)}</button></div> : null}
          </section>
        ) : null}

        {deal.shipments.length ? (
          <section>
            <h4 className="portal-h">{u(p.shipments, lang)}</h4>
            <ul className="portal-list">
              {deal.shipments.map((s) => (
                <li key={s.id}>
                  <span>{s.pol} ← {s.pod}<br /><small className="muted">{u(p.bl, lang)}: <span className="mono" dir="ltr">{s.bl ?? '—'}</span> · {u(p.containers, lang)}: <span className="mono" dir="ltr">{s.containers.map((c) => c.no).join(', ') || '—'}</span></small></span>
                  <span><small>{u(p.etd, lang)} <span className="num" dir="ltr">{s.atd ?? s.etd ?? '—'}</span></small><br /><small>{u(p.eta, lang)} <span className="num" dir="ltr">{s.ata ?? s.eta ?? '—'}</span></small></span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {deal.invoices.length ? (
          <section>
            <h4 className="portal-h">{u(p.invoices, lang)}</h4>
            <ul className="portal-list">{deal.invoices.map((i) => <li key={i.no}><span className="mono" dir="ltr">{i.no}</span><span>{money(i.amountMinor, i.currency)}</span></li>)}</ul>
          </section>
        ) : null}

        <section>
          <h4 className="portal-h">{u(p.documents, lang)}</h4>
          <ul className="portal-list">{deal.documents.length ? deal.documents.map((x, i) => <li key={i}><span>{x.name}</span><span className="num" dir="ltr">{x.date ?? ''}</span></li>) : <li><span className="muted">—</span></li>}</ul>
          {deal.deliveryConfirmed ? <p className="portal-msg ok">{u(p.delivered, lang)}</p> : null}
          {deal.actions.confirmDelivery && d ? (
            <div className="portal-actions">
              <input aria-label={u(p.deliveryNote, lang)} placeholder={u(p.deliveryNote, lang)} value={note} onChange={(e) => setNote(e.target.value)} />
              <button className="btn btn-accent" type="button" onClick={() => after(d.confirmDelivery(deal.no, mobile, note.trim()))}>{u(p.confirmDelivery, lang)}</button>
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
