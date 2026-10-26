import { bi, objects, str } from '@/lib/config';
import { SecHead, type SectionProps } from './shared';
import { CatIcon } from '../CatIcon';

export function Certs({ s, ctx }: SectionProps) {
  const { lang } = ctx; const f = s.fields;
  const shop = ctx.config.sections.find((x) => x.id === 'shop');
  const codeOf = (id: string) => { const c = shop ? objects(shop.items).find((x) => str(x.id) === id) : undefined; return c ? str(c.code) : ''; };
  const textOf = (id: string) => { const c = shop ? objects(shop.items).find((x) => str(x.id) === id) : undefined; return c ? bi(c, 'text', lang) : ''; };
  return (
    <section id="certs" className="bg-white"><div className="wrap">
      <SecHead s={s} lang={lang} />
      <div className="cats rv">
        {objects(s.items).map((c) => (
          <div className="cat" key={str(c.categoryId)}>
            <div className="top"><CatIcon id={str(c.categoryId)} /><span className="code">{codeOf(str(c.categoryId))}</span></div>
            <h3>{bi(c, 'name', lang)}</h3><p className="muted">{textOf(str(c.categoryId))}</p>
            <div className="certs">{objects(c.certificates).map((x, i) => <span className={`cert${str(x.level) === 'required' ? ' req' : str(x.level) === 'shipping' ? ' ship' : ''}`} key={i}>{lang === 'en' ? str(x.name) : str(x.nameAr) || str(x.name)}</span>)}</div>
          </div>
        ))}
      </div>
      <div className="legend">
        <span><span className="cert req">SABER</span><span>{bi(f, 'legendRequired', lang)}</span></span>
        <span><span className="cert ship">UN38.3</span><span>{bi(f, 'legendShip', lang)}</span></span>
        <span><span className="cert">CE</span><span>{bi(f, 'legendSupport', lang)}</span></span>
      </div>
    </div></section>
  );
}
