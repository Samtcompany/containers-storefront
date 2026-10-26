import { arr, bi, objects, str } from '@/lib/config';
import { anchor, type SectionProps } from './shared';

const COLS = ['var(--steel)', 'var(--c-grey)', 'var(--c-green)', 'var(--signal)', 'var(--steel)', 'var(--c-grey)'];
const ROWS = [[0, 1, 2, 3, 4, 5], [2, 4, -1, 0, 1, 3]];

export function Hero({ s, ctx }: SectionProps) {
  const { lang } = ctx; const f = s.fields;
  const title = bi(f, 'title', lang);
  const ticker = arr(f.ticker).map((t) => str(t)).filter(Boolean);
  const facts = objects(s.items);
  return (
    <>
      <div className="hero">
        <div className="wrap hero-grid">
          <div className="hero-text">
            <p className="eyebrow hero-load">{bi(f, 'eyebrow', lang)}</p>
            <h1 className="hero-load" style={{ marginTop: 14 }}>{title}</h1>
            <p className="lead hero-load">{bi(f, 'lead', lang)}</p>
            <div className="hero-cta hero-load">
              {bi(f, 'primaryCta', lang) ? <a className="btn btn-primary" href={anchor(str(f.primaryCtaHref, '#shop'))}><span>{bi(f, 'primaryCta', lang)}</span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 3 5 8l5 5" /></svg></a> : null}
              {bi(f, 'secondaryCta', lang) ? <a className="btn btn-ghost" href={anchor(str(f.secondaryCtaHref, '#rfq'))}>{bi(f, 'secondaryCta', lang)}</a> : null}
            </div>
          </div>
          <svg className="scene" viewBox="0 0 600 380" role="img" aria-label="Port scene: a crane loading containers onto a ship">
            <defs>
              <pattern id="rib" width="6" height="10" patternUnits="userSpaceOnUse"><rect width="2" height="10" fill="#000" opacity=".12" /></pattern>
              <clipPath id="seaclip"><rect x="214" y="300" width="386" height="80" /></clipPath>
            </defs>
            <g fontFamily="JetBrains Mono, ui-monospace, monospace" fontSize="11" fill="var(--muted)" direction="ltr">
              <text x="440" y="34">SHA → JED</text><text x="440" y="50" opacity=".7">21°29′N 39°10′E</text>
            </g>
            <rect x="0" y="300" width="214" height="80" fill="var(--grey-2)" /><rect x="0" y="300" width="214" height="4" fill="var(--c-grey)" /><rect x="214" y="300" width="386" height="80" fill="var(--sea)" />
            <g clipPath="url(#seaclip)">
              <path className="wave" d="M214 316 q15 -6 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="var(--steel)" strokeOpacity=".35" strokeWidth="2" />
              <path className="wave w2" d="M154 340 q15 -5 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="var(--steel)" strokeOpacity=".22" strokeWidth="2" />
            </g>
            <g className="ship">
              <path d="M208 236H592L574 302H228Z" fill="var(--hull)" /><rect x="208" y="262" width="384" height="5" fill="var(--signal)" opacity=".9" />
              <rect x="532" y="150" width="44" height="86" rx="2" fill="var(--white)" stroke="var(--ink)" strokeWidth="2" />
              <g fill="var(--steel)"><rect x="538" y="160" width="32" height="7" rx="1" /><rect x="538" y="174" width="32" height="7" rx="1" opacity=".6" /></g>
              <rect x="548" y="132" width="10" height="18" fill="var(--ink)" /><circle className="blink" cx="553" cy="128" r="3" fill="var(--signal)" />
              <g>{ROWS.flatMap((r, ri) => r.map((ci, k) => (ci < 0 ? null : <g key={`${ri}-${k}`}><rect x={219 + k * 51} y={212 - ri * 24} width="49" height="23" fill={COLS[ci]} /><rect x={219 + k * 51} y={212 - ri * 24} width="49" height="23" fill="url(#rib)" /></g>)))}</g>
              <text x="236" y="290" fontFamily="JetBrains Mono, ui-monospace, monospace" fontSize="11" fill="var(--white)" opacity=".75" direction="ltr">PRIME TRADER · JEDDAH</text>
            </g>
            <g fill="var(--steel)"><rect x="52" y="112" width="9" height="190" /><rect x="104" y="112" width="9" height="190" /><rect x="44" y="108" width="78" height="10" rx="1" /><rect x="76" y="28" width="12" height="82" /><rect x="30" y="70" width="430" height="9" rx="1" /></g>
            <g stroke="var(--steel)" strokeWidth="2" opacity=".7"><line x1="82" y1="30" x2="32" y2="72" /><line x1="82" y1="30" x2="300" y2="72" /><line x1="82" y1="30" x2="456" y2="72" /></g>
            <rect x="64" y="84" width="20" height="16" rx="2" fill="var(--white)" stroke="var(--steel)" strokeWidth="2" />
            <g className="trolley">
              <rect x="136" y="79" width="28" height="9" rx="1" fill="var(--ink)" /><line className="cable" x1="150" y1="88" x2="150" y2="150" stroke="var(--ink)" strokeWidth="1.6" />
              <g className="load"><rect x="124" y="148" width="52" height="4" fill="var(--ink)" /><rect x="125" y="152" width="50" height="24" fill="var(--signal)" /><rect x="125" y="152" width="50" height="24" fill="url(#rib)" />
                <g transform="translate(140 155) scale(.28)"><path fill="var(--white)" fillRule="evenodd" d="M11 8H53a3 3 0 0 1 3 3V39a3 3 0 0 1-3 3H33V53a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3ZM24 19H40a6 6 0 0 1 0 12H24a6 6 0 0 1 0-12Z" /></g></g>
            </g>
            <g><rect x="120" y="276" width="62" height="20" fill="var(--c-green)" /><rect x="120" y="276" width="62" height="20" fill="url(#rib)" /><rect x="114" y="296" width="76" height="4" fill="var(--ink)" /><rect x="184" y="280" width="18" height="16" rx="2" fill="var(--ink)" />
              <circle cx="128" cy="300" r="4" fill="var(--ink)" /><circle cx="176" cy="300" r="4" fill="var(--ink)" /><circle cx="196" cy="300" r="4" fill="var(--ink)" /></g>
          </svg>
        </div>
      </div>
      {ticker.length ? <div className="ticker" aria-hidden="true"><div className="ticker-in">{[...ticker, ...ticker].map((t, i) => <span key={i}>{t}</span>)}</div></div> : null}
      {facts.length ? (
        <div className="facts bg-white"><div className="wrap">
          {facts.map((x, i) => <div className="fact" key={i}><strong>{bi(x, 'value', lang)}</strong><span>{bi(x, 'label', lang)}</span></div>)}
        </div></div>
      ) : null}
    </>
  );
}
