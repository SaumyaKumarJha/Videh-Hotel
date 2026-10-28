import { redirect } from "next/navigation";
// Online booking has been replaced by enquiries. Old links land on the enquiry form.
export default function MyBookingsPage() { redirect("/enquire"); }
