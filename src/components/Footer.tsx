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
            {phone ? <span className="ph"><span>{u(ui.footer.mobile, lang)}</span> <span className="mono" dir="ltr">{phone}</span></span> : null}
            {email ? <span className="ph"><span>{u(ui.footer.email, lang)}</span> <span className="mono" dir="ltr">{email}</span></span> : null}
            {cr ? <span className="ph"><span>{u(ui.footer.cr, lang)}</span> <span className="mono" dir="ltr">{cr}</span></span> : null}
            {hours ? <span className="ph"><span>{u(ui.footer.hours, lang)}</span> {hours}</span> : null}
          </div>
          {str(c.deliveryPartners) ? <div className="contact"><b>{u(ui.footer.partners, lang)}</b><span className="ph">{str(c.deliveryPartners)}</span></div> : null}
        </div>
      </footer>
    </>
  );
}
