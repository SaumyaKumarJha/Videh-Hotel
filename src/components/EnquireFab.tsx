"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquareHeart } from "lucide-react";

// Floating "Enquire" button for phones. Hidden where a form or enquiry bar is already on screen.
export default function EnquireFab() {
  const path = usePathname();
  if (path.startsWith("/enquire") || path.startsWith("/hall")) return null;
  return <Link href="/enquire" className="enquire-fab"><MessageSquareHeart size={20} /> Enquire now</Link>;
}
