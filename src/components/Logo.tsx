import type { Lang } from '@/lib/types';
import type { JsonObject } from '@/lib/types';
import { bi, str } from '@/lib/config';

/** The ribbed P mark. A `logoUrl` in the brand document replaces the drawing; the wordmark keeps "برايم" small and "كونتينرز" large. */
export function Mark({ light = false }: { light?: boolean }) {
  const ink = light ? '#fff' : 'var(--ink)', rib = light ? '#0F2238' : 'var(--white)';
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <path fill={ink} fillRule="evenodd" d="M11 8H53a3 3 0 0 1 3 3V39a3 3 0 0 1-3 3H33V53a3 3 0 0 1-3 3H11a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3ZM24 19H40a6 6 0 0 1 0 12H24a6 6 0 0 1 0-12Z" />
      <g fill={rib} opacity={light ? 0.3 : 0.26}>
        <rect x="12" y="11" width="2" height="42" rx=".6" /><rect x="17" y="11" width="2" height="42" rx=".6" /><rect x="22" y="11" width="2" height="42" rx=".6" />
        <rect x="27" y="11" width="2" height="7" rx=".6" /><rect x="27" y="32" width="2" height="21" rx=".6" /><rect x="35" y="11" width="2" height="6" rx=".6" />
        <rect x="35" y="33" width="2" height="6" rx=".6" /><rect x="40" y="11" width="2" height="6" rx=".6" /><rect x="40" y="33" width="2" height="6" rx=".6" />
        <rect x="45" y="11" width="2" height="28" rx=".6" /><rect x="50" y="14" width="2" height="22" rx=".6" />
      </g>
      {light ? null : <rect fill="var(--signal)" x="37" y="46" width="19" height="10" rx="2.5" />}
    </svg>
  );
}

export function Brand({ lang, site, brand, href = '#top' }: { lang: Lang; site: JsonObject; brand: JsonObject; href?: string }) {
  const logo = str(brand.logoUrl);
  const name = bi(site, 'name', lang);
  return (
    <a className="brand" href={href} aria-label={name}>
      {logo ? <img src={logo} alt="" style={{ height: 38, width: 'auto' }} /> : <Mark />}
      <span className="wm"><small className="pre">{bi(site, 'short', lang) ? (lang === 'en' ? 'PRIME' : 'برايم') : ''}</small><b>{bi(site, 'short', lang) || name}</b></span>
    </a>
  );
}
