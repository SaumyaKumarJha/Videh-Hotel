"use client";
import Link from "next/link";
import { Fragment, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

// One "beat" per phrase. Each beat eases in slowly, HOLDS for a moment, then eases out.
const BEATS = [
  { dev: "मिथिला की धरती पर", text: "On the soil of Mithila," },
  { dev: "हर विवाह एक कथा है", text: "every wedding is a story" },
  { dev: "रंग, गीत और आशीर्वाद में", text: "told in colour, song and blessing." },
  { dev: "आपकी कथा यहीं से शुरू हो", text: "Let yours begin at Hotel Videh & Marriage Hall." },
];

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3.2);   // long, soft landing = slow motion
const easeIn = (t: number) => t * t * t;

export default function ScrollStory() {
  const wrap = useRef<HTMLElement | null>(null);
  const beatEls = useRef<(HTMLDivElement | null)[]>([]);
  const ring = useRef<HTMLDivElement | null>(null);
  const bar = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = wrap.current; if (!el) return;
        let target = 0, cur = 0, raf = 0, running = false;
    const N = BEATS.length;
    // Layout is read only on load/resize; while scrolling we only use window.scrollY (no forced layouts).
    let top = 0, span = 1;
    const layout = () => { const r = el.getBoundingClientRect(); top = r.top + window.scrollY; span = Math.max(1, r.height - window.innerHeight); };
    const measure = () => { target = clamp((window.scrollY - top) / span); };
    // Cache the nodes once instead of querying them on every frame.
    const beats = beatEls.current.map(b => b && {
      b, words: Array.from(b.querySelectorAll<HTMLElement>(".ss-word")),
      dev: b.querySelector<HTMLElement>(".ss-dev"), cta: b.querySelector<HTMLElement>(".ss-cta"), state: "",
    });
    const paint = () => {
      // The picture chases the scroll with inertia, so text keeps gliding after you stop — slow motion.
      cur += (target - cur) * 0.055;
      if (Math.abs(target - cur) < 0.0004) cur = target;
      beats.forEach((x, k) => {
        if (!x) return;
        const raw = cur * N - k + (k === 0 ? 0.14 : 0);
        const last = k === N - 1;
        // beats that are not on screen are hidden once and then skipped entirely
        const off = raw <= 0 || (!last && raw >= 1);
        if (off) { if (x.state !== "off") { x.state = "off"; x.b.classList.add("is-off"); x.b.classList.remove("is-on"); } return; }
        if (x.state !== "on") { x.state = "on"; x.b.classList.remove("is-off"); x.b.classList.add("is-on"); }
        const t = clamp(raw);   // 0..1 inside this beat
        const exit = last ? 0 : easeIn(clamp((t - 0.86) / 0.14));
        x.words.forEach((wd, i) => {
          const p = easeOut(clamp((t - i * 0.028) / 0.3));   // all words are in by ~55% of the beat, then the line HOLDS until ~86%
          const blur = (1 - p) * 14 + exit * 8;
          wd.style.opacity = String(p * (1 - exit));
          wd.style.transform = `translate3d(0,${((1 - p) * 46 - exit * 34).toFixed(1)}px,0)`;
          wd.style.filter = blur < 0.2 ? "none" : `blur(${blur.toFixed(1)}px)`;
        });
        if (x.dev) {
          // opacity + transform only (animating letter-spacing forced a page layout on every frame)
          const p = easeOut(clamp((t - 0.12) / 0.14));
          x.dev.style.opacity = String(p * (1 - exit));
          x.dev.style.transform = `translate3d(0,${((1 - p) * 14).toFixed(1)}px,0) scale(${(0.94 + p * 0.06).toFixed(3)})`;
        }
        if (x.cta) { const p = easeOut(clamp((t - 0.5) / 0.3)); x.cta.style.opacity = String(p); x.cta.style.transform = `translateY(${((1 - p) * 20).toFixed(1)}px)`; x.cta.style.pointerEvents = p > 0.6 ? "auto" : "none"; }
      });
      if (ring.current) ring.current.style.transform = `translate(-50%,-50%) rotateX(${(62 - cur * 62).toFixed(2)}deg) rotateZ(${(cur * 200).toFixed(2)}deg) scale(${(0.85 + cur * 0.3).toFixed(4)})`;
      if (bar.current) bar.current.style.transform = `scaleX(${cur.toFixed(4)})`;
      if (cur !== target) raf = requestAnimationFrame(paint); else running = false;
    };
    const kick = () => { measure(); if (!running) { running = true; raf = requestAnimationFrame(paint); } };
    const relayout = () => { layout(); kick(); };
    relayout();
    const settle = window.setTimeout(relayout, 600);   // after fonts and images settle
    const ro = new ResizeObserver(relayout); ro.observe(document.body);
    window.addEventListener("scroll", kick, { passive: true });
    window.addEventListener("resize", relayout);
    return () => { window.removeEventListener("scroll", kick); window.removeEventListener("resize", relayout); ro.disconnect(); clearTimeout(settle); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section ref={wrap} className="ss" aria-label="Our story">
      <div className="ss-sticky">
        <div className="ss-ring" ref={ring} aria-hidden="true" />
        <div className="ss-vignette" aria-hidden="true" />
        {BEATS.map((b, k) => (
          <div key={k} className="ss-beat" ref={n => { beatEls.current[k] = n; }}>
            <span className="ss-dev" lang="hi">{b.dev}</span>
            <p className="ss-text">{b.text.split(" ").map((w, i) => <Fragment key={i}><span className="ss-word">{w}</span>{" "}</Fragment>)}</p>
            {k === BEATS.length - 1 && <Link className="ss-cta cine-btn" href="/enquire">Start your enquiry <ArrowRight size={17} /></Link>}
          </div>
        ))}
        <div className="ss-progress" aria-hidden="true"><span ref={bar} /></div>
        <div className="ss-hint" aria-hidden="true">Keep scrolling</div>
      </div>
    </section>
  );
}
