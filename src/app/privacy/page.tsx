import { pageMeta } from "@/lib/site";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { BUSINESS as B } from "@/lib/business";

export const metadata = pageMeta({ title: "Privacy Policy", description: "What Hotel Videh & Marriage Hall, Madhubani, collects when you send an enquiry, how it is used, who sees it and how to ask us to delete it.", path: "/privacy" });

export default function PrivacyPage() {
  return <InfoPage eyebrow="Privacy" title="Your information, handled with care." intro="What we collect, why we collect it, and your choices.">
    {/* Draft text. Have it reviewed by a legal professional before launch. */}
    <div className="info-prose">
      <h2>What we collect</h2>
      <p>When you send an enquiry or contact us, we collect your name, mobile number, optional email address and the details of your wedding (date, city, guests, ceremonies, budget and notes).</p>
      <h2>How we use it</h2>
      <p>We use your details to call you back and plan your event. We do not sell your personal information.</p>
      <h2>Who sees it</h2>
      <p>Your enquiry details are seen only by our team. Service providers who help us run the site may process data on our behalf.</p>
      <h2>Your choices</h2>
      <p>To ask us to correct or delete your information, <Link href="/contact">contact us</Link> or write to {B.email}.</p>
      <h2>Changes to this policy</h2>
      <p>We may update this policy as Videh grows. The latest version will always be on this page.</p>
    </div>
  </InfoPage>;
}
