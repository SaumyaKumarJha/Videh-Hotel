import { Star } from "lucide-react";
import type { Property } from "@/lib/data";

// Sample content for the demo. Replace with real guest reviews once a backend is connected.
const sample = [
  { who: "Family from Madhubani", when: "Recent stay", text: "Warm, helpful staff and a clean, comfortable space. Easy to find and good value." },
  { who: "Family visit", when: "Recent visit", text: "Everything was well organised and the team went out of their way to help us." },
  { who: "Family from Jhanjharpur", when: "Recent visit", text: "A good local experience. We would come back and recommend it to friends." },
];

export default function Reviews({ property }: { property: Property }) {
  return <div className="detail-section reviews">
    <h3>What guests say</h3>
    <div className="reviews-summary"><strong>{property.rating}</strong><span className="stars">{[1, 2, 3, 4, 5].map(n => <Star key={n} size={18} fill={n <= Math.round(property.rating) ? "currentColor" : "none"} />)}</span><small>{property.reviews} reviews</small></div>
    <div className="reviews-list">{sample.map(r => <figure key={r.who}><blockquote>{r.text}</blockquote><figcaption>{r.who} · {r.when}</figcaption></figure>)}</div>
    <p className="reviews-note">Sample reviews shown for the demo.</p>
  </div>;
}
