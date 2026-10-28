import { JsonLd, breadcrumbs, pageMeta } from "@/lib/site";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";

export const metadata = pageMeta({
  title: "Wedding Venue FAQs – Dates, Visits & Prices",
  description: "Answers about enquiring at Hotel Videh & Marriage Hall, Madhubani: call-backs, undecided dates, ceremonies we host, prices and visiting the hall.",
  path: "/faq",
});

const faqs = [
  { q: "How do I plan my wedding here?", a: <>Send an <Link href="/enquire">enquiry</Link> with your lagan date, guest count and ceremonies. Our team calls you back to confirm the date and talk through the details.</> },
  { q: "Can I book the hall on the website?", a: "No. This website doesn’t take bookings or payments. You send an enquiry, we confirm availability and prices with you on a call, and you finalise directly with us." },
  { q: "How soon will someone call me?", a: "Within one working day of your enquiry, on the mobile number you share." },
  { q: "My wedding date isn’t fixed yet. Can I still enquire?", a: "Yes. Tick “Date not fixed yet” on the form. We’ll share the details and check availability once your date is set." },
  { q: "Which ceremonies can I plan here?", a: "Tilak, haldi & matkor, vivah, reception and chaturthi. Tell us which ones you need when you enquire." },
  { q: "What will it cost?", a: "The price depends on your date, guest count, menu and decoration. We explain it on the call, before you decide." },
  { q: "Can I visit the hall first?", a: <>Of course. <Link href="/#visit">Find us on Ranti Road, Madhubani</Link>, or tell us when you are coming and we will be there.</> },
  { q: "Who sees my phone number?", a: <>Only our team. See our <Link href="/privacy">privacy policy</Link>.</> },
];

const plain = (f: (typeof faqs)[number]) => (typeof f.a === "string" ? f.a : TEXT[f.q]);
const TEXT: Record<string, string> = {"How do I plan my wedding here?": "Send an enquiry with your lagan date, guest count and ceremonies. Our team calls you back to confirm the date and talk through the details.", "Can I visit the hall first?": "Of course. Find us on Ranti Road, Madhubani, or tell us when you are coming and we will be there.", "Who sees my phone number?": "Only our team. See our privacy policy."};

export default function FaqPage() {
  return <>
  <JsonLd data={[
    { "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: plain(f) } })) },
    breadcrumbs([["FAQs", "/faq"]]),
  ]} />
  <InfoPage eyebrow="FAQs" title="Questions, answered." intro="Planning a wedding at Hotel Videh & Marriage Hall, and what happens after you enquire.">
    <div className="faq-list">{faqs.map(f => <details className="faq-item" key={f.q}><summary>{f.q}</summary><p>{f.a}</p></details>)}</div>
  </InfoPage>
  </>;
}
