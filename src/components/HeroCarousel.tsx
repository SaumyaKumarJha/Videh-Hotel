"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, CalendarHeart } from "lucide-react";

// Swap these for real wedding photography from your venues when available.
const slides = [
  { img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1400&q=85", label: "Vivah · विवाह", title: "Find the marriage hall for your shubh vivah.", text: "Banquet halls, courtyards and mandap venues across Madhubani district — compare them, then send one enquiry." },
  { img: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1400&q=85", label: "Reception · स्वागत", title: "Halls for 100 guests or 1,000.", text: "See capacity and starting packages up front, before you call or visit a single hall." },
  { img: "https://images.unsplash.com/photo-1507504031003-b417219a0b5a?auto=format&fit=crop&w=1400&q=85", label: "Aangan · आंगन", title: "A courtyard for haldi, a hall for the vivah.", text: "Tilak, matkor, vivah, chaturthi — find halls that suit every ceremony of a Mithila wedding." },
  { img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1400&q=85", label: "Lagan · लगन", title: "Lagan dates fill fast. Enquire early.", text: "Tell us your date and guest count. We check which halls are free and call you back with options." },
];

export default function HeroCarousel() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const go = useCallback((n: number) => setI((n + slides.length) % slides.length), []);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => setI(v => (v + 1) % slides.length), 6000);
    return () => clearTimeout(t);
  }, [i, paused]);

  const s = slides[i];
  return (
    <section className="hero2 hero-wedding" role="region" aria-roledescription="carousel" aria-label="Marriage halls"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
      <div className="hero-toran" aria-hidden="true" />
      <div className="petals" aria-hidden="true">{Array.from({ length: 9 }, (_, n) => <span key={n} />)}</div>
      <div className="container hero2-grid">
        <div className="hero2-copy">
          <p className="hero-script">शुभ विवाह</p>
          <div className="hero2-text" key={i} aria-live="polite">
            <div className="eyebrow">{s.label}</div>
            <h1>{s.title}</h1>
            <p>{s.text}</p>
            <div className="hero-cta-row">
              <Link className="button button-dark" href="/enquire">Enquire for a hall <ArrowRight size={17} /></Link>
              <Link className="hero-ghost" href="/banquets"><CalendarHeart size={18} /> Browse marriage halls</Link>
            </div>
          </div>
          <div className="hero2-controls">
            <button className="hero2-arrow" onClick={() => go(i - 1)} aria-label="Previous slide"><ChevronLeft size={20} /></button>
            <div className="hero2-dots">
              {slides.map((_, n) => <button key={n} className={n === i ? "active" : ""} onClick={() => go(n)} aria-label={`Go to slide ${n + 1}`} aria-current={n === i} />)}
            </div>
            <button className="hero2-arrow" onClick={() => go(i + 1)} aria-label="Next slide"><ChevronRight size={20} /></button>
          </div>
        </div>
        <div className="hero2-frame"
          onTouchStart={e => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={e => { if (touchX.current === null) return; const d = e.changedTouches[0].clientX - touchX.current; if (Math.abs(d) > 40) go(i + (d < 0 ? 1 : -1)); touchX.current = null; }}>
          <div className="hero2-stage">
            {slides.map((sl, n) => (
              <div key={sl.label} className={`hero2-slide ${n === i ? "is-active" : ""}`} aria-hidden={n !== i}>
                <img src={sl.img} alt={n === i ? sl.title : ""} loading={n === 0 ? "eager" : "lazy"} />
              </div>
            ))}
          </div>
          <span className="hero2-chip">{s.label}</span>
          <span className="hero-fishpair" aria-hidden="true" />
        </div>
      </div>
      <div className="hero2-rule" />
    </section>
  );
}
