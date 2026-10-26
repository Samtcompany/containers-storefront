/** The approved prototype's six category drawings, keyed by the category id the document uses. */
const ICON: Record<string, React.ReactNode> = {
  medical: <><rect x="5" y="5" width="22" height="22" rx="3" /><path d="M16 10v12M10 16h12" /></>,
  build: <><path d="M4 27h24M7 27V14h8v13M15 27V8h10v19" /><path d="M18 12h4M18 16h4M18 20h4" /></>,
  furniture: <><path d="M7 16V9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7" /><rect x="4" y="16" width="24" height="7" rx="2" /><path d="M7 23v4M25 23v4" /></>,
  heavy: <><path d="M4 26h24M6 26v-6h12v6M18 22h6l2 4" /><path d="M10 20V8l12 6" /></>,
  battery: <><rect x="6" y="9" width="18" height="16" rx="2" /><path d="M24 14h3v6h-3M14 12l-3 6h5l-3 5" /></>,
  general: <><rect x="5" y="9" width="22" height="17" rx="1" /><path d="M5 14h22M12 9V5h8v4" /></>,
};
export function CatIcon({ id }: { id: string | null | undefined }) {
  return <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">{ICON[id ?? ''] ?? ICON.general}</svg>;
}
