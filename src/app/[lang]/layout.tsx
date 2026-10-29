import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { ReactNode } from 'react';
import '../globals.css';
import { bi, str, enabledSections, section } from '@/lib/config';
import { getStorefront } from '@/lib/storefront.server';
import type { Lang } from '@/lib/types';
import { dirOf, u, ui } from '@/lib/ui';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Floats } from '@/components/Floats';
import { Reveal } from '@/components/Reveal';
import { CartProvider } from '@/components/cart/CartProvider';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { Checkout } from '@/components/cart/Checkout';

// Live: the no-store read of Aamer keeps every render on demand. Snapshot: the two languages are exported.
export function generateStaticParams() { return [{ lang: 'ar' }, { lang: 'en' }]; }

const FONTS = 'https://fonts.googleapis.com/css2?family=Alexandria:wght@400;500;600;700;800&family=Readex+Pro:wght@300;400;500;600&family=JetBrains+Mono:wght@500;700&display=swap';
const THEME_INIT = `try{var m=localStorage.getItem('pc-mode');if(m==='dark')document.documentElement.setAttribute('data-mode','dark')}catch(e){}`;

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params; const l: Lang = lang === 'en' ? 'en' : 'ar';
  if (lang !== 'ar' && lang !== 'en') return {};
  const sf = await getStorefront();
  const name = sf ? bi(sf.config.site, 'name', l) : 'Prime Containers';
  const tagline = sf ? bi(sf.config.site, 'tagline', l) : '';
  return { title: tagline ? `${name} — ${tagline}` : name, description: sf ? bi(section(sf.config, 'hero')?.fields, 'lead', l) : undefined };
}

export default async function LangLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  const l: Lang = lang;
  const sf = await getStorefront();
  const brand = sf?.config.brand ?? {};
  const vars: Record<string, string> = {};
  const map: Array<[string, string]> = [['primaryColor', '--ink'], ['steelColor', '--steel'], ['signalColor', '--signal'], ['greyColor', '--grey'], ['mutedColor', '--c-grey'], ['greenColor', '--c-green']];
  for (const [key, cssVar] of map) { const v = str(brand[key]); if (/^#[0-9a-fA-F]{6}$/.test(v)) vars[cssVar] = v; }
  if (vars['--ink']) { vars['--navy'] = vars['--ink']; vars['--hull'] = vars['--ink']; }
  // The brand's colours are the LIGHT palette; the night palette stays the prototype's, so the toggle changes the whole page.
  const brandCss = Object.keys(vars).length ? `:root:not([data-mode="dark"]){${Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';')}}` : '';

  return (
    <html lang={l} dir={dirOf(l)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href={FONTS} />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT }} />
        {brandCss ? <style dangerouslySetInnerHTML={{ __html: brandCss }} /> : null}
        {/* PROTOTYPE builds only: Aamer's prototype door (its mock state, then the door). The snapshot
            step rewrites these /ar/ paths relative to each page; the packager puts the files in proto/. */}
        {process.env.NEXT_PUBLIC_PROTOTYPE === '1' ? <><script src="/ar/proto/seed.js" /><script src="/ar/proto/door.js" /></> : null}
      </head>
      <body>
        {sf === null ? (
          <div className="offline"><div><h1>{u(ui.offline.title, l)}</h1><p className="lead">{u(ui.offline.lead, l)}</p></div></div>
        ) : (
          <CartProvider lang={l} config={sf.config} rawProducts={sf.products}>
            <Header lang={l} config={sf.config} enabled={enabledSections(sf.config).map((s) => s.id)} />
            {children}
            <Footer lang={l} config={sf.config} />
            <Floats lang={l} config={sf.config} products={sf.products} />
            <CartDrawer />
            <Checkout />
            <Reveal />
          </CartProvider>
        )}
      </body>
    </html>
  );
}
