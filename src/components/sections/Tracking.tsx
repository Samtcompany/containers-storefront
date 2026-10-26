'use client';
import { useState } from 'react';
import { bi, objects, str, num } from '@/lib/config';
import { u, ui } from '@/lib/ui';
import { SecHead, type SectionProps } from './shared';

/**
 * Tracking. The references the document declares in `tracking.items` are drawn as a timeline along
 * the journey's stages (illustrative, and labelled so). Every other reference is answered honestly:
 * live tracking is connected to Amer orders in SF-3.
 */
export function Tracking({ s, ctx }: SectionProps) {
  const { lang } = ctx;
  const [ref, setRef] = useState('');
  const [asked, setAsked] = useState<string | null>(null);
  const demos = objects(s.items);
  const journey = ctx.config.sections.find((x) => x.id === 'journey');
  const hit = asked ? demos.find((d) => str(d.reference).toUpperCase() === asked) ?? null : null;
  const stages = hit ? objects(objects(journey?.items).find((j) => str(j.key) === str(hit.journey))?.stages) : [];
  const stage = hit ? Math.min(num(hit.stage), Math.max(stages.length - 1, 0)) : 0;
  const look = (r: string) => { setRef(r); setAsked(r.trim().toUpperCase()); };
  return (
    <section id="tracking" className="bg-grey"><div className="wrap">
      <SecHead s={s} lang={lang} />
      <form className="track-box rv" onSubmit={(e) => { e.preventDefault(); look(ref); }} noValidate>
        <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder={u(ui.tracking.placeholder, lang)} autoComplete="off" aria-label="Reference" dir="ltr" />
        <button className="btn btn-primary" type="submit">{u(ui.tracking.track, lang)}</button>
      </form>
      {demos.length ? (
        <p className="track-demo">{bi(s.fields, 'demo', lang)}{demos.map((d, i) => <span key={str(d.reference)}>{i > 0 ? (lang === 'en' ? ' or ' : ' أو ') : ' '}<button type="button" onClick={() => look(str(d.reference))}>{str(d.reference)}</button></span>)}</p>
      ) : null}
      {asked !== null && hit === null ? (
        <div className="track-res" role="status">
          <div className="track-head">
            <div><b>{u(ui.tracking.notFound, lang)}</b><br /><small>{bi(s.fields, 'placeholder', lang) || u(ui.tracking.hint, lang)}</small></div>
            <span className="pill" dir="ltr">{asked || '—'}</span>
          </div>
        </div>
      ) : null}
      {hit ? (
        <div className="track-res" role="status">
          <div className="track-head">
            <div>
              <b className="mono" dir="ltr">{str(hit.reference)}</b><br />
              <small>{bi(hit, 'customer', lang)} · {bi(hit, 'item', lang)}</small><br />
              <small style={{ color: 'var(--steel)' }}>{bi(hit, 'eta', lang)}</small>
              {hit.illustrative === true ? <><br /><small className="muted">{u(ui.tracking.illustrative, lang)}</small></> : null}
            </div>
            <span className="pill">{stages[stage] ? bi(stages[stage], 'title', lang) : ''}</span>
          </div>
          <ol className="tl">
            {stages.map((r, i) => (
              <li key={i} className={i < stage ? 'done' : i === stage ? 'now' : 'todo'}>
                <span className="dot">{i < stage ? '✓' : i + 1}</span>
                <div><b>{bi(r, 'title', lang)}</b><small>{i === stage ? bi(hit, 'extra', lang) : bi(r, 'duration', lang)}</small></div>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
    </div></section>
  );
}
