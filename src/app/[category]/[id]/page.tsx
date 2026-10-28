import { redirect } from "next/navigation";

// Old per-venue links go to the hall page.
export default function Page() {
  redirect("/hall");
}
