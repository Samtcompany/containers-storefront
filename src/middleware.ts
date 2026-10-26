import { NextResponse, type NextRequest } from 'next/server';

/** Arabic is the default: `/` and any unprefixed path are served from `/ar/...`; English lives under `/en`. */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname.startsWith('/ar') || pathname.startsWith('/en') || pathname.startsWith('/api') || pathname.startsWith('/_next') || /\.[a-z0-9]+$/i.test(pathname)) {
    return NextResponse.next();
  }
  const url = request.nextUrl.clone();
  url.pathname = `/ar${pathname === '/' ? '' : pathname}`;
  return NextResponse.rewrite(url);
}
export const config = { matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'] };
