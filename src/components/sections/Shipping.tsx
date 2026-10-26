'use client';
import { useState } from 'react';
import { arr, bi, num, objects, str } from '@/lib/config';
import { u, ui } from '@/lib/ui';
import { SecHead, type SectionProps } from './shared';

const TONES = ['var(--signal)', 'var(--c-grey)', 'var(--steel)'];
export function Shipping({ s, ctx }: SectionProps) {
  const { lang } = ctx; const f = s.fields;
  const modes = objects(s.items), inco = objects(f.incoterms), ports = objects(f.ports);
  const scale = arr(lang === 'en' ? f.incotermScaleEn : f.incotermScaleAr).map((x) => str(x));
  const [ii, setIi] = useState(Math.max(0, inco.length - 1));
  return (
    <section id="shipping" className="bg-grey"><div className="wrap">
      <SecHead s={s} lang={lang} />
      <div className="ship rv">
        {modes.map((m, i) => (
          <div className="mode" style={{ color: TONES[i % TONES.length] }} key={i}>
            <span className="rank">{bi(m, 'rank', lang)}</span><h3>{bi(m, 'title', lang)}</h3>
            <div className="days"><span dir="ltr">{str(m.days)}</span> <small>{u(ui.days, lang)}</small></div>
            <p className="muted">{bi(m, 'text', lang)}</p>
            <div className="meter"><i style={{ width: `${num(m.costMeter)}%` }} /></div>
            <div className="mlab"><span>{lang === 'en' ? 'Cost' : 'التكلفة'}</span><span>{bi(m, 'cost', lang)}</span></div>
          </div>
        ))}
      </div>
      {(inco.length || ports.length) ? (
        <div className="ship-meta rv">
          {inco.length ? (
            <div className="panel">
              <h3>{bi(f, 'incotermsTitle', lang)}</h3>
              <div className="inco" role="tablist" aria-label="Incoterms">{inco.map((x, i) => <button key={i} type="button" role="tab" aria-selected={i === ii} onClick={() => setIi(i)}>{str(x.code)}</button>)}</div>
              <p className="inco-body" role="tabpanel">{bi(inco[ii], 'text', lang)}</p>
              <div className="inco-scale" aria-hidden="true">{[0, 1, 2, 3].map((k) => <div key={k} className={k < num(inco[ii]?.reach) ? 'on' : undefined} />)}</div>
              <div className="inco-cap" aria-hidden="true">{scale.map((x, i) => <span key={i}>{x}</span>)}</div>
            </div>
          ) : null}
          {ports.length ? (
            <div className="panel">
              <h3>{bi(f, 'portsTitle', lang)}</h3>
              <ul className="ports">{ports.map((p) => <li key={str(p.code)}><span>{bi(p, 'name', lang)}</span><span className="mono">{str(p.code)}</span></li>)}</ul>
              {bi(f, 'documents', lang) ? <p className="muted" style={{ marginTop: 14, fontSize: '.88rem' }}>{bi(f, 'documents', lang)}</p> : null}
            </div>
          ) : null}
        </div>
      ) : null}
    </div></section>
  );
}
