"use client";
import Link from "next/link";
import { Heart, MapPin, Star, ArrowUpRight, Users, Sparkles } from "lucide-react";
import type { Property } from "@/lib/data";
import { money, categoryLabel } from "@/lib/data";
import { useSaved } from "@/lib/saved";

export default function PropertyCard({ property, query }: { property: Property; query?: string }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(property.id);
  const href = `/${property.category === "hotel" ? "hotels" : property.category === "restaurant" ? "restaurants" : "banquets"}/${property.id}${query ? `?${query}` : ""}`;
  return <article className="property-card">
    <div className="property-image-wrap">
      <Link href={href} className="property-image-link" aria-label={`View ${property.name}`}><img className="property-image" src={property.image} alt={property.name} loading="lazy" /></Link>
      {property.tag && <span className="property-tag">{property.tag}</span>}
      <button className={`save-button ${saved ? "is-saved" : ""}`} onClick={() => toggle(property.id)} aria-label={saved ? "Remove from saved" : "Save property"} aria-pressed={saved}><Heart size={17} fill={saved ? "currentColor" : "none"} /></button>
      <span className="image-category">{categoryLabel(property.category)}</span>
      <Link href={href} className="quick-view" tabIndex={-1} aria-hidden="true">{property.category === "banquet" ? "View hall & enquire" : "View details"}</Link>
    </div>
    <div className="property-info">
      <div className="property-title-row"><Link href={href} className="property-name">{property.name}</Link><span className="rating"><Star size={14} fill="currentColor" />{property.rating}</span></div>
      <p className="property-location"><MapPin size={14} />{property.area}, {property.city}</p>
      {property.capacity ? <p className="property-wedding"><Users size={14} />{property.capacity}{property.functions ? <span> · {property.functions.slice(0, 3).join(" · ")}</span> : null}</p> : property.weddingNote ? <p className="property-wedding"><Sparkles size={14} />{property.weddingNote}</p> : null}
      <div className="property-card-bottom"><span><strong>{money(property.price)}</strong><small> / {property.category === "hotel" ? "night" : property.category === "restaurant" ? "for two approx." : "starting package"}</small></span><Link href={href} className="card-arrow" aria-label={`Explore ${property.name}`}><ArrowUpRight size={17} /></Link></div>
    </div>
  </article>;
}
