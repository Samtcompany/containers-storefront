import { notFound } from 'next/navigation';
import { enabledSections } from '@/lib/config';
import { getStorefront } from '@/lib/storefront.server';
import type { Lang } from '@/lib/types';
import { renderSection } from '@/components/sections';

export default async function Home({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  const l: Lang = lang;
  const sf = await getStorefront();
  if (sf === null) return null;
  const sections = enabledSections(sf.config);
  return (
    <main id="top">
      {sections.map((s) => <div key={s.id}>{renderSection(s, { lang: l, config: sf.config, products: sf.products })}</div>)}
    </main>
  );
}
