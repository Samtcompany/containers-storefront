import { notFound } from 'next/navigation';
/** Any address under a language that no page claims is the lost-container page, inside the site's own layout. */
export default function CatchAll() { notFound(); }
