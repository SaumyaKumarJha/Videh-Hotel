import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

// The rituals of a Mithila wedding, and what each one needs from Videh.
const rituals = [
  { dev: "तिलक", name: "Tilak", text: "The bride’s family formally welcomes the groom — a gathering for both families.", fn: "Tilak", hue: "haldi" },
  { dev: "मटकोर", name: "Matkor & Haldi", text: "Songs, turmeric and the women of the family.", fn: "Haldi & Matkor", hue: "marigold" },
  { dev: "बारात", name: "Baraat", text: "The groom’s procession arrives, and the two families meet.", fn: "Vivah", hue: "leaf" },
  { dev: "सिंदूरदान", name: "Vivah & Sindurdan", text: "Kanyadaan under the mandap and sindoor at the auspicious moment — the heart of the night.", fn: "Vivah", hue: "sindoor" },
  { dev: "भोज", name: "Bhoj & Reception", text: "The feast for every guest, with the whole family at the table.", fn: "Reception", hue: "pink" },
  { dev: "चतुर्थी", name: "Chaturthi", text: "The rituals of the fourth day, with close family.", fn: "Chaturthi", hue: "maroon" },
];

export default function WeddingRituals() {
  return <section className="rituals-section" id="rituals">
    <div className="container">
      <div className="section-heading"><div><div className="eyebrow">विवाह के विधि · The rituals</div><h2>Your wedding, <em>ritual by ritual.</em></h2></div><p>A Mithila wedding is many ceremonies, not one evening.<br />Tell us which ones you need.</p></div>
      <ol className="ritual-track">
        {rituals.map((r, n) => <li key={r.name} className={`ritual-card hue-${r.hue}`}>
          <span className="ritual-step">{String(n + 1).padStart(2, "0")}</span>
          <span className="ritual-dev" lang="hi">{r.dev}</span>
          <h3>{r.name}</h3>
          <p>{r.text}</p>
          <Link href={`/enquire?ceremony=${encodeURIComponent(r.fn)}`} className="ritual-link">Plan your {r.name.split(" ")[0]} <ArrowUpRight size={16} /></Link>
        </li>)}
      </ol>
    </div>
  </section>;
}
