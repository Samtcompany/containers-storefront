import { forward } from '../forward';
/** A question the assistant could not answer → Aamer's unanswered log. */
export async function POST(request: Request) { return forward(request, 'unanswered'); }
