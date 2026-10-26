import { bi, objects, str } from '@/lib/config';
import { SecHead, type SectionProps } from './shared';

const ICON: Record<string, React.ReactNode> = {
  medical: <><rect x="5" y="5" width="22" height="22" rx="3" /><path d="M16 10v12M10 16h12" /></>,
  build: <><path d="M4 27h24M7 27V14h8v13M15 27V8h10v19" /><path d="M18 12h4M18 16h4M18 20h4" /></>,
  furniture: <><path d="M7 16V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" /><rect x="4" y="16" width="24" height="7" rx="2" /><path d="M7 23v4M25 23v4" /></>,
  heavy: <><path d="M4 26h24M6 26v-6h12v6M18 22h6l2 4" /><circle cx="10" cy="26" r="2" /><circle cx="22" cy="26" r="2" /></>,
  battery: <><rect x="4" y="10" width="21" height="12" rx="2" /><path d="M25 14h3v4h-3M9 16h6M12 13v6" /></>,
  general: <><rect x="5" y="9" width="22" height="17" rx="1" /><path d="M5 14h22M12 9V5h8v4" /></>,
};
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
            <div className="top"><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6">{ICON[str(c.categoryId)] ?? ICON.general}</svg><span className="code">{codeOf(str(c.categoryId))}</span></div>
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
