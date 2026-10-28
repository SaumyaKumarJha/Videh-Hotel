import { redirect } from "next/navigation";

// Visitors don't need an account on this site. Staff sign in at /admin.
export default function LoginPage() {
  redirect("/");
}
