import { pageMeta } from "@/lib/site";
import Link from "next/link";
import { ClipboardList, PhoneCall, Landmark, ShieldCheck } from "lucide-react";
import EnquiryForm from "@/components/EnquiryForm";
import { HALL } from "@/lib/data";

export const metadata = pageMeta({
  title: "Check Your Wedding Date – Enquire Free",
  description: "Tell us your lagan date, guest count and ceremonies. Hotel Videh & Marriage Hall, Madhubani, checks the date and calls you back within one working day.",
  path: "/enquire",
});

export default function EnquirePage({ searchParams }: { searchParams: { guests?: string; ceremony?: string; venue?: string; city?: string } }) {
  const venue = HALL;
  return <div className="enquire-page">
    <section className="listing-heading container"><div className="eyebrow">शुभ विवाह · Enquiry</div><h1>Tell us about the wedding. <em>We’ll confirm the hall.</em></h1><p>One short form. We check which marriage halls are free on your lagan date, fit your guests and your budget — then call you with options.</p></section>
    <section className="container enquire-layout">
      <div className="enquire-card"><EnquiryForm source="enquire-page" venue={venue} initial={{ guests: searchParams.guests, ceremony: searchParams.ceremony, city: searchParams.city }} /></div>
      <aside className="enquire-side">
        <h2>What happens next</h2>
        <ol className="how-mini">
          <li><ClipboardList size={20} /><span><strong>You send the details</strong>Date, guests, ceremonies and budget.</span></li>
          <li><PhoneCall size={20} /><span><strong>We call you back</strong>Within one working day, to understand what you need.</span></li>
          <li><Landmark size={20} /><span><strong>We confirm your date</strong>We check that the hall is free and share the details.</span></li>
          <li><ShieldCheck size={20} /><span><strong>You visit and decide</strong>See the hall, then finalise with us.</span></li>
        </ol>
        <p className="enquire-alt">Want to see it first? <Link href="/hall">Look around the hall</Link>.</p>
      </aside>
    </section>
  </div>;
}
