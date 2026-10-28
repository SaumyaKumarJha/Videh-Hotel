import type { Metadata } from "next";
import Link from "next/link";
import InfoPage from "@/components/InfoPage";

export const metadata: Metadata = { title: "Terms of use", description: "The terms for using the Videh website." };

export default function TermsPage() {
  return <InfoPage eyebrow="Terms" title="Terms of use." intro="The simple rules for using Videh.">
    {/* Draft text. Have it reviewed by a legal professional before launch. */}
    <div className="info-prose">
      <h2>Using Videh</h2>
      <p>Videh helps you discover marriage halls and send enquiries. By using the site you agree to use it lawfully and to give accurate information.</p>
      <h2>Listings and availability</h2>
      <p>Listings are provided by or on behalf of properties. Availability, prices and facilities can change, and are confirmed by the property.</p>
      <h2>Enquiries</h2>
      <p>Videh does not take bookings or payments. Your event is arranged directly between you and the hall. See <Link href="/policies">how enquiries work</Link>.</p>
      <h2>Responsibility</h2>
      <p>We take care to keep information accurate, but we cannot guarantee it is always complete or up to date. Videh is not responsible for the services a property provides.</p>
      <h2>Changes</h2>
      <p>We may update these terms from time to time. Continuing to use Videh means you accept the updated terms.</p>
      <h2>Questions</h2>
      <p>If you have questions about these terms, please <Link href="/contact">contact us</Link>.</p>
    </div>
  </InfoPage>;
}
