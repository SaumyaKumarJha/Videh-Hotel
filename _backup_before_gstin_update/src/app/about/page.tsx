import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Sparkles, HeartHandshake, ShieldCheck } from "lucide-react";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "About Videh", description: "Videh helps families in Mithila find the right marriage hall for every wedding ceremony." };

export default function AboutPage() {
  return <InfoPage eyebrow="About Videh" title="Every Mithila wedding deserves the right hall." intro="Videh helps families find marriage halls for every ceremony, with the warmth the region is known for.">
    <div className="info-split">
      <div className="info-prose">
        <h2>Why we built Videh</h2>
        <p>Mithila has a long tradition of welcoming guests as family. Weddings here are many ceremonies over many days — yet finding a hall that is free on your lagan date usually means calling hall after hall.</p>
        <p>Videh brings marriage halls from across Madhubani district — Madhubani town, Jhanjharpur, Jaynagar, Benipatti and nearby villages — into one place, with capacity and starting prices up front — and one enquiry form that does the calling for you.</p>
        <h2>What you can do here</h2>
        <p>Browse halls by city, guests and ceremony, shortlist the ones you like, and <Link href="/enquire">send an enquiry</Link>. We call you back with halls that are free on your date, and you finalise directly with the hall.</p>
        <p><Link href="/contact?topic=list" className="text-link">Own a marriage hall? List it on Videh <ArrowRight size={16} /></Link></p>
      </div>
      <div className="info-cards">
        <div><span className="promise-icon"><Sparkles /></span><h3>Picked with care</h3><p>Halls chosen for space, upkeep and how well they host a Maithil wedding.</p></div>
        <div><span className="promise-icon"><HeartHandshake /></span><h3>Local at heart</h3><p>We celebrate the people, flavours and traditions of Mithila.</p></div>
        <div><span className="promise-icon"><ShieldCheck /></span><h3>Clear at every step</h3><p>Prices and policies are shown up front, so there are no surprises.</p></div>
      </div>
    </div>
  </InfoPage>;
}
