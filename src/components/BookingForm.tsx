"use client";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, Users, CheckCircle2, Sparkles } from "lucide-react";
import type { Property } from "@/lib/data";
import { money } from "@/lib/data";

export default function BookingForm({ property }: { property: Property }) {
  const router = useRouter();
  const sp = useSearchParams();
  const guestOptions = ["1","2","3","4","5","6","8","10","15","20","30","50","100","150","200","300","400","500","600","800","1000"];
  const qGuests = sp.get("guests") || "";
  const [date, setDate] = useState(sp.get("date") || "");
  const [endDate, setEndDate] = useState("");
  const [guests, setGuests] = useState(guestOptions.includes(qGuests) ? qGuests : "2");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const fnOptions = property.functions?.length ? property.functions : ["Vivah", "Tilak", "Haldi & Matkor", "Reception"];
  const qFn = sp.get("function") || "";
  const [ceremony, setCeremony] = useState(fnOptions.includes(qFn) ? qFn : fnOptions[0]);
  const [submitted, setSubmitted] = useState(false);
  const nights = useMemo(() => {
    if (!date || !endDate) return 1;
    const diff = Math.ceil((new Date(endDate).getTime() - new Date(date).getTime()) / 86400000);
    return Math.max(1, diff);
  }, [date, endDate]);
  const total = property.category === "hotel" ? property.price * nights : property.price;
  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!date) return;
    const record = { bookingId: `VDH${Date.now().toString().slice(-7)}`, property: property.name, propertyId: property.id, category: property.category, date, endDate, guests, ceremony: property.category === "banquet" ? ceremony : undefined, name, email, phone, total, status: "Request received" };
    try {
      const old = JSON.parse(localStorage.getItem("videhBookings") || "[]");
      localStorage.setItem("videhBookings", JSON.stringify([record, ...old]));
    } catch {}
    setSubmitted(true);
  }
  if (submitted) return <div className="confirmation-panel"><CheckCircle2 size={42}/><div className="eyebrow">Request received</div><h2>Thank you, {name.split(" ")[0]}.</h2><p>Your demo booking request for <strong>{property.name}</strong> has been saved in this browser. No payment has been taken and the property has not yet confirmed availability.</p><div className="confirmation-total"><span>Estimated total</span><strong>{money(total)}</strong></div><button className="button button-dark button-full" onClick={() => router.push("/my-bookings")}>View my bookings</button></div>;
  return <form className="booking-form" onSubmit={submit}>
    <div className="booking-price"><div><strong>{money(property.price)}</strong><span> {property.category === "hotel" ? "/ night" : property.category === "restaurant" ? " / approx. for two" : " / starting package"}</span></div><span className="rating">★ {property.rating}</span></div>
    <div className="booking-fields">
      <label><span><CalendarDays size={15}/> {property.category === "banquet" ? "Lagan / event date" : property.category === "hotel" ? "Check-in" : "Date"}</span><input required type="date" min={new Date().toISOString().slice(0,10)} value={date} onChange={e => setDate(e.target.value)}/></label>
      {property.category === "hotel" && <label><span><CalendarDays size={15}/> Check-out</span><input required type="date" min={date || new Date().toISOString().slice(0,10)} value={endDate} onChange={e => setEndDate(e.target.value)}/></label>}
      <label><span><Users size={15}/> {property.category === "banquet" ? "Expected guests" : "Guests"}</span><select value={guests} onChange={e => setGuests(e.target.value)}>{guestOptions.map(n => <option key={n} value={n}>{n} {property.category === "banquet" ? "guests" : Number(n) === 1 ? "guest" : "guests"}</option>)}</select></label>
      {property.category === "banquet" && <label><span><Sparkles size={15}/> Ceremony</span><select value={ceremony} onChange={e => setCeremony(e.target.value)}>{fnOptions.map(f => <option key={f}>{f}</option>)}</select></label>}
    </div>
    <div className="booking-contact"><h4>Your details</h4><label>Full name<input required value={name} onChange={e => setName(e.target.value)} placeholder="Enter your name"/></label><label>Email address<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Phone number<input required type="tel" pattern="[0-9+() -]{8,18}" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"/></label></div>
    <div className="price-breakdown"><div><span>{property.category === "hotel" ? `${money(property.price)} × ${nights} night(s)` : "Estimated package"}</span><strong>{money(total)}</strong></div><div><span>Taxes and final charges</span><span>Confirmed by property</span></div></div>
    <button type="submit" className="button button-dark button-full">{property.category === "banquet" ? "Request this venue" : "Request booking"} <span>→</span></button>
    <p className="booking-note">Demo flow only. Your request is saved locally; live availability and payment are not connected.</p>
  </form>;
}
