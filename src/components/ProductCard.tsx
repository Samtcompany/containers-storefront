'use client';
import { useState } from 'react';
import { fmt } from '@/lib/config';
import { availability, type Product } from '@/lib/catalog';
import { href, u, ui } from '@/lib/ui';
import { CatIcon } from './CatIcon';
import { useCart } from './cart/CartProvider';
import { RFQ_PREFILL_KEY } from './sections/Calculator';

/** The prototype's product card: availability badge, quantity, add to cart, favourite, and the bulk-quote shortcut into the RFQ form. */
export function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const c = useCart(); const { lang } = c;
  const av = availability(p);
  const [qty, setQty] = useState(1);
  const [fav, setFav] = useState(false);
  const [added, setAdded] = useState<'ok' | 'max' | null>(null);
  const max = av.kind === 'soon' ? 0 : av.max;
  const add = () => {
    const r = c.add(p.id, qty); setAdded(r); setTimeout(() => setAdded(null), 1400);
  };
  const bulk = () => {
    try { sessionStorage.setItem(RFQ_PREFILL_KEY, JSON.stringify({ category: p.category?.id ?? null, product: `${p.name}${u(ui.store.bulkQty, lang)}` })); } catch { /* storage unavailable */ }
    window.dispatchEvent(new CustomEvent('pc-rfq-prefill'));
    const el = document.getElementById('rfq');
    if (el) el.scrollIntoView({ behavior: 'smooth' }); else window.location.href = href(lang, '#rfq');
  };
  return (
    <article className="prod" style={{ animationDelay: `${index * 40}ms` }}>
      <div className="img">
        {p.image ? <img src={p.image} alt="" loading="lazy" style={{ position: 'relative', width: '100%', height: '100%', objectFit: 'cover' }} /> : <CatIcon id={p.category?.id} />}
        <span className="sku">{p.sku}</span>
        {av.kind === 'soon' ? <span className="stock soon">{u(ui.store.soon, lang)}</span> : av.kind === 'low' ? <span className="stock low">{u(ui.store.onlyLeft, lang).replace('{n}', String(av.max))}</span> : <span className="stock ok">{u(ui.store.inStock, lang)}</span>}
        <button type="button" className="fav" aria-pressed={fav} aria-label={u(ui.store.fav, lang)} onClick={() => setFav(!fav)}><svg viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8" fill="none"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z" /></svg></button>
      </div>
      <div className="body">
        <span className="meta">{p.subName}{p.cert ? <> · <span className="mono">{p.cert}</span></> : null}</span>
        <h3>{p.name}</h3>
        <div className="price"><b>{fmt(p.price)}</b><small>{u(ui.store.sarIncl, lang)}</small></div>
        {av.kind === 'soon' ? <button type="button" className="btn btn-ghost notify" onClick={() => setAdded('ok')}>{added ? u(ui.store.notified, lang) : u(ui.store.notify, lang)}</button> : (
          <>
            <div className="buy">
              <div className="qty"><button type="button" aria-label="−" disabled={qty <= 1} onClick={() => setQty(qty - 1)}>−</button><span>{qty}</span><button type="button" aria-label="+" disabled={qty >= max} onClick={() => setQty(qty + 1)}>+</button></div>
              <button type="button" className={`btn btn-primary add${added === 'ok' ? ' added' : ''}`} onClick={add}>{added === 'ok' ? u(ui.store.added, lang) : u(ui.store.add, lang)}</button>
            </div>
            <span className="hint">{added === 'max' ? u(ui.store.maxReached, lang).replace('{n}', String(max)) : qty >= max ? `${u(ui.store.available, lang)} ${max}` : ''}</span>
          </>
        )}
        <button type="button" className="bulk" onClick={bulk}>{u(ui.store.bulk, lang)}</button>
      </div>
    </article>
  );
}
