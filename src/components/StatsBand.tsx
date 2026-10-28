"use client";
import { useEffect, useRef, useState } from "react";
import { properties, capacityRange } from "@/lib/data";

const halls = properties.filter(p => p.category === "banquet");
const maxGuests = Math.max(...halls.map(h => capacityRange(h.capacity)?.max || 0));
const items = [
  { n: halls.length, suffix: "", label: "Marriage halls to compare" },
  { n: maxGuests, suffix: "+", label: "Guests in our largest hall" },
  { n: 6, suffix: "", label: "Ceremonies covered, tilak to chaturthi" },
  { n: 1, suffix: " day", label: "To get your call-back" },
];

/** Numbers count up once when scrolled into view. Only facts that are true of the listings. */
export default function StatsBand() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setP(1); return; }
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const tick = (t: number) => { const k = Math.min(1, (t - t0) / 1800); setP(1 - Math.pow(1 - k, 3)); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <section className="stats" ref={ref} aria-label="Videh in numbers">
    <div className="container stats-grid">
      {items.map(i => <div key={i.label} className="stat"><strong>{Math.round(i.n * p).toLocaleString("en-IN")}{i.suffix}</strong><span>{i.label}</span></div>)}
    </div>
  </section>;
}
