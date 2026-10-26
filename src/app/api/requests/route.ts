import { forward } from '../forward';
/** The public quote form → Aamer's public request door, through this server so the API host stays server-side. */
export async function POST(request: Request) { return forward(request, 'requests'); }
