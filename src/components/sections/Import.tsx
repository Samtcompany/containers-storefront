import { bi, num, objects } from '@/lib/config';
import { SecHead, type SectionProps } from './shared';

const ICONS = [
  <><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" /></>,
  <><path d="M3 21V9l6-4v4l6-4v4l6-4v16z" /><path d="M8 17h2M14 17h2" /></>,
  <><path d="M9 3h6M10 3v6l-5 9a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-9V3" /></>,
  <><path d="M12 3 4 6v6c0 4.5 3.4 7.8 8 9 4.6-1.2 8-4.5 8-9V6z" /><path d="m9 12 2 2 4-4" /></>,
  <><rect x="3" y="7" width="18" height="12" rx="1" /><path d="M8 7V4h8v3M3 12h18" /></>,
  <><path d="M4 20h16M6 20V10l6-6 6 6v10" /><path d="M10 20v-5h4v5" /></>,
  <><path d="M20 12 12 20 4 12V4h8z" /><circle cx="8.5" cy="8.5" r="1.5" /></>,
  <><rect x="3" y="12" width="7" height="7" /><rect x="14" y="12" width="7" height="7" /><rect x="8.5" y="4" width="7" height="7" /></>,
];

export function Import({ s, ctx }: SectionProps) {
  const { lang } = ctx; const f = s.fields;
  const cards = objects(s.items), terms = objects(f.terms), methods = objects(f.payMethods);
  const deposit = num(f.depositPercent, 30), balance = num(f.balancePercent, 70);
  return (
    <section id="import" className="bg-white">
      <div className="wrap">
        <SecHead s={s} lang={lang} />
        <div className="imp-grid rv">
          {cards.map((c, i) => (
            <div className="type" key={i}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">{ICONS[i % ICONS.length]}</svg>
              <b>{bi(c, 'title', lang)}</b><span>{bi(c, 'text', lang)}</span>
            </div>
          ))}
        </div>
        {bi(f, 'payTitle', lang) ? (
          <div className="imp-pay rv">
            <div>
              <p className="eyebrow">{bi(f, 'payEyebrow', lang)}</p>
              <h3 style={{ marginTop: 10 }}>{bi(f, 'payTitle', lang)}</h3>
              <div className="split"><div className="a" style={{ flex: deposit }}>{deposit}%</div><div className="b" style={{ flex: balance }}>{balance}%</div></div>
              <div className="split-cap"><span>{bi(f, 'depositLabel', lang)}</span><span>{bi(f, 'balanceLabel', lang)}</span></div>
              {methods.length ? <div className="pay">{methods.map((m, i) => <span key={i}>{lang === 'en' ? String(m.en ?? m.ar ?? '') : String(m.ar ?? m.en ?? '')}</span>)}</div> : null}
              {bi(f, 'govNote', lang) ? <p className="muted" style={{ fontSize: '.85rem', marginTop: 12 }}>{bi(f, 'govNote', lang)}</p> : null}
            </div>
            {terms.length ? <ul className="terms">{terms.map((t, i) => <li key={i}><b>{bi(t, 'title', lang)}</b><span className="muted">{bi(t, 'text', lang)}</span></li>)}</ul> : null}
          </div>
        ) : null}
        {bi(f, 'cta', lang) ? <div className="hero-cta"><a className="btn btn-accent" href="#rfq">{bi(f, 'cta', lang)}</a></div> : null}
      </div>
    </section>
  );
}
