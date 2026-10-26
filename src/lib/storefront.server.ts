import type { PublishedStorefront } from './types';
import { apiBase, slug } from './config';

/**
 * Server-only: the ONE read of everything this site shows — the configuration Aamer published for
 * the slug (ADR 0038 §3.4), cached in memory for a minute. A snapshot build reads a captured file.
 */
const TTL_MS = 60_000;
let cache: { at: number; value: PublishedStorefront | null } | null = null;
const SNAPSHOT_FILE = process.env.STOREFRONT_SNAPSHOT_FILE;

export async function getStorefront(): Promise<PublishedStorefront | null> {
  if (SNAPSHOT_FILE) {
    const { readFileSync } = await import('node:fs');
    return JSON.parse(readFileSync(SNAPSHOT_FILE, 'utf8')) as PublishedStorefront;
  }
  // Live: every page is rendered at request time, never frozen into the build (`connection()` is Next's way to say so).
  const { connection } = await import('next/server');
  await connection();
  if (cache && Date.now() - cache.at < TTL_MS) return cache.value;
  try {
    const res = await fetch(`${apiBase()}/api/v1/public/storefront/${encodeURIComponent(slug())}/config`, { cache: 'no-store' });
    const value = res.ok ? ((await res.json()) as PublishedStorefront) : null;
    cache = { at: Date.now(), value };
    return value;
  } catch {
    cache = { at: Date.now(), value: null };
    return null;
  }
}
