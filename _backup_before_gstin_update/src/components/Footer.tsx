import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";
export default function Footer() {
  return <footer className="footer">
    <div className="footer-pattern" />
    <div className="container footer-grid">
      <div className="footer-brand"><Link href="/" className="brand footer-logo"><img className="brand-image" src="/videh-logo.png" alt="Videh logo" /><span className="brand-word">videh<span className="brand-dot">.</span><small>THE ART OF BELONGING</small></span></Link><p>Marriage halls for every Mithila wedding — from tilak to reception. Compare halls, then send one enquiry and we’ll call you with options.</p><div className="socials"><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Videh on Instagram"><Instagram size={18} /></a><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Videh on Facebook"><Facebook size={18} /></a></div></div>
      <div><h4>Marriage halls</h4><Link href="/banquets">All marriage halls</Link><Link href="/banquets?q=Madhubani">Halls in Madhubani town</Link><Link href="/banquets?q=Jhanjharpur">Halls in Jhanjharpur</Link><Link href="/banquets?q=Rajnagar">Halls near Rajnagar</Link><Link href="/enquire">Send an enquiry</Link><Link href="/#plan">Budget planner</Link></div>
      <div><h4>Help</h4><Link href="/about">About Videh</Link><Link href="/contact">Contact us</Link><Link href="/faq">FAQs</Link><Link href="/policies">How enquiries work</Link><Link href="/contact?topic=list">List your marriage hall</Link></div>
      <div className="newsletter"><h4>Notes from Videh</h4><p>Venue openings, wedding-season tips and Mithila traditions.</p><NewsletterForm /><small>By subscribing, you agree to receive updates from Videh. See our <Link href="/privacy">privacy policy</Link>.</small></div>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} Videh. All rights reserved.</span><span className="footer-blessing">शुभ मंगल · Designed with the spirit of Mithila.</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div>
  </footer>;
}
