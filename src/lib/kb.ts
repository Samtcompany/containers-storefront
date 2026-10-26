import type { JsonObject, JsonValue } from './types';
import { objects, str, tx } from './config';

/**
 * The assistant's whole world: the knowledge base the company wrote, the FAQ, and the visible
 * products. Nothing else is ever answered from — a question outside it is logged, never guessed.
 */
export function kbText(assistant: JsonObject, faq: JsonValue[], products: JsonValue[]): string {
  const parts: string[] = [];
  for (const s of objects(assistant.kb)) parts.push(`## ${str(s.titleAr) || str(s.id)}\n${str(s.text)}`);
  const qa = objects(faq).map((f) => `س: ${tx(f.questionAr, 'ar')}\nج: ${tx(f.answerAr, 'ar')}`);
  if (qa.length) parts.push(`## أسئلة وأجوبة\n${qa.join('\n')}`);
  const pr = objects(products).map((p) => `- ${str(p.nameAr)}${p.salePrice ? `: ${str(p.salePrice)} ر.س` : ''}`);
  if (pr.length) parts.push(`## منتجات المتجر (أسعار شاملة الضريبة بالريال)\n${pr.join('\n')}`);
  return parts.join('\n\n').slice(0, 60_000);
}

export const normAr = (t: string): string => (t || '').toLowerCase().replace(/[ً-ْـ]/g, '').replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/[\u060C\u061B\u061F]/g, ' ').replace(/[^\w؀-ۿ\s]/g, ' ');
const STOP = new Set(['ماذا', 'كيف', 'هل', 'متى', 'اين', 'كم', 'ما', 'من', 'عن', 'على', 'في', 'الى', 'مع', 'what', 'how', 'does', 'the', 'and', 'for', 'are', 'you', 'can']);

export function kbSearch(text: string, q: string): string[] {
  const qw = normAr(q).split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
  if (!qw.length) return [];
  const lines = text.split('\n').filter((l) => l.trim() && !l.startsWith('##'));
  // A word matches through its stem too: «أدفع» reaches «تدفع», «ندفع» and «الدفع»; «الشحن» reaches «شحن».
  const variants = (w: string) => [w, w.replace(/^ال/, ''), w.replace(/^[وفبلتنيا]/, '')].filter((v) => v.length >= 3);
  const scored = lines.map((l) => {
    const n = normAr(l); let sc = 0;
    for (const w of qw) {
      if (variants(w).some((v) => n.includes(v))) sc += w.length > 4 ? 2 : 1;
      else if (w.length > 4 && n.includes(w.slice(0, 4))) sc += 0.5;
    }
    return [sc, l] as const;
  }).filter((x) => x[0] >= 2).sort((a, b) => b[0] - a[0]);
  return scored.slice(0, 3).map((x) => x[1].replace(/^س: /, '').replace(/^ج: /, '').replace(/^- /, ''));
}

/** Pull figures and keywords out of a free-text question so the calculator can answer it. */
export function parseEstimateQuestion(q: string): { value: number | null; volume: number; weight: number; cat: string; mode: string } {
  const latin = q.replace(/[٠-٩]/g, (d) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d))).replace(/,/g, '');
  const numbers = (latin.match(/\d+(?:\.\d+)?/g) ?? []).map(Number);
  const mode = /جو|air|طيار/i.test(q) ? 'air' : /بر[يى]|land|truck|شاحن/i.test(q) ? 'land' : 'sea';
  const cat = /طب|medic|glove|قفاز|كمام/i.test(q) ? 'medical' : /بناء|بلاط|tile|build|سيراميك/i.test(q) ? 'build' : /أثاث|كرس|furnit|chair|طاول/i.test(q) ? 'furniture'
    : /بطار|batter|solar|شمس/i.test(q) ? 'battery' : /مولد|معد|generat|machine|heavy/i.test(q) ? 'heavy' : 'general';
  let volume = 0, weight = 0;
  const mv = /(\d[\d.]*)\s*(?:م³|م3|m3|m³|متر|cbm)/i.exec(latin); if (mv) volume = Number(mv[1]);
  const mk = /(\d[\d.]*)\s*(?:كجم|كيلو|kg)/i.exec(latin); if (mk) weight = Number(mk[1]);
  const big = numbers.filter((x) => x !== volume && x !== weight).sort((a, b) => b - a);
  return { value: big.length ? big[0] : null, volume, weight, cat, mode };
}
