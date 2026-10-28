import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";
import NewsletterForm from "@/components/NewsletterForm";
import { BUSINESS as B } from "@/lib/business";
export default function Footer() {
  return <footer className="footer">
    <div className="footer-pattern" />
    <div className="container footer-grid">
      <div className="footer-brand"><Link href="/" className="brand footer-logo"><img className="brand-image" src="/videh-logo-128.webp" width={42} height={42} alt="Hotel Videh & Marriage Hall logo" /><span className="brand-word">videh<span className="brand-dot">.</span><small>HOTEL &amp; MARRIAGE HALL</small></span></Link><p>A home for every Mithila wedding — from tilak to reception. Send one enquiry and we’ll call you back.</p><div className="socials"><a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Videh on Instagram"><Instagram size={18} /></a><a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Videh on Facebook"><Facebook size={18} /></a></div></div>
      <div><h4>The hall</h4><Link href="/hall">Hall &amp; photos</Link><Link href="/#rituals">Ceremonies</Link><Link href="/enquire">Send an enquiry</Link><Link href="/#visit">Find us &amp; directions</Link></div>
      <div><h4>Help</h4><Link href="/about">About Videh</Link><Link href="/contact">Contact us</Link><Link href="/faq">FAQs</Link><Link href="/policies">How enquiries work</Link></div>
      <div className="newsletter"><h4>Notes from Videh</h4><p>Wedding-season dates, tips and Mithila traditions.</p><NewsletterForm /><small>By subscribing, you agree to receive updates from Videh. See our <Link href="/privacy">privacy policy</Link>.</small></div>
    </div>
    <div className="container footer-legal">
      <p><strong>{B.tradeName}</strong> · GSTIN: <strong className="gstin">{B.gstin}</strong></p>
      <p>{B.addressOneLine} · <a href={`mailto:${B.email}`}>{B.email}</a></p>
    </div>
    <div className="container footer-bottom"><span>© {new Date().getFullYear()} {B.tradeName}. All rights reserved.</span><span className="footer-blessing">शुभ मंगल · Designed with the spirit of Mithila.</span><div><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link></div></div>
  </footer>;
}
