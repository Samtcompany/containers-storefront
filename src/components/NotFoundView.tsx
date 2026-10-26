'use client';
import { usePathname } from 'next/navigation';
import type { Lang } from '@/lib/types';
import { href, u, ui } from '@/lib/ui';

export function NotFoundView() {
  const path = usePathname() ?? '/';
  const lang: Lang = path.startsWith('/en') ? 'en' : 'ar';
  return (
    <main>
      <div className="lost"><div className="wrap">
        <svg viewBox="0 0 420 240" role="img" aria-label="Lost container">
          <defs><clipPath id="lostsea"><rect x="0" y="150" width="420" height="90" /></clipPath><pattern id="lostrib" width="7" height="10" patternUnits="userSpaceOnUse"><rect width="2.5" height="10" fill="#000" opacity=".14" /></pattern></defs>
          <rect x="0" y="150" width="420" height="90" fill="var(--sea)" />
          <g clipPath="url(#lostsea)"><path className="wave" d="M-60 170 q15 -7 30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0 t30 0" fill="none" stroke="var(--steel)" strokeOpacity=".35" strokeWidth="2" /></g>
          <g className="box"><rect x="110" y="70" width="200" height="90" rx="3" fill="var(--signal)" /><rect x="110" y="70" width="200" height="90" rx="3" fill="url(#lostrib)" />
            <text x="132" y="98" fontFamily="JetBrains Mono,monospace" fontWeight="700" fontSize="13" fill="#fff" direction="ltr">PRCU 404404 0</text></g>
          <circle cx="372" cy="40" r="3" fill="var(--signal)"><animate attributeName="opacity" values="1;.2;1" dur="2s" repeatCount="indefinite" /></circle>
          <text x="340" y="30" fontFamily="JetBrains Mono,monospace" fontSize="9" fill="var(--muted)" direction="ltr">NO SIGNAL</text>
        </svg>
        <span className="code">{u(ui.notFound.code, lang)}</span>
        <h1>{u(ui.notFound.title, lang)}</h1>
        <p className="lead" style={{ textAlign: 'center' }}>{u(ui.notFound.lead, lang)}</p>
        <div className="acts">
          <a className="btn btn-accent" href={href(lang, '#tracking')}>{u(ui.notFound.track, lang)}</a>
          <a className="btn btn-primary" href={href(lang, '#rfq')}>{u(ui.notFound.rfq, lang)}</a>
          <a className="btn btn-ghost" href={href(lang)}>{u(ui.notFound.home, lang)}</a>
        </div>
      </div></div>
    </main>
  );
}
