'use client';
import { useEffect, useMemo, useState } from 'react';
import type { JsonObject, Lang, StorefrontConfig } from '@/lib/types';
import { byNewest, categories, type Product } from '@/lib/catalog';
import { bi } from '@/lib/config';
import { href, u, ui } from '@/lib/ui';
import { CatIcon } from './CatIcon';
import { ProductCard } from './ProductCard';
import { StoreStrip } from './StoreStrip';
import { useCart } from './cart/CartProvider';

const PRICE: Array<[string, readonly [string, string]]> = [['all', ui.store.priceAll], ['0-100', ui.store.priceUnder], ['100-1000', ui.store.price100], ['1000-5000', ui.store.price1000], ['5000-1e12', ui.store.priceOver]];
const SORT: Array<[string, readonly [string, string]]> = [['new', ui.store.sortNew], ['low', ui.store.sortLow], ['high', ui.store.sortHigh]];

/** The prototype's store page: search, category, price, sort, in-stock; tiles; subcategory chips; the grid; the strip. */
export function StoreView({ lang, config, shopFields }: { lang: Lang; config: StorefrontConfig; shopFields: JsonObject }) {
  const c = useCart();
  const cats = useMemo(() => categories(config, lang), [config, lang]);
  const [q, setQ] = useState(''); const [main, setMain] = useState(''); const [sub, setSub] = useState('');
  const [price, setPrice] = useState('all'); const [sort, setSort] = useState('new'); const [stock, setStock] = useState(false);
  useEffect(() => { const cat = new URLSearchParams(window.location.search).get('cat'); if (cat && cats.some((x) => x.id === cat)) setMain(cat); }, [cats]);
  const cat = cats.find((x) => x.id === main) ?? null;
  const list = useMemo(() => {
    const [lo, hi] = price === 'all' ? [0, Infinity] : price.split('-').map(Number);
    const qq = q.trim().toLowerCase();
    const out = c.products.filter((p: Product) => {
      if (main && p.category?.id !== main) return false;
      if (sub && p.sub !== sub) return false;
      if (stock && p.stock === 0) return false;
      if (p.price < lo || p.price >= hi) return false;
      if (qq && !`${p.name} ${p.raw.nameAr ?? ''} ${p.raw.nameEn ?? ''} ${p.category?.name ?? ''} ${p.subName}`.toLowerCase().includes(qq)) return false;
      return true;
    });
    return out.sort(sort === 'low' ? (a, b) => a.price - b.price : sort === 'high' ? (a, b) => b.price - a.price : byNewest);
  }, [c.products, q, main, sub, price, sort, stock]);
  const active = q !== '' || main !== '' || price !== 'all' || stock;
  const clear = () => { setQ(''); setMain(''); setSub(''); setPrice('all'); setStock(false); };
  return (
    <main>
      <div className="store-top"><div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <a href={href(lang)}>{u(ui.blog.home, lang)}</a><span className="sep">›</span>
          {cat ? <button type="button" onClick={() => { setMain(''); setSub(''); }}>{u(ui.nav.shop, lang)}</button> : <span>{u(ui.nav.shop, lang)}</span>}
          {cat ? <><span className="sep">›</span>{sub ? <><button type="button" onClick={() => setSub('')}>{cat.name}</button><span className="sep">›</span><span>{cat.subs.find((x) => x.id === sub)?.name}</span></> : <span>{cat.name}</span>}</> : null}
        </nav>
        <h1 style={{ fontSize: 'clamp(1.6rem,3.4vw,2.4rem)', fontWeight: 800 }}>{sub ? cat?.subs.find((x) => x.id === sub)?.name : cat ? cat.name : u(ui.nav.shop, lang)}</h1>
        <p className="lead" style={{ marginTop: 6 }}>{u(ui.store.lead, lang)}</p>
      </div></div>
      <div className="filters"><div className="wrap">
        <label className="search"><span hidden>{u(ui.store.search, lang)}</span>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><circle cx="11" cy="11" r="6" /><path d="m20 20-4.5-4.5" /></svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={u(ui.store.searchPh, lang)} autoComplete="off" />
        </label>
        <select aria-label={u(ui.rfq.category, lang)} value={main} onChange={(e) => { setMain(e.target.value); setSub(''); }}><option value="">{u(ui.store.allCats, lang)}</option>{cats.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select>
        <select aria-label="Price" value={price} onChange={(e) => setPrice(e.target.value)}>{PRICE.map(([v, l]) => <option key={v} value={v}>{u(l, lang)}</option>)}</select>
        <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)}>{SORT.map(([v, l]) => <option key={v} value={v}>{u(l, lang)}</option>)}</select>
        <label className="toggle"><input type="checkbox" checked={stock} onChange={(e) => setStock(e.target.checked)} /><span>{u(ui.store.inStockOnly, lang)}</span></label>
        {active ? <button type="button" className="clear" onClick={clear}>{u(ui.store.clear, lang)}</button> : null}
      </div></div>
      <section className="bg-white" style={{ paddingTop: 24 }}><div className="wrap">
        <div className="tiles">
          {cats.map((x) => (
            <button type="button" className="tile" aria-pressed={main === x.id} key={x.id} onClick={() => { setMain(main === x.id ? '' : x.id); setSub(''); }}>
              <span className="ti"><CatIcon id={x.id} /></span><b>{x.name}</b>
              <span>{u(ui.store.tileMeta, lang).replace('{s}', String(x.subs.length)).replace('{n}', String(c.products.filter((p) => p.category?.id === x.id).length))}</span>
            </button>
          ))}
        </div>
        {cat ? (
          <div className="subrow">
            <span className="muted" style={{ fontSize: '.85rem' }}>{u(ui.store.subs, lang)}</span>
            <button type="button" className="chip-btn" aria-pressed={sub === ''} onClick={() => setSub('')}>{u(ui.clients.all, lang)}</button>
            {cat.subs.map((x) => <button type="button" className="chip-btn" aria-pressed={sub === x.id} key={x.id} onClick={() => setSub(x.id)}>{x.name}</button>)}
          </div>
        ) : null}
        <div className="count-row"><span>{u(ui.store.count, lang).replace('{n}', String(list.length))}</span></div>
        <div className="grid-p pgrid">
          {list.length ? list.map((p, i) => <ProductCard p={p} index={i} key={p.id} />) : (
            <div className="empty-state" style={{ gridColumn: '1/-1' }}><b>{u(ui.store.emptyTitle, lang)}</b><span>{u(ui.store.emptyText, lang)}</span><a className="btn btn-accent" href={href(lang, '#rfq')}>{u(ui.store.emptyCta, lang)}</a></div>
          )}
        </div>
        <StoreStrip fields={shopFields} lang={lang} />
        <p className="demo-note">{bi(shopFields, 'note', lang)}</p>
      </div></section>
    </main>
  );
}
