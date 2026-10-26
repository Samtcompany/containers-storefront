'use client';
import { useState } from 'react';
import { bi, num, objects, str } from '@/lib/config';
import { u, ui } from '@/lib/ui';
import { SecHead, type SectionProps } from './shared';

export function Containers({ s, ctx }: SectionProps) {
  const { lang } = ctx;
  const boxes = objects(s.items);
  const [bx, setBx] = useState(Math.min(2, Math.max(0, boxes.length - 1)));
  const b = boxes[bx];
  if (!b) return null;
  const len = num(b.lengthM), h = num(b.heightM), vol = b.volumeM3 === null ? null : num(b.volumeM3), pal = num(b.pallets), lcl = b.lcl === true;
  const S2 = 38, W = len * S2, H = h * S2, x0 = (540 - W) / 2, y0 = 170 - H;
  const pw = 1.2 * S2 * 0.5 + 1, slots = lcl ? 21 : pal, perRow = Math.max(1, Math.floor((W - 10) / pw)), ph = 1.1 * S2;
  const pallets: React.ReactNode[] = [];
  for (let i = 0; i < slots; i += 1) {
    const col = i % perRow, row = Math.floor(i / perRow); if (row > 1) break;
    const px = x0 + 5 + col * pw, py = 170 - ph * (row + 1) - 1; if (py < y0 + 2) break;
    const mine = !lcl || i < pal;
    pallets.push(<rect className="pal" key={i} style={{ animationDelay: `${i * 25}ms` }} x={px} y={py} width={pw - 2} height={ph - 2} rx="1.5" fill={mine ? 'var(--signal)' : 'var(--c-grey)'} opacity={mine ? .9 : .45} />);
  }
  return (
    <section id="containers" className="bg-white"><div className="wrap">
      <SecHead s={s} lang={lang} />
      <div className="box-grid rv">
        <div>
          <div className="chips" role="tablist" aria-label="Container type">
            {boxes.map((x, i) => <button key={i} type="button" className="chip-btn" role="tab" aria-selected={i === bx} onClick={() => setBx(i)}>{bi(x, 'name', lang)}</button>)}
          </div>
          <ul className="spec">
            <li><span>{u(ui.box.size, lang)}</span><span dir="ltr">{len.toFixed(2)} × 2.35 × {h.toFixed(2)} m</span></li>
            <li><span>{u(ui.box.capacity, lang)}</span><span dir="ltr">{vol ? `≈ ${vol} m³` : '1–15 m³'}</span></li>
            <li><span>{u(ui.box.payload, lang)}</span><span dir="ltr">{lcl ? u(ui.box.share, lang) : `≈ ${str(b.maxKg)} kg`}</span></li>
            <li><span>{u(ui.box.pallets, lang)}</span><span>{lcl ? u(ui.box.byVolume, lang) : pal}</span></li>
            <li className="fit">{bi(b, 'fit', lang)}</li>
          </ul>
        </div>
        <div className="box-stage">
          <svg viewBox="0 0 540 200" role="img" aria-label="Container drawing">
            <rect x="10" y="176" width="520" height="4" rx="2" fill="var(--grey-2)" />
            <rect x={x0} y={y0} width={W} height={H} fill="var(--white)" stroke="var(--steel)" strokeWidth="3" rx="2" />
            <rect x={x0 + W - 6} y={y0} width="6" height={H} fill="var(--steel)" />
            {pallets}
            <text x={x0} y={y0 - 8} fontFamily="JetBrains Mono, ui-monospace, monospace" fontSize="11" fill="var(--muted)" direction="ltr">{str(b.key)} · {len.toFixed(2)} m</text>
          </svg>
          <div className="cap">
            {lcl ? <><span><i style={{ background: 'var(--signal)' }} />{u(ui.box.yours, lang)}</span><span><i style={{ background: 'var(--c-grey)', opacity: .6 }} />{u(ui.box.others, lang)}</span></> : <span><i style={{ background: 'var(--signal)' }} />{u(ui.box.pallet, lang)}</span>}
          </div>
        </div>
      </div>
    </div></section>
  );
}
