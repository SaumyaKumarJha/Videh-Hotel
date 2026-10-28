"use client";
import { useEffect } from "react";

// Cards lean toward the pointer in 3D and catch a moving highlight (glare). Mouse/trackpad only.
const TARGET = ".cine-card, .show-tile, .property-card, .ritual-card";

export default function TiltEffect() {
  useEffect(() => {
    if (!window.matchMedia("(hover:hover) and (pointer:fine)").matches) return;
    let current: HTMLElement | null = null;
    const reset = (el: HTMLElement | null) => {
      if (!el) return;
      el.classList.remove("is-tilting");
      el.style.removeProperty("--rx"); el.style.removeProperty("--ry"); el.style.removeProperty("--gx"); el.style.removeProperty("--gy");
    };
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(TARGET) as HTMLElement | null;
      if (el !== current) { reset(current); current = el; }
      if (!el) return;
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      el.classList.add("is-tilting");
      el.style.setProperty("--ry", ((px - 0.5) * 14).toFixed(2) + "deg");
      el.style.setProperty("--rx", ((0.5 - py) * 10).toFixed(2) + "deg");
      el.style.setProperty("--gx", (px * 100).toFixed(1) + "%");
      el.style.setProperty("--gy", (py * 100).toFixed(1) + "%");
    };
    const onLeave = () => { reset(current); current = null; };
    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    return () => { document.removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeave); window.removeEventListener("blur", onLeave); reset(current); };
  }, []);
  return null;
}
