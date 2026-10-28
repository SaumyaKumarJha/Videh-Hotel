"use client";
import { Heart } from "lucide-react";
import { useSaved } from "@/lib/saved";

export default function SaveButton({ id }: { id: string }) {
  const { isSaved, toggle } = useSaved();
  const saved = isSaved(id);
  return <button type="button" className={`save-pill ${saved ? "is-saved" : ""}`} onClick={() => toggle(id)} aria-pressed={saved}>
    <Heart size={17} fill={saved ? "currentColor" : "none"} /> {saved ? "Saved" : "Save this place"}
  </button>;
}
