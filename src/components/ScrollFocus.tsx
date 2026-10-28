"use client";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

// Text is blurred and faint while it sits low on the screen, and pulls into sharp focus as it rises.
// Scroll back down and it softens again. Driven by position, so it follows your scroll.
//
// Performance: positions are measured once (and again on resize / content changes), never during scrolling;
// each frame only touches the few elements near the bottom of the screen, and only when their value changes.
const SELECTOR = [
  "main h1", "main h2", "main h3", "main p", "main .eyebrow",
  "main .how-steps > li", "main .ritual-card", "main .promise-grid > div", "main .facts", "main .detail-notice",
].join(",");
const SKIP = ".cine, .ss, .marquee, .stats, form, .detail-sidebar, .search-card, .enquire-card, .lb, .mobile-book-bar, .gal, .property-card, .show-tile";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const ease = (t: number) => 1 - Math.pow(1 - t, 2.6);
type Item = { el: HTMLElement; top: number; h: number; v: number };

export default function ScrollFocus() {
  const pathname = usePathname();
  useEffect(() => {
    let items: Item[] = [];
    const set = (it: Item, v: number) => {
      if (v === it.v) return;
      it.v = v;
      it.el.style.setProperty("--sf", String(v));
      it.el.dataset.sf = v >= 1 ? "1" : v <= 0 ? "0" : "";
    };
    const scan = () => {
      const all = Array.from(document.querySelectorAll<HTMLElement>(SELECTOR));
      // skip excluded areas, and children of an element we already treat (avoids double blur)
      const els = all.filter(el => !el.closest(SKIP) && !el.parentElement?.closest(SELECTOR));
      const old = new Map(items.map(i => [i.el, i.v]));
      items = els.map(el => { el.classList.add("sf"); return { el, top: 0, h: 0, v: old.get(el) ?? -1 }; });
      measure();
    };
    const measure = () => {
      const y = window.scrollY;
      for (const it of items) {
        const r = it.el.getBoundingClientRect();
        // remove the element's own (scroll-focus) lift so the stored position is its resting position
        const lift = it.v >= 0 && it.v < 1 ? (1 - it.v) * 26 : 0;
        it.top = r.top + y - lift; it.h = r.height;
      }
    };
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight, y = window.scrollY;
      for (const it of items) {
        const top = it.top - y;
        // below the screen = blurred and waiting, above it = sharp, so nothing flashes as it enters
        if (top > vh + 60) { set(it, 0); continue; }
        if (top + it.h < -60) { set(it, 1); continue; }
        // fully blurred at the bottom edge, completely sharp once it is above ~62% of the screen height
        const t = ease(clamp((vh * 0.98 - top) / (vh * 0.36)));
        set(it, t > 0.985 ? 1 : Math.round(t * 50) / 50);   // 2% steps: far fewer style changes, no visible difference
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    const relayout = () => { measure(); onScroll(); };
    scan(); update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", relayout);
    // page height changes (images, fonts, accordions) shift positions: re-measure, debounced
    let deb = 0;
    const later = (fn: () => void) => { clearTimeout(deb); deb = window.setTimeout(() => { fn(); onScroll(); }, 150); };
    const ro = new ResizeObserver(() => later(measure)); ro.observe(document.body);
    // pages that fill in after load (forms, lists) are picked up too
    const mo = new MutationObserver(() => later(scan));
    const main = document.querySelector("main");
    if (main) mo.observe(main, { childList: true, subtree: true });

    // the ritual marquee only animates while it can be seen
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle("is-off", !e.isIntersecting)));
    document.querySelectorAll(".marquee").forEach(m => io.observe(m));

    return () => {
      window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", relayout);
      cancelAnimationFrame(raf); clearTimeout(deb); ro.disconnect(); mo.disconnect(); io.disconnect();
      items.forEach(({ el }) => { el.classList.remove("sf"); el.style.removeProperty("--sf"); delete el.dataset.sf; });
    };
  }, [pathname]);
  return null;
}
