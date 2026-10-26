import type { JsonObject, Lang } from '@/lib/types';
import { arr, bi, objects, str } from '@/lib/config';

/** The delivery / payment / instalments / returns strip, every cell from `shop.fields.strip`. */
export function StoreStrip({ fields, lang }: { fields: JsonObject; lang: Lang }) {
  const cells = objects(fields.strip);
  if (cells.length === 0) return null;
  return (
    <div className="store-strip">
      {cells.map((x, i) => (
        <div key={i}>
          <b>{bi(x, 'title', lang)}</b>
          {arr(lang === 'en' && Array.isArray(x.payEn) ? x.payEn : x.pay).length ? <div className="pay">{arr(lang === 'en' && Array.isArray(x.payEn) ? x.payEn : x.pay).map((p, k) => <span key={k}>{str(p)}</span>)}</div> : null}
          {bi(x, 'text', lang) ? <span>{bi(x, 'text', lang)}</span> : null}
        </div>
      ))}
    </div>
  );
}
