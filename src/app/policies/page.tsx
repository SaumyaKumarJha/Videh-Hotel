import { pageMeta } from "@/lib/site";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";

export const metadata = pageMeta({ title: "How Enquiries Work", description: "What happens after you send an enquiry to Hotel Videh & Marriage Hall, Madhubani: call-back, prices, payments and changing your enquiry.", path: "/policies" });

export default function PoliciesPage() {
  return <InfoPage eyebrow="How enquiries work" title="Enquiry, not booking." intro="Plain-language notes on what happens after you send an enquiry.">
    {/* Draft text. Have it reviewed against how your business actually operates before launch. */}
    <div className="info-prose">
      <h2>An enquiry is not a booking</h2>
      <p>Sending an enquiry doesn’t reserve the hall or a date. It tells us what you’re planning so we can check that your date is free.</p>
      <h2>What happens next</h2>
      <p>Our team calls you within one working day, confirms your date, talks through your guests and ceremonies, and helps you arrange a visit.</p>
      <h2>Prices</h2>
      <p>The final price, taxes, advance and cancellation terms depend on your date, guests, menu and decoration, and are agreed directly between you and us in writing.</p>
      <h2>Payments</h2>
      <p>We do not take any payment on this website. Pay only under the terms we give you in writing.</p>
      <h2>Changing or withdrawing an enquiry</h2>
      <p>Just tell us on the call, or <Link href="/contact">write to us</Link>, and we’ll update or close your enquiry.</p>
    </div>
  </InfoPage>;
}
