import { notFound } from 'next/navigation';
import { bi, objects, section, str } from '@/lib/config';
import { getStorefront } from '@/lib/storefront.server';
import type { Lang } from '@/lib/types';
import { href, u, ui } from '@/lib/ui';

/** One article of the blog section. Live: any slug, on demand. Snapshot: the slugs the captured document lists. */
export async function ArticlePage({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang, slug } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  const l: Lang = lang;
  const sf = await getStorefront();
  if (sf === null) return null;
  const blog = section(sf.config, 'blog');
  const posts = blog ? objects(blog.items) : [];
  const post = posts.find((p) => str(p.slug) === slug);
  if (!post) notFound();
  const others = posts.filter((p) => str(p.slug) !== slug);
  return (
    <main>
      <div className="article"><div className="wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <a href={href(l)}>{u(ui.blog.home, l)}</a><span>›</span><a href={href(l, '#blog')}>{u(ui.blog.back, l)}</a>
        </nav>
        <span className="mono muted" style={{ fontSize: '.74rem', letterSpacing: '.14em' }}>{u(ui.blog.guide, l)} {str(post.number)}</span>
        <h1 style={{ marginTop: 8 }}>{bi(post, 'title', l)}</h1>
        <div className="meta"><span>{u(ui.blog.by, l)}</span><span>{str(post.minutes)} {u(ui.blog.minRead, l)}</span></div>
        <p className="lead" style={{ marginTop: 18, fontSize: '1.1rem' }}>{bi(post, 'lead', l)}</p>
        {/* The article body is written by the company in Aamer's store builder: owner-authored content. */}
        <div className="body" dangerouslySetInnerHTML={{ __html: bi(post, 'bodyHtml', l) }} />
        <div className="cta">
          <div><b>{u(ui.blog.ctaTitle, l)}</b><br /><span style={{ color: 'var(--on-navy-soft)', fontSize: '.9rem' }}>{u(ui.blog.ctaText, l)}</span></div>
          <a className="btn btn-accent" href={href(l, '#calc')}>{u(ui.blog.openCalc, l)}</a>
        </div>
        <div className="next">
          {others.map((p) => (
            <a key={str(p.slug)} href={href(l, `/blog/${str(p.slug)}`)} style={{ textDecoration: 'none' }}><span>{bi(p, 'title', l)}</span><span className="mono muted">{str(p.number)} →</span></a>
          ))}
        </div>
      </div></div>
    </main>
  );
}
