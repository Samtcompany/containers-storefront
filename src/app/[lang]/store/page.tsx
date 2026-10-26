import { notFound } from 'next/navigation';
import { section } from '@/lib/config';
import { getStorefront } from '@/lib/storefront.server';
import type { Lang } from '@/lib/types';
import { StoreView } from '@/components/StoreView';

/** The store page: every product Aamer's overlay marks visible, under the shop section's categories. Absent section → no page. */
export default async function Store({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (lang !== 'ar' && lang !== 'en') notFound();
  const l: Lang = lang;
  const sf = await getStorefront();
  if (sf === null) return null;
  const shop = section(sf.config, 'shop');
  if (!shop) notFound();
  return <StoreView lang={l} config={sf.config} shopFields={shop.fields} />;
}
