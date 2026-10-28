"use client";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ImageSlider({ images, alt, children }: { images: string[]; alt: string; children?: React.ReactNode }) {
  const [i, setI] = useState(0);
  const touchX = useRef<number | null>(null);
  const go = (n: number) => setI((n + images.length) % images.length);
  return (
    <div className="slider" role="region" aria-roledescription="carousel" aria-label={`${alt} photos`}
      tabIndex={0} onKeyDown={e => { if (e.key === "ArrowLeft") go(i - 1); if (e.key === "ArrowRight") go(i + 1); }}>
      <div className="slider-viewport"
        onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
        onTouchEnd={e => { if (touchX.current === null) return; const d = e.changedTouches[0].clientX - touchX.current; if (Math.abs(d) > 40) go(i + (d < 0 ? 1 : -1)); touchX.current = null; }}>
        <div className="slider-track" style={{ transform: `translateX(-${i * 100}%)` }}>
          {images.map((src, n) => <img key={src} src={src} alt={`${alt} — photo ${n + 1}`} loading={n === 0 ? "eager" : "lazy"} />)}
        </div>
        {children}
        {images.length > 1 && <>
          <button className="slider-btn slider-prev" onClick={() => go(i - 1)} aria-label="Previous photo"><ChevronLeft size={20} /></button>
          <button className="slider-btn slider-next" onClick={() => go(i + 1)} aria-label="Next photo"><ChevronRight size={20} /></button>
          <span className="slider-count">{i + 1} / {images.length}</span>
        </>}
      </div>
      {images.length > 1 && <div className="slider-thumbs">
        {images.map((src, n) => <button key={src} className={n === i ? "active" : ""} onClick={() => setI(n)} aria-label={`Show photo ${n + 1}`}><img src={src} alt="" loading="lazy" /></button>)}
      </div>}
    </div>
  );
}
