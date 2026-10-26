import { bi, objects, str, fmt } from '@/lib/config';
import { u, ui } from '@/lib/ui';
import { SecHead, type SectionProps } from './shared';

/** The store face of the home page: the categories the company sells into, and the products Aamer marks visible. Cart and checkout are SF-3. */
export function Shop({ s, ctx }: SectionProps) {
  const { lang } = ctx;
  const cats = objects(s.items);
  const products = objects(ctx.products);
  return (
    <section id="shop" className="bg-grey">
      <div className="wrap">
        <div className="sec-row rv"><SecHead s={s} lang={lang} className="sec-head" /></div>
        <div className="tiles rv">
          {cats.map((c) => (
            <a className="tile" href="#rfq" key={str(c.id)}>
              <span className="code mono">{str(c.code)}</span>
              <b>{bi(c, 'name', lang)}</b>
              <span>{bi(c, 'text', lang)}</span>
              {objects(c.subcategories).length ? <small>{objects(c.subcategories).map((x) => bi(x, 'name', lang)).join(' · ')}</small> : null}
            </a>
          ))}
        </div>
        {products.length ? (
          <>
            <div className="sec-row" style={{ marginTop: 56 }}><div className="sec-head"><h2 style={{ fontSize: 'clamp(1.3rem,2.4vw,1.75rem)' }}>{bi(s.fields, 'readyTitle', lang) || u(ui.shop.featured, lang)}</h2></div></div>
            <div className="grid-p pgrid">
              {products.map((p) => (
                <article className="prod" key={str(p.itemId)}>
                  <div className="img">{objects(p.images).length === 0 && Array.isArray(p.images) && typeof p.images[0] === 'string' ? <img src={String(p.images[0])} alt="" loading="lazy" /> : null}{str(p.badge) ? <span className="badge">{str(p.badge)}</span> : null}</div>
                  <div className="pb">
                    <b>{bi(p, 'name', lang)}</b>
                    {str(p.subcategory) ? <span className="muted">{str(p.subcategory)}</span> : null}
                    {p.salePrice !== null && p.salePrice !== undefined ? <span className="price"><span className="num" dir="ltr">{fmt(Number(p.salePrice))}</span> {str(p.currency, 'SAR')} <small className="muted">{u(ui.shop.inclVat, lang)}</small></span> : null}
                  </div>
                </article>
              ))}
            </div>
          </>
        ) : null}
        <p className="demo-note">{u(ui.shop.soon, lang)}</p>
      </div>
    </section>
  );
}
