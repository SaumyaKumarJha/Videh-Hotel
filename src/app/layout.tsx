import type { Metadata } from "next";
import { Yatra_One, Mukta } from "next/font/google";
import "./globals.css";
import "./theme.css";
import "./wedding.css";
import "./cinema.css";
import Navbar from "@/components/Navbar";
import ScrollFocus from "@/components/ScrollFocus";
import TiltEffect from "@/components/TiltEffect";
import Footer from "@/components/Footer";
import { OG_IMAGE, SITE_URL } from "@/lib/site";
import EnquireFab from "@/components/EnquireFab";

const head = Yatra_One({ weight: "400", subsets: ["latin", "devanagari"], variable: "--font-head", display: "swap" });
const body = Mukta({ weight: ["400", "500", "600", "700"], subsets: ["latin", "devanagari"], variable: "--font-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Marriage Hall in Madhubani | Hotel Videh & Marriage Hall", template: "%s | Hotel Videh" },
  description: "Wedding venue and hotel on Ranti Road, Madhubani, Bihar, for tilak, haldi, vivah, reception and chaturthi. Send one enquiry for your date and we call you back.",
  applicationName: "Hotel Videh & Marriage Hall",
  icons: { icon: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }, { url: "/favicon-32.png", sizes: "32x32", type: "image/png" }], apple: "/apple-touch-icon.png" },
  openGraph: { siteName: "Hotel Videh & Marriage Hall", type: "website", locale: "en_IN", images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
  formatDetection: { telephone: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${head.variable} ${body.variable}`}>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <Navbar />
        <ScrollFocus />
        <TiltEffect />
        <main id="main">{children}</main>
        <Footer />
        <EnquireFab />
      </body>
    </html>
  );
}
