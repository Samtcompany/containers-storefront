'use client';
import { useEffect, useRef, useState } from 'react';
import type { Lang } from '@/lib/types';

const LABELS = {
  eyebrow: ['منذ يناير 2026', 'Since January 2026'], title: ['عام من الحاويات، بالأرقام', 'A year of containers, in numbers'], lead: ['أرقام من سجلات الشحن لدينا، تُحدَّث كل شهر.', 'Live figures from our shipping records, updated every month.'],
  placeholder: ['أرقام توضيحية حتى تُستبدل بالفعلية', 'Illustrative until replaced with real figures'],
  containers: ['حاوية وصلت', 'Containers arrived'], containersSub: ['عبر مينائي جدة والدمام', 'Through Jeddah and Dammam ports'],
  shipments: ['شحنة سُلّمت', 'Shipments delivered'], shipmentsSub: ['طلبات استيراد وطلبات متجر', 'Import orders and store orders'],
  clients: ['جهة وشركة نخدمها', 'Organisations we serve'], clientsSub: ['حكومية وصحية وقطاع خاص', 'Government, healthcare and private sector'],
  ontime: ['سُلّمت في موعدها', 'Delivered on time'],
} as const;
const t = (k: keyof typeof LABELS, lang: Lang) => (lang === 'en' ? LABELS[k][1] : LABELS[k][0]);

export function Live({ lang, stats }: { lang: Lang; stats: { containers: number; shipments: number; clients: number; ontime: number; updated: string; placeholder: boolean } }) {
  const ref = useRef<HTMLDivElement>(null);
  const [k, setK] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const run = () => {
      const t0 = performance.now(), d = reduce ? 0 : 1400;
      const f = (now: number) => { const p = d ? Math.min(1, (now - t0) / d) : 1; setK(1 - Math.pow(1 - p, 3)); if (p < 1) raf = requestAnimationFrame(f); };
      raf = requestAnimationFrame(f);
    };
    if (!('IntersectionObserver' in window)) { run(); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { run(); io.disconnect(); } }, { threshold: .3 });
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, []);
  const v = (n: number) => Math.round(n * k).toLocaleString('en-US');
  return (
    <div className="live" id="live" ref={ref}>
      <div className="wrap">
        <div className="lh">
          <div><p className="eyebrow">{t('eyebrow', lang)}</p><h2>{t('title', lang)}</h2><p>{t('lead', lang)}</p></div>
          {stats.placeholder ? <span className="pill-note">{t('placeholder', lang)}</span> : null}
        </div>
        <div className="tiles-s">
          <div className="st"><b>{v(stats.containers)}</b><span className="cap">{t('containers', lang)}</span><span className="sub">{t('containersSub', lang)}</span></div>
          <div className="st"><b>{v(stats.shipments)}</b><span className="cap">{t('shipments', lang)}</span><span className="sub">{t('shipmentsSub', lang)}</span></div>
          <div className="st"><b>{v(stats.clients)}</b><span className="cap">{t('clients', lang)}</span><span className="sub">{t('clientsSub', lang)}</span></div>
          <div className="st"><b>{v(stats.ontime)}<i>%</i></b><span className="cap">{t('ontime', lang)}</span><div className="meter"><i style={{ width: `${stats.ontime * k}%` }} /></div></div>
        </div>
        <span className="upd">UPDATED {stats.updated}</span>
      </div>
    </div>
  );
}
