'use client';
import { useEffect } from 'react';
/** The prototype's `.rv` reveal: elements fade in as they enter the viewport; everything shows at once when motion is reduced. */
export function Reveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll('.rv'));
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window) || reduce) { els.forEach((el) => el.classList.add('in')); return; }
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }, { rootMargin: '0px 0px -8% 0px' });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  return null;
}
