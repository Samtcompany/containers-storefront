import { apiBase, slug } from '@/lib/config';

/**
 * Forwards one public write to Aamer. The client's address travels in `x-forwarded-for` so Aamer's
 * per-client limiter still sees the visitor (Aamer must run with TRUST_PROXY=true behind this site).
 */
export async function forward(request: Request, resource: 'requests' | 'unanswered'): Promise<Response> {
  let body: unknown;
  try { body = await request.json(); } catch { return Response.json({ error: { code: 'invalid_request' } }, { status: 400 }); }
  const client = request.headers.get('x-forwarded-for') ?? request.headers.get('x-real-ip') ?? '';
  try {
    const res = await fetch(`${apiBase()}/api/v1/public/storefront/${encodeURIComponent(slug())}/${resource}`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...(client ? { 'x-forwarded-for': client } : {}), ...(process.env.SITE_ORIGIN ? { origin: process.env.SITE_ORIGIN } : {}) },
      body: JSON.stringify(body),
      cache: 'no-store',
    });
    const text = await res.text();
    const headers: Record<string, string> = { 'content-type': 'application/json', 'cache-control': 'no-store' };
    const retry = res.headers.get('retry-after'); if (retry) headers['retry-after'] = retry;
    return new Response(text, { status: res.status, headers });
  } catch {
    return Response.json({ error: { code: 'unavailable' } }, { status: 503 });
  }
}
