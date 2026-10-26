import { bi, objects, str } from '@/lib/config';
import { href, u, ui } from '@/lib/ui';
import { SecHead, type SectionProps } from './shared';
export function Blog({ s, ctx }: SectionProps) {
  const { lang } = ctx;
  return (
    <section id="blog" className="bg-grey"><div className="wrap">
      <SecHead s={s} lang={lang} />
      <div className="posts rv">
        {objects(s.items).map((p) => (
          <a className="post" href={href(lang, `/blog/${str(p.slug)}`)} key={str(p.slug)} style={{ textDecoration: 'none' }}>
            <div className="cover"><b>{str(p.number)}</b><span>{u(ui.blog.guide, lang)} · {str(p.minutes)} MIN</span></div>
            <div className="pb"><h3>{bi(p, 'title', lang)}</h3><p>{bi(p, 'lead', lang)}</p><span className="meta"><i>{u(ui.blog.team, lang)}</i><span>{str(p.minutes)} {u(ui.blog.minRead, lang)}</span></span></div>
          </a>
        ))}
      </div>
    </div></section>
  );
}
