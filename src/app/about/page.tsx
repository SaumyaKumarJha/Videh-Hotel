import { pageMeta } from "@/lib/site";
import Link from "next/link";
import { ArrowRight, Sparkles, HeartHandshake, ShieldCheck } from "lucide-react";
import InfoPage from "@/components/InfoPage";
import BusinessDetails from "@/components/BusinessDetails";

export const metadata = pageMeta({
  title: "About Our Wedding Venue in Madhubani",
  description: "Hotel Videh & Marriage Hall is a family wedding venue and hotel on Ranti Road, Madhubani, made for every Mithila ceremony from tilak to chaturthi.",
  path: "/about",
});

export default function AboutPage() {
  return <InfoPage eyebrow="About us" title="A home for every Mithila wedding." intro="Hotel Videh & Marriage Hall is a wedding venue and hotel on Ranti Road, Madhubani.">
    <div className="info-split">
      <div className="info-prose">
        <h2>Our story</h2>
        <p>Mithila has a long tradition of welcoming guests as family. Weddings here are many ceremonies over many days — tilak, haldi and matkor, vivah, reception and chaturthi — and each one deserves a place that feels right.</p>
        <p>That is what we are here for: a venue where the whole family can come together, and a team that treats your celebration as its own.</p>
        <h2>Planning your wedding</h2>
        <p>Tell us your lagan date, guests and ceremonies through the <Link href="/enquire">enquiry form</Link>. We confirm that the date is free and call you back. You are always welcome to <Link href="/hall">see the hall</Link> and visit us before you decide.</p>
        <p><Link href="/enquire" className="text-link">Enquire for your date <ArrowRight size={16} /></Link></p>
      </div>
      <div className="info-cards">
        <div><span className="promise-icon"><Sparkles /></span><h3>Every ceremony</h3><p>From tilak to chaturthi, under one roof.</p></div>
        <div><span className="promise-icon"><HeartHandshake /></span><h3>Local at heart</h3><p>We celebrate the people, flavours and traditions of Mithila.</p></div>
        <div><span className="promise-icon"><ShieldCheck /></span><h3>Clear at every step</h3><p>Dates and prices explained on a call, so there are no surprises.</p></div>
      </div>
    </div>
    <BusinessDetails className="business-wide" />
  </InfoPage>;
}
