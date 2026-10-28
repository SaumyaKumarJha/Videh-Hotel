"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Download, LogOut, MessageCircle, Phone, RefreshCw, Search } from "lucide-react";
import { supabase } from "../../../lib/supabase";
import { BUSINESS } from "@/lib/business";

const STAFF = [BUSINESS.email.toLowerCase()];            // keep in sync with supabase/crm.sql
const STATUSES = ["new", "called", "site visit", "won", "lost"] as const;
type Status = (typeof STATUSES)[number];
type Lead = {
  id: string; created_at: string; name: string; phone: string; email: string | null; city: string | null;
  wedding_date: string | null; date_flexible: boolean; guests: string | null; ceremonies: string[] | null;
  budget: string | null; message: string | null; source: string | null; status: Status; internal_notes: string | null;
};
type SortKey = "created_at" | "name" | "wedding_date" | "status";

const fmtDate = (d: string | null) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
const fmtWhen = (d: string) => new Date(d).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "numeric", minute: "2-digit", hour12: true });
const waLink = (p: string, name: string) => `https://wa.me/91${p}?text=${encodeURIComponent(`Namaste ${name}, this is Hotel Videh & Marriage Hall about your enquiry.`)}`;

export default function AdminPage() {
  const [session, setSession] = useState<"loading" | "out" | "in">("loading");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [authMsg, setAuthMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const [leads, setLeads] = useState<Lead[]>([]);
  const [loadErr, setLoadErr] = useState("");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | Status>("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "created_at", dir: -1 });
  const [saving, setSaving] = useState<string | null>(null);
  const [updated, setUpdated] = useState<Date | null>(null);
  const seen = useRef<Set<string> | null>(null);
  const [fresh, setFresh] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { const u = data.session?.user; setUserEmail(u?.email || ""); setSession(u ? "in" : "out"); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => { setUserEmail(s?.user?.email || ""); setSession(s?.user ? "in" : "out"); });
    return () => sub.subscription.unsubscribe();
  }, []);

  const allowed = STAFF.includes(userEmail.toLowerCase());

  const load = useCallback(async () => {
    setLoadErr("");
    const { data, error } = await supabase.from("enquiries").select("*").order("created_at", { ascending: false }).limit(2000);
    if (error) { setLoadErr(error.message); return; }
    const rows = (data || []) as Lead[];
    if (seen.current) { const add = rows.filter(r => !seen.current!.has(r.id)).map(r => r.id); if (add.length) setFresh(f => [...f, ...add]); }
    seen.current = new Set(rows.map(r => r.id));
    setLeads(rows); setUpdated(new Date());
  }, []);

  useEffect(() => {
    if (session !== "in" || !allowed) return;
    load();
    const t = setInterval(load, 60_000);
    return () => clearInterval(t);
  }, [session, allowed, load]);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setAuthMsg("");
    const em = email.trim().toLowerCase();
    if (!STAFF.includes(em)) { setAuthMsg("This email is not on the staff list."); setBusy(false); return; }
    const { error } = await supabase.auth.signInWithOtp({ email: em, options: { shouldCreateUser: true, emailRedirectTo: typeof window !== "undefined" ? window.location.href : undefined } });
    setBusy(false);
    if (error) setAuthMsg(error.message); else { setSent(true); setAuthMsg("We emailed you a sign-in link and code. Open the link, or type the code below."); }
  }
  async function verify(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setAuthMsg("");
    const { error } = await supabase.auth.verifyOtp({ email: email.trim().toLowerCase(), token: code.trim(), type: "email" });
    setBusy(false);
    if (error) setAuthMsg(error.message);
  }

  async function patch(id: string, fields: Partial<Lead>) {
    setSaving(id);
    setLeads(ls => ls.map(l => l.id === id ? { ...l, ...fields } : l));
    const { error } = await supabase.from("enquiries").update({ ...fields, updated_at: new Date().toISOString() }).eq("id", id);
    setSaving(null);
    if (error) { setLoadErr("Could not save: " + error.message); load(); }
  }

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: leads.length };
    STATUSES.forEach(s => c[s] = leads.filter(l => l.status === s).length);
    return c;
  }, [leads]);
  const weekAgo = Date.now() - 7 * 864e5;
  const thisWeek = leads.filter(l => new Date(l.created_at).getTime() > weekAgo).length;

  const rows = useMemo(() => {
    const needle = q.trim().toLowerCase();
    let r = leads.filter(l => (filter === "all" || l.status === filter) &&
      (!needle || [l.name, l.phone, l.email, l.city, l.guests, l.budget, l.internal_notes, l.message, (l.ceremonies || []).join(" ")].some(v => (v || "").toLowerCase().includes(needle))));
    r = [...r].sort((a, b) => {
      const av = (a[sort.key] ?? "") as string, bv = (b[sort.key] ?? "") as string;
      return av < bv ? -sort.dir : av > bv ? sort.dir : 0;
    });
    return r;
  }, [leads, q, filter, sort]);

  function exportCsv() {
    const head = ["Received", "Name", "Phone", "Email", "Wedding date", "Date flexible", "Guests", "Ceremonies", "Town", "Budget", "Status", "Notes (staff)", "Message", "Source"];
    const esc = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [head.map(esc).join(",")].concat(rows.map(l => [l.created_at, l.name, l.phone, l.email, l.wedding_date, l.date_flexible ? "yes" : "", l.guests, (l.ceremonies || []).join("; "), l.city, l.budget, l.status, l.internal_notes, l.message, l.source].map(esc).join(","))).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8" }));
    a.download = `videh-enquiries-${new Date().toISOString().slice(0, 10)}.csv`; a.click();
  }
  const th = (key: SortKey, label: string) => <th className="is-sort" onClick={() => setSort(s => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : (key === "created_at" ? -1 : 1) }))}>{label}{sort.key === key ? (sort.dir === 1 ? " ▲" : " ▼") : ""}</th>;

  if (session === "loading") return <main className="admin container"><p>Loading…</p></main>;

  if (session === "out" || !allowed) return (
    <main className="admin container admin-login">
      <div className="admin-card">
        <span className="eyebrow">Staff only</span>
        <h1>Enquiries</h1>
        {session === "in" && !allowed && <p className="admin-err">{userEmail} is not on the staff list. <button className="text-link" onClick={() => supabase.auth.signOut()}>Sign out</button></p>}
        <form onSubmit={sent ? verify : sendCode}>
          <label>Staff email<input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder={BUSINESS.email} autoComplete="email" disabled={sent} /></label>
          {sent && <label>6-digit code from the email<input inputMode="numeric" value={code} onChange={e => setCode(e.target.value)} placeholder="123456" autoComplete="one-time-code" /></label>}
          <button className="button button-primary" disabled={busy}>{busy ? "Please wait…" : sent ? "Sign in" : "Email me a sign-in link"}</button>
          {sent && <button type="button" className="text-link" onClick={() => { setSent(false); setCode(""); setAuthMsg(""); }}>Use a different email</button>}
        </form>
        {authMsg && <p className="admin-msg">{authMsg}</p>}
      </div>
    </main>
  );

  return (
    <main className="admin">
      <div className="admin-top">
        <div><span className="eyebrow">Hotel Videh &amp; Marriage Hall</span><h1>Enquiries</h1></div>
        <div className="admin-actions">
          <button onClick={load}><RefreshCw size={15} /> Refresh</button>
          <button onClick={exportCsv}><Download size={15} /> Export CSV</button>
          <button onClick={() => supabase.auth.signOut()}><LogOut size={15} /> Sign out</button>
        </div>
      </div>

      <div className="admin-stats">
        <div><b>{counts.all}</b><span>All enquiries</span></div>
        <div className="is-new"><b>{counts.new}</b><span>To call back</span></div>
        <div><b>{thisWeek}</b><span>Last 7 days</span></div>
        <div><b>{counts["site visit"]}</b><span>Site visits</span></div>
        <div><b>{counts.won}</b><span>Booked</span></div>
      </div>

      <div className="admin-bar">
        <label className="admin-search"><Search size={16} /><input value={q} onChange={e => setQ(e.target.value)} placeholder="Search name, phone, town, notes…" /></label>
        <div className="admin-chips">
          {(["all", ...STATUSES] as const).map(s => <button key={s} className={filter === s ? "on" : ""} onClick={() => setFilter(s)}>{s === "all" ? "All" : s[0].toUpperCase() + s.slice(1)} <i>{counts[s]}</i></button>)}
        </div>
      </div>
      {loadErr && <p className="admin-err">{loadErr}{/relation|schema cache|permission|policy|column/i.test(loadErr) && " — run supabase/crm.sql in the Supabase SQL Editor."}</p>}
      {fresh.length > 0 && <p className="admin-msg">{fresh.length} new enquiry arrived. <button className="text-link" onClick={() => setFresh([])}>Dismiss</button></p>}

      <div className="admin-sheet" role="region" aria-label="Enquiries spreadsheet" tabIndex={0}>
        <table>
          <thead><tr>
            <th>#</th>{th("created_at", "Received")}{th("name", "Name")}<th>Call</th>{th("wedding_date", "Wedding date")}<th>Guests</th><th>Ceremonies</th><th>Town</th><th>Budget</th>{th("status", "Status")}<th>Staff notes</th><th>Their message</th>
          </tr></thead>
          <tbody>
            {rows.map((l, i) => (
              <tr key={l.id} className={`st-${l.status.replace(" ", "-")} ${fresh.includes(l.id) ? "is-fresh" : ""}`}>
                <td className="n">{i + 1}</td>
                <td className="nw">{fmtWhen(l.created_at)}</td>
                <td className="nm"><b>{l.name}</b>{l.email && <small>{l.email}</small>}</td>
                <td className="nw call">
                  <a href={`tel:+91${l.phone}`} onClick={() => l.status === "new" && patch(l.id, { status: "called" })} title="Call"><Phone size={14} /> {l.phone}</a>
                  <a className="wa" href={waLink(l.phone, l.name)} target="_blank" rel="noopener noreferrer" title="WhatsApp"><MessageCircle size={14} /></a>
                </td>
                <td className="nw">{l.date_flexible ? "Not fixed" : fmtDate(l.wedding_date)}</td>
                <td className="nw">{l.guests || "—"}</td>
                <td>{(l.ceremonies || []).join(", ") || "—"}</td>
                <td>{l.city || "—"}</td>
                <td>{l.budget && l.budget !== "Not sure yet" ? l.budget : "—"}</td>
                <td><select value={l.status} onChange={e => patch(l.id, { status: e.target.value as Status })} className={`pill st-${l.status.replace(" ", "-")}`} aria-label={`Status for ${l.name}`}>{STATUSES.map(s => <option key={s}>{s}</option>)}</select>{saving === l.id && <small> saving…</small>}</td>
                <td className="notes"><textarea rows={2} defaultValue={l.internal_notes || ""} placeholder="Add a note…" aria-label={`Notes for ${l.name}`} onBlur={e => { if (e.target.value !== (l.internal_notes || "")) patch(l.id, { internal_notes: e.target.value }); }} /></td>
                <td className="msg">{l.message || ""}</td>
              </tr>
            ))}
            {rows.length === 0 && <tr><td colSpan={12} className="empty">{leads.length ? "No enquiries match." : "No enquiries yet. They appear here as soon as someone sends the form."}</td></tr>}
          </tbody>
        </table>
      </div>
      <p className="admin-foot">{rows.length} shown{updated ? ` · updated ${updated.toLocaleTimeString("en-IN")}` : ""} · refreshes every minute · tapping a phone number marks a “new” enquiry as “called”.</p>
    </main>
  );
}
