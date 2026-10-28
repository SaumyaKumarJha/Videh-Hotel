"use client";
import { Suspense, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, MapPin, CalendarDays, Users, X, Sparkles } from "lucide-react";
import Link from "next/link";
import PropertyCard from "@/components/PropertyCard";
import { capacityRange } from "@/lib/data";
import type { Property } from "@/lib/data";

type Props = { items: Property[]; title: string; eyebrow: string; intro: string };

function Listing({ items, title, eyebrow, intro }: Props) {
  const sp = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [query, setQuery] = useState(sp.get("q") || "");
  const [city, setCity] = useState("All locations");
  const [sort, setSort] = useState("recommended");
  const [maxPrice, setMaxPrice] = useState("all");
  const date = sp.get("date") || "";
  const guests = sp.get("guests") || "";
  const fn = sp.get("function") || "";
  const carry = new URLSearchParams();
  if (date) carry.set("date", date);
  if (guests) carry.set("guests", guests);
  if (fn) carry.set("function", fn);
  const prettyDate = date ? new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";
  const cities = ["All locations", ...Array.from(new Set(items.map(item => item.city)))];
  const filtered = useMemo(() => {
    let list = items.filter(item => `${item.name} ${item.city} ${item.area} ${item.description}`.toLowerCase().includes(query.toLowerCase()));
    if (city !== "All locations") list = list.filter(item => item.city === city);
    if (maxPrice !== "all") list = list.filter(item => item.price <= Number(maxPrice));
    if (fn) list = list.filter(item => !item.functions || item.functions.includes(fn));
    if (guests) list = list.filter(item => { const r = capacityRange(item.capacity); return !r || r.max >= Number(guests); });
    if (sort === "price-low") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-high") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    return list;
  }, [items, query, city, sort, maxPrice, fn, guests]);
  const isHalls = items.some(i => i.category === "banquet");
  const enquireHref = `/enquire?${new URLSearchParams({ ...(guests ? { guests } : {}), ...(fn ? { ceremony: fn } : {}) })}`;
  return <div className="listing-page">
    <section className="listing-heading container"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{intro}</p></section>
    <section className="container listing-content">
      {(date || guests || fn) && <div className="search-context">
        {fn && <span><Sparkles size={15} /> {fn}</span>}
        {date && <span><CalendarDays size={15} /> {prettyDate}</span>}
        {guests && <span><Users size={15} /> {isHalls ? `Fits ${Number(guests).toLocaleString("en-IN")}+ guests` : `${guests} guests`}</span>}
        <button onClick={() => router.replace(pathname)}><X size={14} /> Clear</button>
      </div>}
      <div className="listing-toolbar">
        <label className="listing-search"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by name, city or area" aria-label="Search places" /></label>
        <label className="filter-select"><MapPin size={16} /><select value={city} onChange={e => setCity(e.target.value)} aria-label="Filter by location">{cities.map(c => <option key={c}>{c}</option>)}</select></label>
        <label className="filter-select"><SlidersHorizontal size={16} /><select value={maxPrice} onChange={e => setMaxPrice(e.target.value)} aria-label="Filter by budget"><option value="all">Any budget</option>{isHalls ? <><option value="60000">Under ₹60,000</option><option value="80000">Under ₹80,000</option><option value="120000">Under ₹1,20,000</option></> : <><option value="1000">Under ₹1,000</option><option value="3000">Under ₹3,000</option><option value="5000">Under ₹5,000</option></>}</select></label>
        <select className="sort-select" value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort results"><option value="recommended">Recommended</option><option value="rating">Top rated</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select>
      </div>
      <div className="results-line" aria-live="polite"><span>{filtered.length} {isHalls ? (filtered.length === 1 ? "marriage hall" : "marriage halls") : filtered.length === 1 ? "place" : "places"} found</span><span>{isHalls ? "Shortlist, compare, then send an enquiry" : "Compare, then send an enquiry"}</span></div>
      {filtered.length ? <div className="property-grid">{filtered.map(item => <PropertyCard key={item.id} property={item} query={carry.toString()} />)}</div> : <div className="empty-state"><span className="empty-icon">✳</span><h3>{isHalls ? "No halls match yet" : "No places found"}</h3><p>Try clearing a filter — or send us an enquiry and we’ll find halls that fit.</p><Link className="button button-outline" href={enquireHref}>Send an enquiry</Link><button className="button button-dark" onClick={() => { setQuery(""); setCity("All locations"); setMaxPrice("all"); setSort("recommended"); router.replace(pathname); }}>Clear filters</button></div>}
      {isHalls && filtered.length > 0 && <div className="listing-enquire"><div><strong>Can’t decide, or don’t see your date?</strong><span>Send one enquiry — we check availability across halls and call you back.</span></div><Link className="button button-dark" href={enquireHref}>Enquire now</Link></div>}
    </section>
  </div>;
}

export default function PropertyListing(props: Props) {
  return <Suspense fallback={<div className="listing-page" style={{ minHeight: "60vh" }} />}><Listing {...props} /></Suspense>;
}
