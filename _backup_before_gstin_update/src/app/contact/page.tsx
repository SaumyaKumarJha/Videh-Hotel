import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import InfoPage from "@/components/InfoPage";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = { title: "Contact us", description: "List your marriage hall or ask the Videh team a question." };

export default function ContactPage({ searchParams }: { searchParams: { topic?: string } }) {
  return <InfoPage eyebrow="Contact" title="Talk to the Videh team." intro="Looking for a marriage hall? The quickest way is our enquiry form. For anything else — or to list your hall — write to us here.">
    <div className="contact-layout">
      <ContactForm initialTopic={searchParams?.topic === "list" ? "List my venue or property" : undefined} />
      <aside className="contact-info">
        {/* Replace these placeholder details with your real contact information. */}
        <div><Mail size={20} /><span><strong>Email</strong><a href="mailto:hello@videh.example">hello@videh.example</a></span></div>
        <div><Phone size={20} /><span><strong>Phone</strong><a href="tel:+910000000000">+91 00000 00000</a></span></div>
        <div><MapPin size={20} /><span><strong>Based in</strong>Madhubani, Bihar</span></div>
        <div><Clock size={20} /><span><strong>Hours</strong>Monday to Saturday, 10 am to 7 pm</span></div>
      </aside>
    </div>
  </InfoPage>;
}
