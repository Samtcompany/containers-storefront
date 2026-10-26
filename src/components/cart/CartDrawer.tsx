'use client';
import { fmt, num, isObject } from '@/lib/config';
import { href, u, ui } from '@/lib/ui';
import { CatIcon } from '../CatIcon';
import { useCart } from './CartProvider';

/** The prototype's side drawer: lines with quantity, subtotal with the VAT it includes, and the way to checkout. */
export function CartDrawer() {
  const c = useCart();
  const { lang } = c;
  if (!c.open) return null;
  const shop = c.config.sections.find((s) => s.id === 'shop');
  const co = shop && isObject(shop.fields.checkout) ? shop.fields.checkout : {};
  const minOrder = num(co.minOrder, 50), vatRate = num(co.vatRate, 0.15);
  const vat = c.subtotal - c.subtotal / (1 + vatRate);
  const money = (n: number) => <><span className="num" dir="ltr">{fmt(n)}</span> {u(ui.sar, lang)}</>;
  return (
    <>
      <div className="overlay" onClick={() => c.setOpen(false)} />
      <aside className="drawer" role="dialog" aria-labelledby="cart-title">
        <div className="dh"><h3 id="cart-title">{u(ui.cart.title, lang)}</h3><button type="button" className="x" aria-label={u(ui.assistant.close, lang)} onClick={() => c.setOpen(false)}>×</button></div>
        <div className="lines">
          {c.lines.length === 0 ? <p className="empty">{u(ui.cart.empty, lang)}</p> : c.lines.map((l) => {
            const p = c.product(l.id); if (!p) return null;
            return (
              <div className="line" key={l.id}>
                <span className="th"><CatIcon id={p.category?.id} /></span>
                <div><b>{p.name}</b><small>{money(p.price)}</small></div>
                <div className="side">
                  <div className="qty"><button type="button" aria-label="−" onClick={() => c.setQty(l.id, l.qty - 1)}>−</button><span>{l.qty}</span><button type="button" aria-label="+" onClick={() => c.add(l.id, 1)}>+</button></div>
                  <button type="button" className="rm" onClick={() => c.remove(l.id)}>{u(ui.cart.remove, lang)}</button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="totals">
          {c.lines.length ? (
            <>
              <div><span>{u(ui.cart.subtotal, lang)}</span><span>{money(c.subtotal)}</span></div>
              <div className="muted"><span>{u(ui.cart.inclVat, lang)}</span><span>{money(vat)}</span></div>
              <div className="muted"><span>{u(ui.cart.shipping, lang)}</span><span>{u(ui.cart.shippingLater, lang)}</span></div>
              {c.subtotal < minOrder ? <span className="note">{u(ui.cart.minOrder, lang)} {fmt(minOrder, 0)} {u(ui.sar, lang)}</span> : null}
              <button type="button" className="btn btn-accent" disabled={c.subtotal < minOrder} onClick={() => { c.setOpen(false); c.setCheckout(true); }}>{u(ui.cart.checkout, lang)}</button>
            </>
          ) : <a className="btn btn-primary" href={href(lang, '/store')} onClick={() => c.setOpen(false)}>{u(ui.cart.shopNow, lang)}</a>}
        </div>
      </aside>
    </>
  );
}
