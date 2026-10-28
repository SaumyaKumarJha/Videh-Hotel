import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import { HALL } from "@/lib/data";
import Reveal from "./Reveal";
import Gallery from "./Gallery";

/** The one venue: a photo mosaic with the details beside it. */
export default function HallShowcase() {
  const images = HALL.gallery && HALL.gallery.length ? HALL.gallery : [HALL.image];
  return <section className="show container" id="the-hall">
    <Reveal className="show-head">
      <div><div className="eyebrow">The venue</div><h2>{HALL.name}<em>.</em></h2></div>
      <Link className="text-link" href="/hall">See the hall in full <ArrowUpRight size={16} /></Link>
    </Reveal>
    <Reveal>
      <Gallery images={images} alt={HALL.name} />
    </Reveal>
    <Reveal className="show-details">
      <p className="show-lead">{HALL.description}</p>
      <div className="show-meta">
        <span><MapPin size={16} /> {HALL.area}, {HALL.city}</span>
        {HALL.functions && <span>{HALL.functions.length} ceremonies hosted</span>}
      </div>
      <div className="ritual-chips">{HALL.functions?.map(f => <span key={f}>{f}</span>)}</div>
      <div className="show-actions">
        <Link className="button button-dark" href="/enquire">Enquire for your date</Link>
        <Link className="button button-outline" href="/hall">View the hall</Link>
      </div>
    </Reveal>
  </section>;
}
