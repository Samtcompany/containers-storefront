import type { JsonObject, JsonValue, Lang, StorefrontConfig } from './types';
import { bi, num, objects, str } from './config';

/**
 * The catalogue as the published configuration carries it: the shop section's categories (with their
 * subcategories and certificates) and the products Aamer's overlay marks visible (`products` in the
 * public configuration). Nothing here is invented — a product's category is the one whose
 * subcategories include its `subcategory`, its certificate is the category's required one, and its
 * availability is the overlay's `badge` (`in_stock` · `low:N` · `soon`) until inventory is linked.
 */
export interface Category { id: string; code: string; name: string; text: string; subs: Array<{ id: string; name: string }>; cert: string; raw: JsonObject }
export interface Product {
  id: string; sku: string; name: string; price: number; currency: string; category: Category | null; sub: string; subName: string;
  cert: string; featured: boolean; sortOrder: number; stock: number | null; image: string | null; raw: JsonObject;
}
export type Availability = { kind: 'in'; max: number } | { kind: 'low'; max: number } | { kind: 'soon' };

export function categories(config: StorefrontConfig, lang: Lang): Category[] {
  const shop = config.sections.find((s) => s.id === 'shop' && s.enabled);
  return shop ? objects(shop.items).map((c) => ({
    id: str(c.id), code: str(c.code), name: bi(c, 'name', lang), text: bi(c, 'text', lang),
    subs: objects(c.subcategories).map((x) => ({ id: str(x.id), name: bi(x, 'name', lang) })),
    cert: str(objects(c.certificates).find((x) => str(x.level) === 'req')?.name),
    raw: c,
  })) : [];
}

/** `in_stock` · `low:N` · `soon` → what the card may sell. An unknown badge sells like `in_stock`. */
export function availability(p: Product): Availability {
  if (p.stock === 0) return { kind: 'soon' };
  if (p.stock !== null && p.stock <= 10) return { kind: 'low', max: p.stock };
  return { kind: 'in', max: 99 };
}

export function products(config: StorefrontConfig, raw: JsonValue[], lang: Lang): Product[] {
  const cats = categories(config, lang);
  return objects(raw).map((p) => {
    const sub = str(p.subcategory);
    const cat = cats.find((c) => c.subs.some((s) => s.id === sub)) ?? null;
    const badge = str(p.badge);
    const stock = badge === 'soon' ? 0 : /^low:\d+$/.test(badge) ? Number(badge.slice(4)) : null;
    const first = Array.isArray(p.images) ? p.images[0] : undefined;
    const image = typeof first === 'string' && first !== '' ? first : null;
    return {
      id: str(p.itemId), sku: str(p.sku), name: bi(p, 'name', lang), price: num(p.salePrice), currency: str(p.currency, 'SAR'),
      category: cat, sub, subName: cat?.subs.find((s) => s.id === sub)?.name ?? '', cert: cat?.cert ?? '',
      featured: p.featured === true, sortOrder: num(p.sortOrder), stock, image, raw: p,
    };
  }).filter((p) => p.id && p.price >= 0);
}

export const byNewest = (a: Product, b: Product) => b.sortOrder - a.sortOrder;
