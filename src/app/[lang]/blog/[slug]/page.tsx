import { ArticlePage } from '@/components/pages/ArticlePage';

/**
 * LIVE route: no static params, so every slug is rendered on demand from Aamer. A static export needs
 * the slugs up front — `scripts/snapshot.mjs` swaps in `page.snapshot.tsx` for that build.
 */
export default ArticlePage;
