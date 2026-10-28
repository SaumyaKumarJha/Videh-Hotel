"use client";
import { useState } from "react";
import { ArrowUpRight, Check } from "lucide-react";

export default function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);
  if (done) return <p className="newsletter-done"><Check size={16} /> Thank you. We’ll write to {email} soon.</p>;
  return <form onSubmit={e => { e.preventDefault(); setDone(true); }}>
    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" aria-label="Your email address" />
    <button aria-label="Subscribe"><ArrowUpRight size={18} /></button>
  </form>;
}
