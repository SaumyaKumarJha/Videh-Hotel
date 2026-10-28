import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Privacy policy", description: "What information Videh collects and how it is used." };

export default function PrivacyPage() {
  return <InfoPage eyebrow="Privacy" title="Your information, handled with care." intro="What we collect, why we collect it, and your choices.">
    {/* Draft text. Have it reviewed by a legal professional before launch. */}
    <div className="info-prose">
      <h2>What we collect</h2>
      <p>When you send an enquiry or contact us, we collect your name, mobile number, optional email address and the details of your wedding (date, city, guests, ceremonies, budget and notes). Halls you shortlist are stored only in your browser.</p>
      <h2>How we use it</h2>
      <p>We use your details to call you back, find halls that match your enquiry and share your requirements with those halls. We do not sell your personal information.</p>
      <h2>Who sees it</h2>
      <p>Your enquiry details are shared only with the Videh team and the halls that match your requirements. Service providers who help us run the site may process data on our behalf.</p>
      <h2>Your choices</h2>
      <p>You can clear shortlisted halls by clearing your browser data. To ask us to correct or delete your information, <Link href="/contact">contact us</Link>.</p>
      <h2>Changes to this policy</h2>
      <p>We may update this policy as Videh grows. The latest version will always be on this page.</p>
    </div>
  </InfoPage>;
}
