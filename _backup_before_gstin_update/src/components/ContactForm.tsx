"use client";
import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

export default function ContactForm({ initialTopic }: { initialTopic?: string }) {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(initialTopic || "Something else");
  const [message, setMessage] = useState("");
  if (sent) return <div className="contact-done"><CheckCircle2 size={38} /><h3>Message received, {name.split(" ")[0]}.</h3><p>We’ll reply to {email} within one working day.</p><button className="button button-outline" onClick={() => { setSent(false); setMessage(""); }}>Send another message</button></div>;
  return <form className="contact-form" onSubmit={e => { e.preventDefault(); setSent(true); }}>
    <label>Full name<input required value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></label>
    <label>Email address<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label>
    <label>What is this about?<select value={topic} onChange={e => setTopic(e.target.value)}><option>List my venue or property</option><option>Question about an enquiry</option><option>Report a problem</option><option>Something else</option></select></label>
    <label>Message<textarea required rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder={topic === "List my venue or property" ? "Hall name, city, capacity and a phone number to reach you" : "Tell us how we can help"} /></label>
    <button className="button button-dark" type="submit"><Send size={16} /> Send message</button>
  </form>;
}
