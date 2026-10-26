'use client';
import { useMemo, useState } from 'react';
import { arr, bi, num, objects, str, tx } from '@/lib/config';
import { u, ui } from '@/lib/ui';
import type { SectionProps } from './shared';

export function Journey({ s, ctx }: SectionProps) {
  const { lang } = ctx;
  const journeys = useMemo(() => objects(s.items), [s.items]);
  const [key, setKey] = useState(str(journeys[0]?.key, 'local'));
  const j = journeys.find((x) => str(x.key) === key) ?? journeys[0];
  const [selByKey, setSel] = useState<Record<string, number>>({});
  if (!j) return null;
  const stages = objects(j.stages), total = num(j.totalDays, 1), ticks = objects(j.ticks), legend = objects(j.legend);
  const sel = selByKey[key] ?? (key === 'rfq' ? Math.min(3, stages.length - 1) : 0);
  const show = (i: number) => setSel({ ...selByKey, [key]: (i + stages.length) % stages.length });
  const r = stages[sel];
  const pct = (d: number) => `${(d / total) * 100}%`;
  return (
    <section id="journey" className="bg-white"><div className="wrap">
      <div className="sec-head rv"><p className="eyebrow">{bi(s.fields, 'eyebrow', lang)}</p><h2>{bi(s.fields, 'title', lang)}</h2><p className="lead">{bi(j, 'lead', lang)}</p></div>
      <div className="chips j-toggle" role="tablist" aria-label="Journey type">
        {journeys.map((x) => <button key={str(x.key)} type="button" className="chip-btn" role="tab" aria-selected={str(x.key) === key} onClick={() => setKey(str(x.key))}>{str(x.key) === 'rfq' ? bi(s.fields, 'toggleRfq', lang) : bi(s.fields, 'toggleLocal', lang)}</button>)}
      </div>
      <div className="j-grid">
        <div>
          <div className="scroll-x"><div className="gantt" role="tablist" aria-label="Stages" onKeyDown={(e) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); show(sel + (e.key === 'ArrowDown' ? 1 : -1)); } }}>
            {stages.map((st, i) => (
              <button type="button" className="g-row" role="tab" id={`st-${i}`} aria-selected={i === sel} tabIndex={i === sel ? 0 : -1} key={i} onClick={() => show(i)}>
                <span className="g-label"><b>{bi(st, 'title', lang)}</b><span>{bi(st, 'duration', lang)}</span></span>
                <span className="g-track">
                  {ticks.map((t, k) => <i key={k} style={{ insetInlineStart: pct(num(t.day)) }} />)}
                  <span className={`g-bar ${str(st.kind) === 'step' ? '' : str(st.kind)}`} style={{ insetInlineStart: pct(num(st.from)), width: pct(num(st.to) - num(st.from)), animationDelay: `${i * 70}ms` }} />
                </span>
              </button>
            ))}
            <div className="g-axis" aria-hidden="true"><div className="g-label" style={{ paddingBlock: 4 }}><span>{u(ui.journey.time, lang)}</span></div><div className="ticks">{ticks.map((t, k) => <span key={k} style={{ insetInlineStart: pct(num(t.day)) }}>{bi(t, 'label', lang) || str(t.label)}</span>)}</div></div>
          </div></div>
          <div className="g-note">{legend.map((n, i) => <span key={i}><i style={{ background: str(n.tone) }} />{bi(n, 'label', lang) || str(n.label)}</span>)}</div>
        </div>
        <aside className="detail" role="tabpanel" aria-live="polite" aria-labelledby={`st-${sel}`}>
          {r ? (
            <div className="fade" style={{ display: 'grid', gap: 12 }} key={`${key}-${sel}`}>
              <span className="day mono">{u(ui.journey.step, lang)} {sel + 1} / {stages.length}</span>
              <h3>{bi(r, 'title', lang)}</h3><span className="muted" style={{ fontSize: '.85rem' }}>{bi(r, 'duration', lang)}</span><p>{bi(r, 'text', lang)}</p>
              {arr(r.details).length ? <div className="get"><small>{u(ui.journey.receive, lang)}</small><ul>{arr(r.details).map((d, i) => <li key={i}>{tx(d, lang)}</li>)}</ul></div> : null}
              <div className="nav"><button type="button" className="link-btn" onClick={() => show(sel - 1)}>{u(ui.journey.prev, lang)}</button><button type="button" className="link-btn" onClick={() => show(sel + 1)}>{u(ui.journey.next, lang)}</button></div>
            </div>
          ) : null}
        </aside>
      </div>
    </div></section>
  );
}
