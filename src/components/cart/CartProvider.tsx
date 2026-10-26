'use client';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { JsonValue, Lang, StorefrontConfig } from '@/lib/types';
import { availability, products, type Product } from '@/lib/catalog';

/**
 * The cart lives in the visitor's browser only (localStorage) and ends in a QUOTE REQUEST through
 * Aamer's public door — no payment, no order (decisions 1 and 2 are deferred). Quantities are capped
 * by the overlay's availability badge.
 */
export interface CartLine { id: string; qty: number }
interface CartState {
  lang: Lang; config: StorefrontConfig; products: Product[]; lines: CartLine[];
  count: number; subtotal: number; open: boolean; checkout: boolean;
  add(id: string, qty: number): 'ok' | 'max';
  setQty(id: string, qty: number): void; remove(id: string): void; clear(): void;
  setOpen(open: boolean): void; setCheckout(open: boolean): void; product(id: string): Product | undefined;
}
const Ctx = createContext<CartState | null>(null);
const KEY = 'pc-cart';

export function CartProvider({ lang, config, rawProducts, children }: { lang: Lang; config: StorefrontConfig; rawProducts: JsonValue[]; children: React.ReactNode }) {
  const list = useMemo(() => products(config, rawProducts, lang), [config, rawProducts, lang]);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);
  const [checkout, setCheckout] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setLines((JSON.parse(raw) as CartLine[]).filter((l) => list.some((p) => p.id === l.id))); } catch { /* storage unavailable */ }
  }, [list]);
  const persist = useCallback((next: CartLine[]) => { setLines(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage unavailable */ } }, []);
  const product = useCallback((id: string) => list.find((p) => p.id === id), [list]);
  const maxOf = useCallback((id: string) => { const p = product(id); if (!p) return 0; const a = availability(p); return a.kind === 'soon' ? 0 : a.max; }, [product]);
  const add = useCallback((id: string, qty: number): 'ok' | 'max' => {
    const cur = lines.find((l) => l.id === id)?.qty ?? 0;
    if (cur + qty > maxOf(id)) return 'max';
    persist(cur ? lines.map((l) => (l.id === id ? { ...l, qty: cur + qty } : l)) : [...lines, { id, qty }]);
    return 'ok';
  }, [lines, maxOf, persist]);
  const setQty = useCallback((id: string, qty: number) => {
    if (qty <= 0) return persist(lines.filter((l) => l.id !== id));
    persist(lines.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, maxOf(id)) } : l)));
  }, [lines, maxOf, persist]);
  const remove = useCallback((id: string) => persist(lines.filter((l) => l.id !== id)), [lines, persist]);
  const clear = useCallback(() => persist([]), [persist]);
  useEffect(() => { document.body.classList.toggle('lock', open || checkout); return () => document.body.classList.remove('lock'); }, [open, checkout]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setOpen(false); setCheckout(false); } };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, []);
  const value = useMemo<CartState>(() => ({
    lang, config, products: list, lines,
    count: lines.reduce((n, l) => n + l.qty, 0), subtotal: lines.reduce((n, l) => n + l.qty * (product(l.id)?.price ?? 0), 0),
    open, checkout, add, setQty, remove, clear, setOpen, setCheckout, product,
  }), [lang, config, list, lines, open, checkout, add, setQty, remove, clear, product]);
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart(): CartState {
  const v = useContext(Ctx);
  if (!v) throw new Error('useCart outside CartProvider');
  return v;
}
