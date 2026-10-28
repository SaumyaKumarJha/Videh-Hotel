import { MapPin, Mail, Navigation } from "lucide-react";
import Link from "next/link";
import { BUSINESS as B } from "@/lib/business";
import Reveal from "./Reveal";

const query = `${B.tradeName}, ${B.addressOneLine}`;
const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

/** Where to find the hall: address, map, directions. */
export default function VisitUs() {
  return <section className="visit container" id="visit">
    <Reveal className="visit-grid">
      <div className="visit-copy">
        <div className="eyebrow">Visit us</div>
        <h2>Come and see the hall <em>before you decide.</em></h2>
        <p>Walk through the hall, see the space and talk to us about your ceremonies. Tell us when you are coming and we will be there.</p>
        <ul className="visit-list">
          <li><MapPin size={20} /><span>{B.addressOneLine}</span></li>
          <li><Mail size={20} /><a href={`mailto:${B.email}`}>{B.email}</a></li>
        </ul>
        <div className="visit-actions">
          <a className="button button-dark" href={directions} target="_blank" rel="noopener noreferrer"><Navigation size={17} /> Get directions</a>
          <Link className="button button-outline" href="/enquire">Enquire for your date</Link>
        </div>
      </div>
      <div className="visit-map"><iframe title={`Map of ${B.tradeName}`} src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div>
    </Reveal>
  </section>;
}
