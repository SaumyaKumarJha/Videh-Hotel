import { pageMeta } from "@/lib/site";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";
import { BUSINESS as B } from "@/lib/business";

export const metadata = pageMeta({ title: "Terms of Use", description: "The terms for using the Hotel Videh & Marriage Hall website, sending enquiries and how dates and prices are confirmed with our team.", path: "/terms" });

export default function TermsPage() {
  return <InfoPage eyebrow="Terms" title="Terms of use." intro="The simple rules for using Videh.">
    {/* Draft text. Have it reviewed by a legal professional before launch. */}
    <div className="info-prose">
      <h2>Who we are</h2>
      <p>This website is operated by {B.tradeName}, a proprietorship registered in Madhubani, Bihar. GSTIN: {B.gstin}.</p>
      <h2>Using this site</h2>
      <p>This site lets you learn about the hall and send enquiries. By using the site you agree to use it lawfully and to give accurate information.</p>
      <h2>Information and availability</h2>
      <p>Availability, prices and facilities can change, and are confirmed by us on a call.</p>
      <h2>Enquiries</h2>
      <p>We do not take bookings or payments on this site. Your event is arranged directly between you and us. See <Link href="/policies">how enquiries work</Link>.</p>
      <h2>Responsibility</h2>
      <p>We take care to keep information accurate, but we cannot guarantee it is always complete or up to date. Please confirm every detail with us before you decide.</p>
      <h2>Changes</h2>
      <p>We may update these terms from time to time. Continuing to use Videh means you accept the updated terms.</p>
      <h2>Questions</h2>
      <p>If you have questions about these terms, please <Link href="/contact">contact us</Link>.</p>
    </div>
  </InfoPage>;
}
