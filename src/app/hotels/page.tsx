import { redirect } from "next/navigation";

// This site is now a single-venue site. Old links go to the hall page.
export default function Page() {
  redirect("/hall");
}
