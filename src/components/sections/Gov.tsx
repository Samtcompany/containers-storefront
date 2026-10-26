import { bi, objects } from '@/lib/config';
import { SecHead, type SectionProps } from './shared';

const ICONS = [
  <><rect x="6" y="4" width="20" height="24" rx="2" /><path d="M11 11h10M11 16h10M11 21h6" /></>,
  <><path d="M16 4 6 8v7c0 6 4 10.5 10 13 6-2.5 10-7 10-13V8z" /><path d="m11 16 3.5 3.5L21 13" /></>,
  <><rect x="4" y="8" width="24" height="16" rx="2" /><path d="M4 13h24M9 19h5" /></>,
  <><circle cx="9" cy="10" r="3" /><circle cx="23" cy="10" r="3" /><circle cx="16" cy="23" r="3" /><path d="M11 12l4 8M21 12l-4 8" /></>,
  <><path d="M8 4h12l6 6v18H8z" /><path d="M20 4v6h6M12 18l3 3 6-6" /></>,
  <><path d="M5 26h22M8 26V12l8-6 8 6v14" /><path d="M13 26v-7h6v7" /></>,
];
export function Gov({ s, ctx }: SectionProps) {
  const { lang } = ctx;
  return (
    <section id="gov" className="bg-white"><div className="wrap">
      <SecHead s={s} lang={lang} />
      <div className="gov-grid rv">
        {objects(s.items).map((g, i) => (
          <div className="gov-item" key={i}><svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.8">{ICONS[i % ICONS.length]}</svg><h3>{bi(g, 'title', lang)}</h3><p className="muted">{bi(g, 'text', lang)}</p></div>
        ))}
      </div>
    </div></section>
  );
}
