"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Grid2x2, X } from "lucide-react";

/** Photo mosaic (1 large + up to 4 small) with a full-screen viewer — the pattern used by Airbnb, Booking and WedMeGood. */
export default function Gallery({ images, alt, children }: { images: string[]; alt: string; children?: React.ReactNode }) {
  const [open, setOpen] = useState<number | null>(null);
  const touchX = useRef<number | null>(null);
  const [bad, setBad] = useState<string[]>([]);   // photos that fail to load are dropped, so there are never broken tiles
  const list = images.filter(u => !bad.includes(u));
  const n = list.length;
  const shown = list.slice(0, 5);
  const go = useCallback((d: number) => setOpen(v => (v === null ? v : (v + d + n) % n)), [n]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); if (e.key === "ArrowLeft") go(-1); if (e.key === "ArrowRight") go(1); };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = prev; };
  }, [open, go]);

  if (n === 0) return <div className="gal gal-1"><div className="gal-cell gal-empty" aria-label={alt}>{children}</div></div>;
  return <>
    <div className={`gal gal-${Math.min(shown.length, 5)}`}>
      {shown.map((src, i) => (
        <button key={src + i} className={`gal-cell gal-cell-${i}`} onClick={() => setOpen(i)} aria-label={`Open photo ${i + 1} of ${n}`}>
          <img src={src} alt={i === 0 ? alt : `${alt} — photo ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} onError={() => setBad(b => [...b, src])} />
        </button>
      ))}
      {children}
      {n > 1 && <button className="gal-all" onClick={() => setOpen(0)}><Grid2x2 size={16} /> View all {n} photos</button>}
    </div>
    {open !== null && (
      <div className="lb" role="dialog" aria-modal="true" aria-label={`${alt} photos`} onClick={() => setOpen(null)}>
        <button className="lb-close" onClick={() => setOpen(null)} aria-label="Close"><X size={22} /></button>
        <span className="lb-count">{open + 1} / {n}</span>
        {n > 1 && <button className="lb-nav lb-prev" onClick={e => { e.stopPropagation(); go(-1); }} aria-label="Previous photo"><ChevronLeft size={26} /></button>}
        <img className="lb-img" src={list[open]} alt={`${alt} — photo ${open + 1}`} onClick={e => e.stopPropagation()}
          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={e => { if (touchX.current === null) return; const d = e.changedTouches[0].clientX - touchX.current; if (Math.abs(d) > 40) go(d < 0 ? 1 : -1); touchX.current = null; }} />
        {n > 1 && <button className="lb-nav lb-next" onClick={e => { e.stopPropagation(); go(1); }} aria-label="Next photo"><ChevronRight size={26} /></button>}
      </div>
    )}
  </>;
}
