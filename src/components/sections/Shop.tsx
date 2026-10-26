import { bi } from '@/lib/config';
import { byNewest, categories, products } from '@/lib/catalog';
import { href, u, ui } from '@/lib/ui';
import { CatIcon } from '../CatIcon';
import { ProductCard } from '../ProductCard';
import { StoreStrip } from '../StoreStrip';
import { SecHead, type SectionProps } from './shared';

/** The store face of the home page, as the prototype draws it: six category tiles, the featured products, the strip, the honest note. */
export function Shop({ s, ctx }: SectionProps) {
  const { lang } = ctx; const f = s.fields;
  const cats = categories(ctx.config, lang);
  const all = products(ctx.config, ctx.products, lang);
  const featured = (all.some((p) => p.featured) ? all.filter((p) => p.featured) : all).sort(byNewest).slice(0, 8);
  const store = href(lang, '/store');
  return (
    <section id="shop" className="bg-grey">
      <div className="wrap">
        <div className="sec-row rv">
          <SecHead s={s} lang={lang} className="sec-head" />
          <a className="btn btn-ghost" href={store}><span>{bi(f, 'enter', lang) || u(ui.shop.enter, lang)}</span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 3 5 8l5 5" /></svg></a>
        </div>
        <div className="tiles rv">
          {cats.map((c) => {
            const n = all.filter((p) => p.category?.id === c.id).length;
            return (
              <a className="tile" href={`${store}?cat=${encodeURIComponent(c.id)}`} key={c.id} style={{ textDecoration: 'none' }}>
                <span className="ti"><CatIcon id={c.id} /></span>
                <b>{c.name}</b>
                <span>{u(ui.store.tileMeta, lang).replace('{s}', String(c.subs.length)).replace('{n}', String(n))}</span>
              </a>
            );
          })}
        </div>
        {featured.length ? (
          <>
            <div className="sec-row" style={{ marginTop: 56 }}>
              <div className="sec-head"><h2 style={{ fontSize: 'clamp(1.3rem,2.4vw,1.75rem)' }}>{bi(f, 'readyTitle', lang) || u(ui.shop.featured, lang)}</h2></div>
              <a className="btn btn-primary" href={store}><span>{bi(f, 'more', lang) || u(ui.store.more, lang)}</span><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10 3 5 8l5 5" /></svg></a>
            </div>
            <div className="grid-p pgrid">{featured.map((p, i) => <ProductCard p={p} index={i} key={p.id} />)}</div>
          </>
        ) : null}
        <StoreStrip fields={f} lang={lang} />
        <p className="demo-note">{featured.length ? bi(f, 'note', lang) : u(ui.shop.soon, lang)}</p>
      </div>
    </section>
  );
}
