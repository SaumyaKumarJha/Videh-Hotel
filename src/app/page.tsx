import HomePage from "@/components/HomePage";
import { JsonLd, SITE_NAME, SITE_URL, pageMeta, venueSchema } from "@/lib/site";

export const metadata = pageMeta({
  title: "Marriage Hall in Madhubani | Hotel Videh & Marriage Hall",
  absolute: true,
  description: "Wedding venue and hotel on Ranti Road, Madhubani, Bihar, for tilak, haldi, vivah, reception and chaturthi. Send one enquiry for your date and we call you back.",
  path: "/",
});

export default function Page() {
  return <>
    <JsonLd data={[
      { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: SITE_NAME, url: `${SITE_URL}/`, inLanguage: "en-IN", publisher: { "@id": `${SITE_URL}/#venue` } },
      venueSchema(),
    ]} />
    <HomePage />
  </>;
}
