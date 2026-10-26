import { objects, section, str } from '@/lib/config';
import { getStorefront } from '@/lib/storefront.server';
import { ArticlePage } from '@/components/pages/ArticlePage';

/** SNAPSHOT route (swapped in by `scripts/snapshot.mjs`): the captured document's slugs, exported statically. */
export async function generateStaticParams() {
  const sf = await getStorefront();
  const posts = sf ? objects(section(sf.config, 'blog')?.items) : [];
  return (['ar', 'en'] as const).flatMap((lang) => posts.map((p) => ({ lang, slug: str(p.slug) })));
}
export default ArticlePage;
