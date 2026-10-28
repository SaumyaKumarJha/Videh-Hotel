import nodemailer from "nodemailer";

export const esc = (s: unknown) => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] as string));
export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) && s.length <= 254;
export const clean = (s: unknown, max: number) => String(s ?? "").replace(/[\r\n]+/g, " ").trim().slice(0, max);

/** Returns null when email is not configured (no credentials in the environment). */
export function getTransport() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;
  const host = process.env.SMTP_HOST; // optional: another provider, or a test server
  const transport = host
    ? nodemailer.createTransport({ host, port: Number(process.env.SMTP_PORT || 587), secure: process.env.SMTP_SECURE === "true", auth: { user, pass }, tls: { rejectUnauthorized: process.env.SMTP_INSECURE !== "true" } })
    : nodemailer.createTransport({ service: "gmail", auth: { user, pass } });
  return { transport, from: `"Hotel Videh Website" <${user}>` };
}

export function wrap(title: string, rows: [string, string][], note?: string) {
  const body = rows.map(([k, v]) => `<tr><td style="padding:6px 14px 6px 0;color:#615C73;vertical-align:top">${esc(k)}</td><td style="padding:6px 0"><strong>${esc(v)}</strong></td></tr>`).join("");
  return `<div style="font-family:Arial,sans-serif;color:#2B2540;max-width:560px"><h2 style="color:#2F3A8F;margin:0 0 12px">${esc(title)}</h2><table style="border-collapse:collapse;font-size:15px">${body}</table>${note ? `<p style="margin-top:18px;font-size:14px;color:#615C73">${esc(note)}</p>` : ""}</div>`;
}

// Simple per-visitor rate limit (in memory) so the forms can't be used to flood the inbox.
const hits = new Map<string, number[]>();
export function tooMany(req: Request, bucket: string, max = 5, windowMs = 60_000) {
  const ip = (req.headers.get("x-forwarded-for") || "local").split(",")[0].trim();
  const key = `${bucket}:${ip}`, now = Date.now();
  const recent = (hits.get(key) || []).filter(t => now - t < windowMs);
  recent.push(now); hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > max;
}

// Email safety nets for the notification routes: never send more than `max` emails per hour for the whole site,
// and never email the same phone number twice within 10 minutes.
const sent: number[] = [];
const lastByKey = new Map<string, number>();
export function emailBudget(key?: string, max = 40) {
  const now = Date.now();
  while (sent.length && now - sent[0] > 3_600_000) sent.shift();
  if (sent.length >= max) return false;
  if (key) {
    if (now - (lastByKey.get(key) || 0) < 600_000) return false;
    lastByKey.set(key, now);
    if (lastByKey.size > 5000) lastByKey.clear();
  }
  sent.push(now);
  return true;
}
