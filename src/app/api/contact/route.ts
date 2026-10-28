import { NextResponse } from "next/server";
import { BUSINESS } from "@/lib/business";
import { clean, emailBudget, getTransport, isEmail, tooMany, wrap } from "@/lib/mail";

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (tooMany(req, "contact")) return NextResponse.json({ error: "Too many messages. Please wait a minute and try again." }, { status: 429 });
  let b: Record<string, unknown>;
  try { b = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (b.website) return NextResponse.json({ ok: true }); // honeypot field: bots fill it, people never see it
  const name = clean(b.name, 100), email = clean(b.email, 254), topic = clean(b.topic, 80);
  const message = String(b.message ?? "").trim().slice(0, 4000);
  if (!name || !isEmail(email) || message.length < 5) return NextResponse.json({ error: "Please fill in your name, a valid email and a message." }, { status: 400 });

  if (!emailBudget()) return NextResponse.json({ error: "Too many messages right now. Please try again later." }, { status: 429 });
  const mail = getTransport();
  if (!mail) return NextResponse.json({ error: "Email is not set up yet." }, { status: 503 });
  try {
    await mail.transport.sendMail({
      from: mail.from, to: BUSINESS.email, replyTo: `"${name.replace(/"/g, "")}" <${email}>`,
      subject: `[Videh] ${topic || "Message"} from ${name}`,
      text: `From: ${name} <${email}>\nTopic: ${topic}\n\n${message}`,
      html: wrap("New message from the Videh website", [["Name", name], ["Email", email], ["Topic", topic], ["Message", message]]),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("contact mail failed", e);
    return NextResponse.json({ error: "We couldn’t send your message right now." }, { status: 502 });
  }
}
