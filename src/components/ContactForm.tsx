"use client";
import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { BUSINESS } from "@/lib/business";

export default function ContactForm({ initialTopic }: { initialTopic?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState(initialTopic || "Something else");
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot, hidden from people

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending"); setError("");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, topic, message, website }) });
      if (res.ok) { setStatus("sent"); return; }
      const data = await res.json().catch(() => ({}));
      setError(res.status === 503 ? `Our email service isn’t connected yet. Please write to us at ${BUSINESS.email}.` : data.error || "Something went wrong. Please try again.");
    } catch { setError(`Could not reach the server. Please write to us at ${BUSINESS.email}.`); }
    setStatus("error");
  }

  if (status === "sent") return <div className="contact-done"><CheckCircle2 size={38} /><h3>Message sent, {name.split(" ")[0]}.</h3><p>We’ll reply to {email} within one working day.</p><button className="button button-outline" onClick={() => { setStatus("idle"); setMessage(""); }}>Send another message</button></div>;
  return <form className="contact-form" onSubmit={submit}>
    <label>Full name<input required maxLength={100} value={name} onChange={e => setName(e.target.value)} placeholder="Your name" /></label>
    <label>Email address<input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" /></label>
    <label>What is this about?<select value={topic} onChange={e => setTopic(e.target.value)}><option>Question about an enquiry</option><option>Wedding or event question</option><option>Report a problem</option><option>Something else</option></select></label>
    <label>Message<textarea required minLength={5} maxLength={4000} rows={5} value={message} onChange={e => setMessage(e.target.value)} placeholder="Tell us how we can help" /></label>
    <input type="text" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" value={website} onChange={e => setWebsite(e.target.value)} style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }} />
    {status === "error" && <p className="form-error" role="alert">{error}</p>}
    <button className="button button-dark" type="submit" disabled={status === "sending"}><Send size={16} /> {status === "sending" ? "Sending…" : "Send message"}</button>
  </form>;
}
