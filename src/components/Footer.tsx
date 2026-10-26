import type { Lang, StorefrontConfig } from '@/lib/types';
import { bi, str } from '@/lib/config';
import { u, ui } from '@/lib/ui';
import { Brand } from './Logo';

export function Footer({ lang, config }: { lang: Lang; config: StorefrontConfig }) {
  const c = config.contact;
  const phone = str(c.phone) || str(c.whatsapp), email = str(c.email), cr = str(c.crNumber), hours = bi(c, 'workingHours', lang);
  return (
    <>
      <div className="band" aria-hidden="true"><span>PRCU 202610 <i>4</i><span style={{ opacity: .75 }}>45G1 · CHINA → KSA</span></span></div>
      <footer className="bg-grey">
        <div className="wrap foot">
          <div style={{ display: 'grid', gap: 8, maxWidth: 340 }}>
            <Brand lang={lang} site={config.site} brand={config.brand} href={`/${lang}`} />
            <p>{bi(config.site, 'footerNote', lang)}</p>
          </div>
          <div className="contact">
            <b>{u(ui.footer.contact, lang)}</b>
            {/* The three lines are always shown; a dash stands where the company has not filled the value yet. */}
            <span className="ph"><span>{u(ui.footer.mobile, lang)}</span> <span className="mono" dir="ltr">{phone || u(ui.footer.tbd, lang)}</span></span>
            <span className="ph"><span>{u(ui.footer.email, lang)}</span> <span className="mono" dir="ltr">{email || u(ui.footer.tbd, lang)}</span></span>
            <span className="ph"><span>{u(ui.footer.cr, lang)}</span> <span className="mono" dir="ltr">{cr || u(ui.footer.tbd, lang)}</span></span>
            {hours ? <span className="ph"><span>{u(ui.footer.hours, lang)}</span> {hours}</span> : null}
          </div>
          {bi(c, 'deliveryPartners', lang) || str(c.deliveryPartners) ? <div className="contact"><b>{u(ui.footer.partners, lang)}</b><span className="ph">{bi(c, 'deliveryPartners', lang) || str(c.deliveryPartners)}</span></div> : null}
        </div>
      </footer>
    </>
  );
}
