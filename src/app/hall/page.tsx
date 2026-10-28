import { JsonLd, breadcrumbs, pageMeta, venueSchema } from "@/lib/site";
import Link from "next/link";
import { MapPin, Check, Clock, ShieldCheck, Users, Wallet, CalendarHeart, Navigation } from "lucide-react";
import { HALL, money, guestBucket } from "@/lib/data";
import { BUSINESS as B } from "@/lib/business";
import EnquiryForm from "@/components/EnquiryForm";
import Gallery from "@/components/Gallery";

export const metadata = pageMeta({
  title: "Wedding Hall in Madhubani – Photos & Details",
  description: "Marriage hall and hotel on Ranti Road, Madhubani, Bihar: photos, ceremonies we host, how to reach us and a quick enquiry form for your lagan date.",
  path: "/hall",
});

const query = `${B.tradeName}, ${B.addressOneLine}`;
const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export default function HallPage({ searchParams }: { searchParams: { guests?: string; function?: string; date?: string } }) {
  const gallery = HALL.gallery && HALL.gallery.length ? HALL.gallery : [HALL.image];
  const hasPrice = HALL.price > 0;
  return <div className="detail-page">
    <JsonLd data={[venueSchema({ amenityFeature: HALL.amenities.map(a => ({ "@type": "LocationFeatureSpecification", name: a, value: true })) }), breadcrumbs([["The hall", "/hall"]])]} />
    <div className="container detail-layout">
      <div className="detail-main">
        <Gallery images={gallery} alt={HALL.name} />
        <div className="detail-title-row"><div><div className="eyebrow">Wedding venue &amp; hotel in {HALL.city}</div><h1>{HALL.name}</h1><p className="property-location"><MapPin size={15} />{B.addressOneLine}</p></div></div>
        <div className="facts">
          {HALL.capacity && <div><Users size={20} /><span><small>Capacity</small><b>{HALL.capacity}</b></span></div>}
          <div><Wallet size={20} /><span><small>Starting at</small><b>{hasPrice ? money(HALL.price) : "Ask us for a quote"}</b></span></div>
          {HALL.functions && <div><CalendarHeart size={20} /><span><small>Ceremonies</small><b>{HALL.functions.length} to choose from</b></span></div>}
          <div><MapPin size={20} /><span><small>Find us</small><b>Ranti Road, {HALL.city}</b></span></div>
        </div>
        <div className="detail-section"><h2>A place for your shubh vivah.</h2><p>{HALL.description}</p><p>Like what you see? Send an enquiry with your lagan date and guest count — we’ll confirm that the date is free and call you back with the details.</p></div>
        {HALL.functions && <div className="detail-section wedding-fit"><h3>Ceremonies we host</h3><div className="ritual-chips">{HALL.functions.map(f => <Link key={f} href={`/enquire?ceremony=${encodeURIComponent(f)}`}><span>{f}</span></Link>)}</div></div>}
        <div className="detail-section"><h3>What you can expect</h3><div className="amenities-grid">{HALL.amenities.map(a => <span key={a}><Check size={16} />{a}</span>)}</div></div>
        <div className="detail-section"><h3>Where you’ll be</h3><p>{B.addressOneLine}</p><div className="map-wrap"><iframe title={`Map of ${B.tradeName}`} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div><p style={{ marginTop: 14 }}><a className="text-link" href={directions} target="_blank" rel="noopener noreferrer"><Navigation size={15} /> Get directions</a></p></div>
        <div className="detail-notice"><ShieldCheck size={20} /><div><strong>Plan with clarity</strong><p>Availability and the final price are confirmed with you on a call after your enquiry. Nothing is booked or paid on this site. See <Link href="/policies">how enquiries work</Link>.</p></div></div>
      </div>
      <aside className="detail-sidebar" id="enquire">
        <div className="sidebar-price"><span>{hasPrice ? "Starting package" : "Pricing"}</span><strong>{hasPrice ? money(HALL.price) : "On request"}</strong><small>Final price depends on date, guests and menu</small></div>
        <EnquiryForm venue={HALL} source="hall-page" title="Enquire about the hall" initial={{ guests: guestBucket(searchParams.guests), ceremony: searchParams.function, date: searchParams.date }} />
        <div className="sidebar-help"><Clock size={17} /><span>Prefer to write? <Link href="/contact">Contact us</Link></span></div>
      </aside>
    </div>
    <div className="mobile-book-bar"><span><strong>{hasPrice ? money(HALL.price) : "Price on request"}</strong></span><a className="button button-dark" href="#enquire">Enquire now</a></div>
  </div>;
}
