import { bi, objects } from '@/lib/config';
import type { SectionProps } from './shared';

export function Compliance({ s, ctx }: SectionProps) {
  const { lang } = ctx; const f = s.fields;
  return (
    <section id="compliance" className="bg-white">
      <div className="wrap docs-wrap rv">
        <div>
          <p className="eyebrow">{bi(f, 'eyebrow', lang)}</p>
          <h2 style={{ marginTop: 14 }}>{bi(f, 'title', lang)}</h2>
          <p className="lead" style={{ marginTop: 14 }}>{bi(f, 'lead', lang)}</p>
          {bi(f, 'cta', lang) ? <div className="hero-cta"><a className="btn btn-ghost" href="#rfq">{bi(f, 'cta', lang)}</a></div> : null}
        </div>
        <div>
          <ul className="lic">
            {objects(s.items).map((d, i) => (
              <li key={i}><span className="ok"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="m3.5 8.5 3 3 6-7" /></svg></span><span><b>{bi(d, 'document', lang)}</b><small>{bi(d, 'issuer', lang)}</small></span></li>
            ))}
          </ul>
          {bi(f, 'note', lang) ? <p className="lic-note">{bi(f, 'note', lang)}</p> : null}
        </div>
      </div>
    </section>
  );
}
