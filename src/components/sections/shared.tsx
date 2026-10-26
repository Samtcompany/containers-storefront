import type { JsonValue, Lang, Section, StorefrontConfig } from '@/lib/types';
import { bi } from '@/lib/config';

export interface Ctx { lang: Lang; config: StorefrontConfig; products: JsonValue[] }
export interface SectionProps { s: Section; ctx: Ctx }

/** The eyebrow / title / lead head every section opens with — all three from the section's fields. */
export function SecHead({ s, lang, className = 'sec-head rv', children }: { s: Section; lang: Lang; className?: string; children?: React.ReactNode }) {
  const eyebrow = bi(s.fields, 'eyebrow', lang), title = bi(s.fields, 'title', lang), lead = bi(s.fields, 'lead', lang);
  return (
    <div className={className}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      {title ? <h2>{title}</h2> : null}
      {lead ? <p className="lead">{lead}</p> : null}
      {children}
    </div>
  );
}
/** `#store` in the approved prototype is the store section on this site. */
export const anchor = (h: string) => (h === '#store' ? '#shop' : h);
