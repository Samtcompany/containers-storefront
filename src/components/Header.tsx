'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import type { Lang, StorefrontConfig } from '@/lib/types';
import { u, ui } from '@/lib/ui';
import { Brand } from './Logo';

const NAV: Array<{ id: string; key: keyof typeof ui.nav }> = [
  { id: 'shop', key: 'shop' }, { id: 'import', key: 'import' }, { id: 'calc', key: 'calc' }, { id: 'journey', key: 'journey' },
  { id: 'tracking', key: 'tracking' }, { id: 'blog', key: 'blog' }, { id: 'gov', key: 'gov' },
];
const MOBILE_EXTRA: Array<{ id: string; key: keyof typeof ui.nav }> = [{ id: 'faq', key: 'faq' }, { id: 'containers', key: 'containers' }, { id: 'clients', key: 'clients' }];

export function Header({ lang, config, enabled }: { lang: Lang; config: StorefrontConfig; enabled: string[] }) {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState<string | null>(null);
  const [menu, setMenu] = useState(false);
  const [dark, setDark] = useState(false);
  const items = NAV.filter((n) => enabled.includes(n.id));
  const extra = MOBILE_EXTRA.filter((n) => enabled.includes(n.id));
  const home = `/${lang}`;
  const pathname = usePathname() ?? home;
  const other: Lang = lang === 'en' ? 'ar' : 'en';
  // The same page in the other language. A static snapshot rewrites this to a relative address at build time.
  const switchTo = `/${other}${pathname.replace(/^\/(ar|en)/, '')}`;

  useEffect(() => {
    setDark(document.documentElement.getAttribute('data-mode') === 'dark');
    const onScroll = () => {
      const y = window.scrollY, h = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > 8); setProgress(h > 0 ? (y / h) * 100 : 0);
      let cur: string | null = null;
      for (const n of items) { const el = document.getElementById(n.id); if (el && el.getBoundingClientRect().top < 140) cur = n.id; }
      setActive(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [items]);

  const toggleMode = () => {
    const next = !dark; setDark(next);
    if (next) document.documentElement.setAttribute('data-mode', 'dark'); else document.documentElement.removeAttribute('data-mode');
    try { localStorage.setItem('pc-mode', next ? 'dark' : 'light'); } catch { /* storage unavailable */ }
  };

  return (
    <header className={`site${scrolled ? ' scrolled' : ''}`} id="hdr">
      <div className="wrap bar">
        <Brand lang={lang} site={config.site} brand={config.brand} href={home} />
        <nav className="main" aria-label="Sections">
          {items.map((n) => <a key={n.id} href={`${home}#${n.id}`} className={active === n.id ? 'on' : undefined}>{u(ui.nav[n.key], lang)}</a>)}
        </nav>
        <button className="icon-btn mode-btn" type="button" aria-pressed={dark} aria-label={u(dark ? ui.lightMode : ui.darkMode, lang)} onClick={toggleMode}>
          <svg className="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>
          <svg className="moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M20 14.5A8 8 0 1 1 9.5 4 6.5 6.5 0 0 0 20 14.5z" /></svg>
        </button>
        <a className="icon-btn lang-btn" href={switchTo} onClick={process.env.NEXT_PUBLIC_SNAPSHOT === '1' ? undefined : (e) => { e.preventDefault(); window.location.href = switchTo + window.location.hash; }} aria-label={u(ui.langSwitch, lang)}>{u(ui.langLabel, lang)}</a>
        <button className="icon-btn menu-btn" type="button" aria-expanded={menu} aria-controls="mnav" aria-label={u(ui.menu, lang)} onClick={() => setMenu(!menu)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
        </button>
        {enabled.includes('rfq') ? <a className="btn btn-accent" href={`${home}#rfq`}>{u(ui.nav.rfq, lang)}</a> : null}
      </div>
      <div className="wrap mnav" id="mnav" hidden={!menu} onClick={() => setMenu(false)}>
        {[...items, ...extra].map((n) => <a key={n.id} href={`${home}#${n.id}`}>{u(ui.nav[n.key], lang)}</a>)}
      </div>
      <div className="progress" style={{ width: `${progress}%` }} />
    </header>
  );
}
