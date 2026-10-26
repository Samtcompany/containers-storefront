'use client';
import { useMemo, useState } from 'react';
import { bi, objects, str } from '@/lib/config';
import { u, ui } from '@/lib/ui';
import { SecHead, type SectionProps } from './shared';

export function Clients({ s, ctx }: SectionProps) {
  const { lang } = ctx;
  const clients = useMemo(() => objects(s.items), [s.items]);
  const sectors = useMemo(() => {
    const seen = new Map<string, string>();
    for (const c of clients) { const id = str(c.sector); if (id && !seen.has(id)) seen.set(id, bi(c, 'sector', lang)); }
    return [...seen.entries()];
  }, [clients, lang]);
  const [cf, setCf] = useState('all');
  const tile = (c: (typeof clients)[number], i: number, hidden: boolean) => (
    <div className={`client${cf !== 'all' && str(c.sector) !== cf ? ' dim' : ''}`} key={`${hidden ? 'h' : 'v'}-${i}`} aria-hidden={hidden || undefined}>
      <span className="mark">{str(c.mark)}</span><b>{bi(c, 'name', lang)}</b><span>{bi(c, 'sector', lang)}</span>
    </div>
  );
  return (
    <section id="clients" className="clients bg-grey">
      <div className="wrap rv">
        <SecHead s={s} lang={lang} className="sec-head" />
        <div className="chips" role="group" aria-label="Filter by sector">
          <button type="button" className="chip-btn" aria-pressed={cf === 'all'} onClick={() => setCf('all')}>{u(ui.clients.all, lang)}</button>
          {sectors.map(([id, label]) => <button key={id} type="button" className="chip-btn" aria-pressed={cf === id} onClick={() => setCf(id)}>{label}</button>)}
        </div>
      </div>
      <div className="marquee"><div className="track">{clients.map((c, i) => tile(c, i, false))}{clients.map((c, i) => tile(c, i, true))}</div></div>
    </section>
  );
}
