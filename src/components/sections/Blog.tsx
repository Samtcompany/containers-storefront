import Link from 'next/link';
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
          <Link className="post" href={href(lang, `/blog/${str(p.slug)}`)} key={str(p.slug)}>
            <span className="mono muted">{u(ui.blog.guide, lang)} {str(p.number)} · {str(p.minutes)} {u(ui.blog.minRead, lang)}</span>
            <b>{bi(p, 'title', lang)}</b><span>{bi(p, 'lead', lang)}</span><span className="more">{u(ui.blog.read, lang)} →</span>
          </Link>
        ))}
      </div>
    </div></section>
  );
}
