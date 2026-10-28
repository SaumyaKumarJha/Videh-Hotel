import { NextResponse } from "next/server";
import { BUSINESS } from "@/lib/business";
import { clean, emailBudget, getTransport, isEmail, tooMany, wrap } from "@/lib/mail";

export const runtime = "nodejs";

// Emails the reception (videhhotels@gmail.com) when an enquiry is submitted. The enquiry itself is saved to Supabase
// by the form; this only sends the notification, so a mail problem never loses an enquiry.
export async function POST(req: Request) {
  if (tooMany(req, "enquiry", 8)) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  if (Number(req.headers.get("content-length") || 0) > 20_000) return NextResponse.json({ error: "Too large." }, { status: 413 });
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  const name = clean(b.name, 100), phone = clean(b.phone, 15).replace(/\D/g, "");
  if (name.length < 2 || !/^[6-9]\d{9}$/.test(phone)) return NextResponse.json({ error: "Invalid enquiry." }, { status: 400 });
  const email = clean(b.email, 254);
  const date = b.date_flexible ? "Not fixed yet" : clean(b.wedding_date, 10) || "Not given";
  const ceremonies = Array.isArray(b.ceremonies) ? b.ceremonies.map(c => clean(c, 40)).slice(0, 8).join(", ") : "";
  const rows: [string, string][] = [
    ["Name", name], ["Mobile", `+91 ${phone}`], ["Wedding date", date], ["Guests", clean(b.guests, 30)],
    ["Ceremonies", ceremonies], ["Town / block", clean(b.city, 60)], ["Budget", clean(b.budget, 40)],
    ["Venue", clean(b.venue_name, 120) || "Hotel Videh & Marriage Hall"],
  ];
  if (isEmail(email)) rows.push(["Email", email]);
  const note = String(b.message ?? "").trim().slice(0, 2000);
  if (note) rows.push(["Notes", note]);
  rows.push(["Came from", clean(b.source, 40)]);

  if (!emailBudget(phone)) return NextResponse.json({ ok: true, skipped: true });   // duplicate or too many emails this hour: the enquiry itself is already saved
  const mail = getTransport();
  if (!mail) return NextResponse.json({ error: "Email is not set up yet." }, { status: 503 });
  try {
    await mail.transport.sendMail({
      from: mail.from, to: BUSINESS.email, ...(isEmail(email) ? { replyTo: email } : {}),
      subject: `New enquiry: ${name} · +91 ${phone} · ${clean(b.guests, 30)} guests · ${date}`,
      text: rows.map(([k, v]) => `${k}: ${v}`).join("\n"),
      html: wrap("New enquiry — Hotel Videh & Marriage Hall", rows, "Please call this guest back within one working day. Replying to this email reaches them directly if they gave an email address."),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("enquiry mail failed", e);
    return NextResponse.json({ error: "Could not send." }, { status: 502 });
  }
}
