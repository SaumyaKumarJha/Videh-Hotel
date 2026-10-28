"use client";

import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake, ClipboardList, PhoneCall, Landmark, Handshake } from "lucide-react";
import CinemaHero from "@/components/CinemaHero";
import Marquee from "@/components/Marquee";
import ScrollStory from "@/components/ScrollStory";
import HallShowcase from "@/components/HallShowcase";
import VisitUs from "@/components/VisitUs";
import Reveal from "@/components/Reveal";
import WeddingRituals from "@/components/WeddingRituals";
import EnquiryForm from "@/components/EnquiryForm";
import { HALL } from "@/lib/data";

const steps = [
  { icon: ClipboardList, title: "Share your details", text: "Lagan date, guest count, ceremonies and budget — one short form." },
  { icon: PhoneCall, title: "We call you back", text: "Within one working day, to understand exactly what you need." },
  { icon: Landmark, title: "Visit the hall", text: "Come and see the space, and talk through your ceremonies with us." },
  { icon: Handshake, title: "Finalise with us", text: "Confirm your date and the arrangements directly with the hall." },
];

export default function HomePage() {
  return <>
    <CinemaHero />

    <ScrollStory />

    <HallShowcase />

    <Marquee />
    <WeddingRituals />

    <section className="how-section container" id="how">
      <Reveal className="section-heading"><div><div className="eyebrow">How it works</div><h2>One enquiry. <em>One call back.</em></h2></div><p>No running around for dates and prices.<br />Tell us once — we do the checking.</p></Reveal>
      <ol className="how-steps">{steps.map((s, n) => <li key={s.title} style={{ transitionDelay: `${n * 90}ms` }}><span className="how-num">{n + 1}</span><span className="how-icon"><s.icon /></span><h3>{s.title}</h3><p>{s.text}</p></li>)}</ol>
      <div className="how-cta"><Link className="button button-dark" href="/enquire">Start my enquiry <ArrowRight size={17} /></Link></div>
    </section>

    <section className="home-enquiry" id="enquire-form">
      <div className="container home-enquiry-grid">
        <div className="home-enquiry-copy">
          <div className="eyebrow">शुभ विवाह · Enquire now</div>
          <h2>Tell us the date. <em>We’ll confirm the hall.</em></h2>
          <p>Share a few details and our team will call you to confirm that {HALL.name} is free on your lagan date and talk through your ceremonies.</p>
          <ul className="enquiry-points">
            <li><PhoneCall size={18} /> A call back within one working day</li>
            <li><Landmark size={18} /> Your date checked before anything else</li>
            <li><ShieldCheck size={18} /> No payment and no booking — just an enquiry</li>
          </ul>
          <img className="home-enquiry-art" src="/kohbar.svg" alt="" loading="lazy" />
        </div>
        <div className="enquire-card"><EnquiryForm source="home" venue={HALL} title="Enquire for your date" /></div>
      </div>
    </section>

    <VisitUs />

    <section className="promise-section container"><div className="eyebrow">Why families choose us</div><h2>Less running around. <em>More celebrating.</em></h2><div className="promise-grid"><div><span className="promise-icon"><Sparkles /></span><h3>Every ceremony, one venue</h3><p>Tilak, haldi &amp; matkor, vivah, reception and chaturthi — not just the main night.</p></div><div><span className="promise-icon"><HeartHandshake /></span><h3>Rooted in Mithila</h3><p>A place that understands Maithil customs, from the mandap to the bhoj.</p></div><div><span className="promise-icon"><ShieldCheck /></span><h3>Clear before you commit</h3><p>Dates, prices and arrangements explained on a call, before you decide.</p></div></div></section>

    <section className="closing-cta"><div className="container closing-inner"><div><div className="eyebrow">Your lagan is coming</div><h2>Good dates book out early.{" "}<br /><em>Enquire for yours today.</em></h2></div><div className="closing-actions"><Link className="button button-dark" href="/enquire">Enquire for your date <ArrowRight size={17} /></Link><Link className="button button-outline" href="/hall">See the hall</Link></div></div></section>
  </>;
}
