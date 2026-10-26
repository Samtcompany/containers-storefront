'use client';
import { useState } from 'react';
import { bi } from '@/lib/config';
import { u, ui } from '@/lib/ui';
import { SecHead, type SectionProps } from './shared';

/** Live tracking is connected to Amer orders in SF-3; until then the form answers honestly with what the configuration declares. */
export function Tracking({ s, ctx }: SectionProps) {
  const { lang } = ctx;
  const [ref, setRef] = useState('');
  const [asked, setAsked] = useState<string | null>(null);
  return (
    <section id="tracking" className="bg-grey"><div className="wrap">
      <SecHead s={s} lang={lang} />
      <form className="track-box rv" onSubmit={(e) => { e.preventDefault(); setAsked(ref.trim().toUpperCase()); }} noValidate>
        <input value={ref} onChange={(e) => setRef(e.target.value)} placeholder={u(ui.tracking.placeholder, lang)} autoComplete="off" aria-label="Reference" dir="ltr" />
        <button className="btn btn-primary" type="submit">{u(ui.tracking.track, lang)}</button>
      </form>
      {asked !== null ? (
        <div className="track-res" role="status">
          <div className="track-head">
            <div><b>{u(ui.tracking.notFound, lang)}</b><br /><small>{bi(s.fields, 'placeholder', lang) || u(ui.tracking.hint, lang)}</small></div>
            <span className="pill" dir="ltr">{asked || '—'}</span>
          </div>
        </div>
      ) : null}
    </div></section>
  );
}
