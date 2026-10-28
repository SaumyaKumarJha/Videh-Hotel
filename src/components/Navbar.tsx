"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, MessageSquareHeart } from "lucide-react";

const links = [
  { href: "/hall", label: "The hall" },
  { href: "/#rituals", label: "Ceremonies" },
  { href: "/#how", label: "How it works" },
  { href: "/#visit", label: "Visit us" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header className={`site-header ${pathname === "/" ? "is-home" : ""} ${scrolled ? "is-scrolled" : ""}`}>
      <div className="topline"><span><b className="topline-script">शुभ विवाह</b> Wedding season enquiries are open<span className="topline-long"> — tell us your lagan date</span>.</span><span className="topline-right">Ranti Road, Madhubani</span></div>
      <nav className="navbar container">
        <Link href="/" className="brand" aria-label="Videh homepage">
          <img className="brand-image" src="/videh-logo-128.webp" width={42} height={42} alt="Hotel Videh & Marriage Hall logo" /><span className="brand-word">videh<span className="brand-dot">.</span><small>HOTEL &amp; MARRIAGE HALL</small></span>
        </Link>
        <div className="desktop-nav">
          {links.map(link => <Link key={link.href} href={link.href} className={link.href.startsWith("/#") ? "" : pathname.startsWith(link.href) ? "active" : ""}>{link.label}</Link>)}
          
        </div>
        <div className="nav-actions">
          <Link className="nav-enquire" href="/enquire"><MessageSquareHeart size={17} /> <span>Enquire now</span></Link>
          <button className="mobile-menu-button" onClick={() => setOpen(!open)} aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open}>{open ? <X /> : <Menu />}</button>
        </div>
      </nav>
      {open && <div className="mobile-nav" onClick={() => setOpen(false)}>{links.map(link => <Link key={link.href} href={link.href}>{link.label}</Link>)}<Link href="/enquire" className="mobile-enquire">Enquire now</Link></div>}
    </header>
  );
}
