import { bi, objects } from '@/lib/config';
import { SecHead, type SectionProps } from './shared';
export function Faq({ s, ctx }: SectionProps) {
  const { lang } = ctx;
  return (
    <section id="faq" className="bg-white"><div className="wrap">
      <SecHead s={s} lang={lang} />
      <div className="faq rv">{objects(s.items).map((q, i) => <details key={i}><summary>{bi(q, 'question', lang)}</summary><div className="a">{bi(q, 'answer', lang)}</div></details>)}</div>
    </div></section>
  );
}
