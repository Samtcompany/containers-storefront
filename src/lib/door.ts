/**
 * PROTOTYPE MODE ONLY — the integrated experience with Aamer's operations prototype.
 *
 * In the live site every write goes to Aamer's public door through `/api/requests`. In the
 * prototype build (`NEXT_PUBLIC_PROTOTYPE=1`, a variant of the static snapshot) there is no
 * server: the Aamer prototype ships `bridge/door.js`, which plays the door against its mock state in
 * the browser, and this module is the typed way in. Nothing here runs in a live build.
 */

export const prototype = process.env.NEXT_PUBLIC_PROTOTYPE === '1';

export type Milestone = { key: string; ar: string; en: string };
export type CustomerPayment = { viaBank: boolean; id: string; label: string; dueDate: string; amountMinor: number; currency: string; receivedMinor: number; status: 'paid' | 'verifying' | 'overdue' | 'due' | 'scheduled'; gatewayAt: string | null };
export type CustomerDeal = {
  no: string; title: string; type: 'direct_supply' | 'brokerage'; typeLabel: string; customer: string;
  expectedDelivery: string | null; incoterm: string | null; cancelled: boolean; closed: boolean;
  milestone: number; milestones: Milestone[];
  lines: Array<{ description: string; qty: number; unit: string }>;
  quote: { version: number; date: string; totalMinor: number; currency: string; decision: string | null; decidedAt: string | null; validUntil: string | null } | null;
  brokerage: { feeBasis: 'fixed' | 'percent'; feeAmountMinor: number | null; feeRateBp: number | null; importerOfRecord: string | null; factoryPayer: string | null; acceptedAt: string | null; factory: string | null } | null;
  payments: CustomerPayment[];
  invoices: Array<{ no: string; date: string; amountMinor: number; currency: string; status: string; zatca: string | null }>;
  inspection: { date: string; result: string; defectsPct: number | null; aql: string | null } | null;
  shipments: Array<{ id: string; mode: string; bl: string | null; pol: string; pod: string; etd: string | null; atd: string | null; eta: string | null; ata: string | null; status: string; containers: Array<{ no: string; size: string }> }>;
  documents: Array<{ kind: string; name: string; date: string | null }>;
  deliveryConfirmed: boolean; inspectionAcknowledged: boolean;
  actions: { acceptQuote: boolean; acceptFees: boolean; pay: string[]; acknowledgeInspection: boolean; confirmDelivery: boolean };
};
export type TrackResult = { error?: string; reference?: string; mockPhone?: boolean; request?: { ref: string; date: string; kind: string; category: string | null; message: string; status: string; lostReason: string | null } | null; deal?: CustomerDeal | null };
export type ActionResult = { ok?: boolean; error?: string; deal?: CustomerDeal };

type Door = {
  submitRequest(body: unknown): { reference?: string; error?: string };
  track(reference: string, mobile: string): TrackResult;
  decideQuote(no: string, mobile: string, decision: 'accepted' | 'rejected', reason?: string): ActionResult;
  reportPayment(no: string, mobile: string, paymentId: string): ActionResult;
  acknowledgeInspection(no: string, mobile: string): ActionResult;
  confirmDelivery(no: string, mobile: string, note?: string): ActionResult;
};

/** The door, or null when this is not a prototype build or the script did not load. */
export function door(): Door | null {
  if (!prototype || typeof window === 'undefined') return null;
  return ((window as unknown as { PC_DOOR?: Door }).PC_DOOR) ?? null;
}

/** The customer's own references on this device, newest first — «طلباتي». */
const MINE = 'pc-site-my-requests';
export function rememberMine(reference: string, phone: string): void {
  try {
    const list = JSON.parse(localStorage.getItem(MINE) ?? '[]') as Array<{ reference: string; phone: string }>;
    const next = [{ reference, phone }, ...list.filter((x) => x.reference !== reference)].slice(0, 10);
    localStorage.setItem(MINE, JSON.stringify(next));
  } catch { /* storage blocked: the confirmation still shows the reference */ }
}
export function mine(): Array<{ reference: string; phone: string }> {
  try { return JSON.parse(localStorage.getItem(MINE) ?? '[]') as Array<{ reference: string; phone: string }>; } catch { return []; }
}

/** Integer minor units → «12,345.67». Never a float on money. */
export function minorText(minor: number): string {
  if (!Number.isSafeInteger(minor)) return '—';
  const neg = minor < 0; const abs = Math.abs(minor);
  return `${neg ? '-' : ''}${Math.floor(abs / 100).toLocaleString('en-US')}.${String(abs % 100).padStart(2, '0')}`;
}

/** 05XXXXXXXX → +9665XXXXXXXX, the shape the door and the live API both take. */
export function e164(mobile: string): string | null {
  const m = mobile.trim();
  return /^05\d{8}$/.test(m) ? `+966${m.slice(1)}` : null;
}
