"use client";
import Link from "next/link";
import { Fragment, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { HALL } from "@/lib/data";
import MithilaScene from "@/components/MithilaScene";

const IMGS = HALL.gallery && HALL.gallery.length ? HALL.gallery : [HALL.image];
const CARDS = [
  { href: "/hall", label: "The hall", sub: "Photos and details", img: IMGS[0] },
  { href: "/#rituals", label: "Every ceremony", sub: "Tilak to chaturthi", img: IMGS[1] || IMGS[0] },
  { href: "/#visit", label: "Visit us", sub: "Ranti Road, Madhubani", img: IMGS[2] || IMGS[0] },
];
const LINES = [["A", "wedding", "hall"], ["that", "feels", "like", "home"]];

export default function CinemaHero() {
  const root = useRef<HTMLElement | null>(null);

  // Slow parallax: the painting drifts more slowly than the page, the copy fades as you scroll away.
  // Written straight onto the two moving elements (not as CSS variables on the whole hero, which made the
  // browser re-style every element inside the hero on every scroll frame).
  useEffect(() => {
    const el = root.current; if (!el) return;
    const art = Array.from(el.querySelectorAll<HTMLElement>(".ms, .cine-bg"));
    const copy = el.querySelector<HTMLElement>(".cine-copy");
    let raf = 0, last = -1;
    const apply = () => {
      raf = 0;
      const y = Math.min(window.scrollY, window.innerHeight);
      if (y === last) return;      // already past the hero: nothing to do
      last = y;
      const t = `translate3d(0,${(y * 0.18).toFixed(1)}px,0)`;
      art.forEach(a => { a.style.transform = a.classList.contains("cine-bg") ? `${t} scale(1.02)` : t; });
      if (copy) copy.style.opacity = Math.max(0, 1 - y / (window.innerHeight * 0.65)).toFixed(3);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply); };
    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // 3D: the painting tilts with the pointer (or sways gently on its own, e.g. on phones).
  // Only the stage element is moved, at most 30 times a second, and nothing runs while the hero is off screen.
  useEffect(() => {
    const el = root.current; if (!el) return;
    const stage = el.querySelector<HTMLElement>(".ms-stage"); if (!stage) return;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const lite = (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) || (navigator.hardwareConcurrency || 8) <= 4;
    if (lite) el.classList.add("is-lite");
    let tx = 0, ty = 0, cx = 0, cy = 0, last = 0, raf = 0, prev = 0, visible = true, running = false;
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
      ty = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height - 0.5) * 2));
      last = performance.now();
      start();
    };
    const tick = (t: number) => {
      if (!visible) { running = false; return; }
      raf = requestAnimationFrame(tick);
      if (t - prev < 32) return;   // ~30 fps is plenty for a slow sway
      prev = t;
      const idle = t - last > 2500;
      if (idle && lite) { running = false; cancelAnimationFrame(raf); return; }   // weak phones: no endless sway
      if (idle) { tx = Math.sin(t / 3200) * 0.7; ty = Math.cos(t / 4100) * 0.45; }
      cx += (tx - cx) * 0.1; cy += (ty - cy) * 0.1;
      stage.style.transform = `rotateX(${(-cy * 5).toFixed(2)}deg) rotateY(${(cx * 7).toFixed(2)}deg)`;
    };
    function start() { if (!running && visible) { running = true; raf = requestAnimationFrame(tick); } }
    el.addEventListener("pointermove", onMove);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      el.classList.toggle("is-off", !visible);   // pauses all CSS animations inside the hero
      if (visible) start();
    }, { threshold: 0 });
    io.observe(el);
    start();
    return () => { cancelAnimationFrame(raf); el.removeEventListener("pointermove", onMove); io.disconnect(); };
  }, []);

  let w = 0;
  return (
    <section ref={root} className="cine" aria-label="Welcome">
      <MithilaScene />
      <div className="cine-copy">
        <span className="cine-kicker" lang="hi">शुभ विवाह</span>
        <h1 aria-label="A wedding hall that feels like home">
          {LINES.map((line, li) => <span className="cine-line" key={li} aria-hidden="true">{li > 0 && " "}
            {line.map((word, i) => <Fragment key={word + w}>{i > 0 && " "}<span className="cine-word" style={{ animationDelay: `${0.35 + (w++) * 0.32}s` }}>{word}</span></Fragment>)}
          </span>)}
        </h1>
        <p className="cine-sub">Hotel Videh &amp; Marriage Hall, Ranti Road, Madhubani. Tell us your lagan date once and we will call you back.</p>
        <div className="cine-actions">
          <Link className="cine-btn" href="/enquire">Enquire for your date <ArrowRight size={17} /></Link>
          <Link className="cine-btn cine-btn-ghost" href="/hall">See the hall</Link>
        </div>
        <p className="cine-fine">Free to enquire · No payment · Call-back within one working day</p>
        <div className="cine-scroll" aria-hidden="true"><span>Scroll</span><i /></div>
      </div>
      <div className="cine-cards" aria-label="Featured halls">
        {CARDS.map((c, n) => (
          <Link key={c.label} href={c.href} className={`cine-card cine-card-${n}`}>
            <img src={c.img} alt="" loading="lazy" onError={e => { e.currentTarget.style.display = "none"; }} />
            <span className="cine-card-info"><b>{c.label}</b><small>{c.sub}</small></span>
          </Link>
        ))}
      </div>
    </section>
  );
}
