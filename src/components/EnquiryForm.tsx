"use client";
import { useState } from "react";
import { CheckCircle2, CalendarHeart, Users, Phone, UserRound, ChevronDown, Send, Loader2 } from "lucide-react";
import type { Property } from "@/lib/data";
import { BUSINESS } from "@/lib/business";

export const CEREMONIES = ["Tilak", "Haldi & Matkor", "Vivah", "Reception", "Chaturthi"];
export const GUESTS = ["Under 100", "100–200", "200–300", "300–500", "500–800", "800+"];
export const BUDGETS = ["Under ₹50,000", "₹50,000 – ₹1 lakh", "₹1 – 2 lakh", "₹2 – 5 lakh", "Above ₹5 lakh", "Not sure yet"];
export const CITIES = ["Madhubani town", "Jhanjharpur", "Jaynagar", "Benipatti", "Rajnagar", "Phulparas", "Elsewhere in Madhubani district"];

type Props = {
  venue?: Property;           // set on a hall's page: the enquiry is for this hall
  source: string;             // where the form sits, saved with the lead (e.g. "home", "hall-page", "enquire-page")
  initial?: { guests?: string; ceremony?: string; city?: string; date?: string };
  title?: string;
};

export default function EnquiryForm({ venue, source, initial = {}, title }: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState(initial.date || "");
  const [flexible, setFlexible] = useState(false);
  const [guests, setGuests] = useState(GUESTS.includes(initial.guests || "") ? initial.guests! : "200–300");
  const [city, setCity] = useState(venue?.city || (CITIES.includes(initial.city || "") ? initial.city! : "Madhubani town"));
  const [ceremonies, setCeremonies] = useState<string[]>(initial.ceremony && CEREMONIES.includes(initial.ceremony) ? [initial.ceremony] : ["Vivah"]);
  const [more, setMore] = useState(false);
  const [email, setEmail] = useState("");
  const [budget, setBudget] = useState("Not sure yet");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);   // not pre-ticked: consent must be a clear action by the visitor
  const [trap, setTrap] = useState(""); // honeypot: real people never fill this
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState("");

  const toggle = (c: string) => setCeremonies(list => list.includes(c) ? list.filter(x => x !== c) : [...list, c]);
  const cleanPhone = phone.replace(/[^0-9]/g, "").replace(/^(91|0)(?=\d{10}$)/, "");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (trap) { setState("done"); return; }
    if (name.trim().length < 2) { setError("Please enter your name."); return; }
    if (!/^[6-9]\d{9}$/.test(cleanPhone)) { setError("Please enter a valid 10-digit mobile number."); return; }
    if (!date && !flexible) { setError("Please pick the wedding date, or tick “Date not fixed yet”."); return; }
    setError(""); setState("sending");
    const lead = {
      name: name.trim(), phone: cleanPhone, email: email.trim() || null, city,
      wedding_date: flexible ? null : date || null, date_flexible: flexible,
      guests, ceremonies, budget, message: message.trim() || null,
      venue_id: venue?.id || null, venue_name: venue?.name || null,
      source, page_url: typeof window !== "undefined" ? window.location.href : null,
    };
    let saved = false;
    try {
      const { supabase } = await import("../../lib/supabase");
      const { error: dbError } = await supabase.from("enquiries").insert(lead);
      if (dbError) throw dbError;
      saved = true;
    } catch (err) {
      console.error("Enquiry not saved to the database", err);
    }
    const notify = () => fetch("/api/enquiry-notify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(lead) });
    if (saved) {
      notify().catch(() => {}); // team email is a bonus; the enquiry is already safe in the database
      setState("done");
      return;
    }
    // Database save failed: try to reach the team by email so the lead is not lost.
    let emailed = false;
    try { emailed = (await notify()).ok; } catch {}
    setState(emailed ? "done" : "error");
  }

  if (state === "done") return <div className="enquiry-done" role="status">
    <CheckCircle2 size={44} />
    <div className="eyebrow">Enquiry received</div>
    <h3>Thank you, {name.split(" ")[0] || "ji"}.</h3>
    <p>{venue ? <>We’ve sent your enquiry for <strong>{venue.name}</strong>.</> : <>We’ll shortlist marriage halls that match your date, guests and budget.</>} Our team will call you on <strong>+91 {cleanPhone}</strong> within one working day.</p>
  </div>;

  return <form className="enquiry-form" onSubmit={submit} noValidate>
    {title && <h3 className="enquiry-title">{title}</h3>}
    {venue && <p className="enquiry-venue">Enquiring about <strong>{venue.name}</strong>, {venue.area}</p>}
    <div className="enquiry-grid">
      <label className="eq-field"><span><UserRound size={15} /> Your name</span><input required value={name} onChange={e => setName(e.target.value)} placeholder="Full name" autoComplete="name" /></label>
      <label className="eq-field"><span><Phone size={15} /> Mobile number</span><div className="eq-phone"><b>+91</b><input required type="tel" inputMode="numeric" value={phone} onChange={e => setPhone(e.target.value)} placeholder="98765 43210" autoComplete="tel-national" /></div></label>
      <label className="eq-field"><span><CalendarHeart size={15} /> Wedding / lagan date</span><input type="date" disabled={flexible} min={new Date().toISOString().slice(0, 10)} value={date} onChange={e => setDate(e.target.value)} /></label>
      <label className="eq-field"><span><Users size={15} /> Expected guests</span><select value={guests} onChange={e => setGuests(e.target.value)}>{GUESTS.map(g => <option key={g}>{g}</option>)}</select></label>
    </div>
    <label className="eq-check"><input type="checkbox" checked={flexible} onChange={e => { setFlexible(e.target.checked); if (e.target.checked) setDate(""); }} /> Date not fixed yet</label>

    <div className="eq-field"><span>Ceremonies you need a hall for</span>
      <div className="eq-chips">{CEREMONIES.map(c => <button type="button" key={c} aria-pressed={ceremonies.includes(c)} className={ceremonies.includes(c) ? "active" : ""} onClick={() => toggle(c)}>{c}</button>)}</div>
    </div>

    <button type="button" className="eq-more" aria-expanded={more} onClick={() => setMore(!more)}>Add budget &amp; details (optional) <ChevronDown size={16} /></button>
    {more && <div className="enquiry-grid eq-extra">
      {!venue && <label className="eq-field"><span>Town / block</span><select value={city} onChange={e => setCity(e.target.value)}>{CITIES.map(c => <option key={c}>{c}</option>)}</select></label>}
      <label className="eq-field"><span>Hall budget</span><select value={budget} onChange={e => setBudget(e.target.value)}>{BUDGETS.map(b => <option key={b}>{b}</option>)}</select></label>
      <label className="eq-field"><span>Email (optional)</span><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" /></label>
      <label className="eq-field eq-wide"><span>Anything else?</span><textarea rows={3} value={message} onChange={e => setMessage(e.target.value)} placeholder="Catering, decoration, parking, rooms for the baraat…" /></label>
    </div>}

    <input className="eq-trap" tabIndex={-1} autoComplete="off" value={trap} onChange={e => setTrap(e.target.value)} aria-hidden="true" name="company" />
    <label className="eq-check eq-consent"><input type="checkbox" required checked={consent} onChange={e => setConsent(e.target.checked)} /> Hotel Videh & Marriage Hall may call or WhatsApp me about this enquiry.</label>
    {error && <p className="eq-error" role="alert">{error}</p>}
    {state === "error" && <p className="eq-error" role="alert">Sorry, your enquiry didn’t go through. Please try again in a minute, or email us at {BUSINESS.email}.</p>}
    <button className="button button-dark button-full" type="submit" disabled={state === "sending" || !consent}>
      {state === "sending" ? <><Loader2 size={18} className="spin" /> Sending…</> : <><Send size={17} /> {venue ? "Send enquiry to this hall" : "Get hall options & prices"}</>}
    </button>
    <p className="eq-note">No payment, no booking — just an enquiry. Your number is only shared with halls that match.</p>
  </form>;
}
