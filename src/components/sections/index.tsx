import type { Section } from '@/lib/types';
import type { Ctx } from './shared';
import { Hero } from './Hero';
import { Clients } from './Clients';
import { Story } from './Story';
import { Shop } from './Shop';
import { Import } from './Import';
import { Containers } from './Containers';
import { Calculator } from './Calculator';
import { Journey } from './Journey';
import { Shipping } from './Shipping';
import { Certs } from './Certs';
import { Tracking } from './Tracking';
import { Gov } from './Gov';
import { Compliance } from './Compliance';
import { Faq } from './Faq';
import { Blog } from './Blog';
import { Rfq } from './Rfq';

/** Every section kind this site knows how to draw. An id the site does not know is skipped, never crashed on. */
export function renderSection(s: Section, ctx: Ctx) {
  switch (s.id) {
    case 'hero': return <Hero s={s} ctx={ctx} />;
    case 'clients': return <Clients s={s} ctx={ctx} />;
    case 'story': return <Story s={s} ctx={ctx} />;
    case 'shop': return <Shop s={s} ctx={ctx} />;
    case 'import': return <Import s={s} ctx={ctx} />;
    case 'containers': return <Containers s={s} ctx={ctx} />;
    case 'calc': return <Calculator s={s} ctx={ctx} />;
    case 'journey': return <Journey s={s} ctx={ctx} />;
    case 'shipping': return <Shipping s={s} ctx={ctx} />;
    case 'certs': return <Certs s={s} ctx={ctx} />;
    case 'tracking': return <Tracking s={s} ctx={ctx} />;
    case 'gov': return <Gov s={s} ctx={ctx} />;
    case 'compliance': return <Compliance s={s} ctx={ctx} />;
    case 'faq': return <Faq s={s} ctx={ctx} />;
    case 'blog': return <Blog s={s} ctx={ctx} />;
    case 'rfq': return <Rfq s={s} ctx={ctx} />;
    default: return null;
  }
}
