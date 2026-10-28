import { pageMeta } from "@/lib/site";
import { Mail, MapPin, Clock } from "lucide-react";
import InfoPage from "@/components/InfoPage";
import ContactForm from "@/components/ContactForm";
import BusinessDetails from "@/components/BusinessDetails";
import { BUSINESS as B } from "@/lib/business";

export const metadata = pageMeta({
  title: "Contact & Directions – Ranti Road, Madhubani",
  description: "Contact Hotel Videh & Marriage Hall: Khesra No. 2083, Ranti Road, near Gumti No. 13, Madhubani, Bihar 847211. Email us or send a message.",
  path: "/contact",
});

export default function ContactPage({ searchParams }: { searchParams: { topic?: string } }) {
  return <InfoPage eyebrow="Contact" title="Talk to us." intro="Planning a wedding? The quickest way is our enquiry form. For anything else, write to us here.">
    <div className="contact-layout">
      <ContactForm />
      <aside className="contact-info">
        <div><Mail size={20} /><span><strong>Email</strong><a href={`mailto:${B.email}`}>{B.email}</a></span></div>
        <div><MapPin size={20} /><span><strong>Visit us</strong>{B.addressOneLine}</span></div>
        <div><Clock size={20} /><span><strong>Hours</strong>Monday to Saturday, 10 am to 7 pm</span></div>
        <BusinessDetails />
      </aside>
    </div>
  </InfoPage>;
}
