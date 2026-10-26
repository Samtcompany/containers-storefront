import type { JsonObject, JsonValue, Lang, PublishedStorefront, Section } from './types';

/**
 * The ONE source of everything this site shows: the configuration Aamer published for the slug
 * (ADR 0038 §3.4). Read server-side, cached in memory for a minute, never from a database.
 */
const API = (process.env.AAMER_API_URL ?? 'http://127.0.0.1:3001').replace(/\/$/, '');
const SLUG = process.env.STOREFRONT_SLUG ?? 'containers';
const TTL_MS = 60_000;

let cache: { at: number; value: PublishedStorefront | null } | null = null;

export async function getStorefront(): Promise<PublishedStorefront | null> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.value;
  try {
    const res = await fetch(`${API}/api/v1/public/storefront/${encodeURIComponent(SLUG)}/config`, { cache: 'no-store' });
    const value = res.ok ? ((await res.json()) as PublishedStorefront) : null;
    cache = { at: Date.now(), value };
    return value;
  } catch {
    cache = { at: Date.now(), value: null };
    return null;
  }
}

export const apiBase = () => API;
export const slug = () => SLUG;

// ---------------------------------------------------------------- reading the document
export const isObject = (v: JsonValue | undefined): v is JsonObject => v !== null && typeof v === 'object' && !Array.isArray(v);
export const str = (v: JsonValue | undefined, fallback = ''): string => (typeof v === 'string' ? v : typeof v === 'number' ? String(v) : fallback);
export const num = (v: JsonValue | undefined, fallback = 0): number => (typeof v === 'number' ? v : typeof v === 'string' && v !== '' && !Number.isNaN(Number(v)) ? Number(v) : fallback);
export const arr = (v: JsonValue | undefined): JsonValue[] => (Array.isArray(v) ? v : []);
export const objects = (v: JsonValue | undefined): JsonObject[] => arr(v).filter(isObject);

/** A bilingual field: `titleAr` / `titleEn` → the one for the language, falling back to the other. */
export function bi(o: JsonObject | undefined, key: string, lang: Lang): string {
  if (!o) return '';
  const a = str(o[`${key}Ar`]), e = str(o[`${key}En`]);
  if (lang === 'en') return e || a;
  return a || e;
}
/** `{ar, en}` objects as the knowledge base and some items carry them. */
export function tx(v: JsonValue | undefined, lang: Lang): string {
  if (typeof v === 'string') return v;
  if (isObject(v)) return str(v[lang]) || str(v.ar) || str(v.en);
  return '';
}

export function enabledSections(config: PublishedStorefront['config']): Section[] {
  return [...config.sections].filter((s) => s.enabled).sort((a, b) => a.order - b.order);
}
export function section(config: PublishedStorefront['config'], id: string): Section | null {
  return config.sections.find((s) => s.id === id && s.enabled) ?? null;
}

/** Digits in the Latin form and a thousands separator — the prototype's `fmt`. */
export const fmt = (n: number, digits = 2): string => n.toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits });
export const fmt0 = (n: number): string => fmt(n, 0);
