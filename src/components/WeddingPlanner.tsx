"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Users, UtensilsCrossed, Landmark, Flower2 } from "lucide-react";
import { properties, money } from "@/lib/data";

export const GUEST_STEPS = [50, 100, 150, 200, 300, 400, 500, 600, 800, 1000];
// Typical per-plate assumptions for the estimate. Adjust to your caterers' real rates.
const PLATES = [{ id: "simple", label: "Simple", rate: 450 }, { id: "classic", label: "Classic Maithil", rate: 750 }, { id: "grand", label: "Grand", rate: 1200 }];

// Typical decoration budgets — adjust to what decorators in your area charge.
const DECOR = [{ label: "Simple", amount: 25000 }, { label: "Classic", amount: 60000 }, { label: "Grand", amount: 150000 }];

const venues = properties.filter(p => p.category === "banquet");
const avgVenue = Math.round(venues.reduce((a, v) => a + v.price, 0) / Math.max(1, venues.length));

export default function WeddingPlanner() {
  const [gIdx, setGIdx] = useState(4);
  const [venueId, setVenueId] = useState("any");
  const [plate, setPlate] = useState("classic");
  const [meals, setMeals] = useState(2);
  const [decor, setDecor] = useState(1);
  const guests = GUEST_STEPS[gIdx];
  const venue = venues.find(v => v.id === venueId);
  const calc = useMemo(() => {
    const v = venue ? venue.price : avgVenue;
    const food = guests * (PLATES.find(p => p.id === plate)?.rate || 0) * meals;
    const stay = DECOR[decor].amount;
    return { v, food, stay, total: v + food + stay };
  }, [venue, guests, plate, meals, decor]);
  const pct = (n: number) => `${Math.max(2, (n / calc.total) * 100)}%`;
  const href = `/enquire?guests=${guests}${venue ? `&venue=${venue.id}` : ""}`;

  return <section className="planner-section" id="plan">
    <div className="container planner-grid">
      <div className="planner-intro">
        <div className="eyebrow">Wedding budget planner</div>
        <h2>How much will <em>the wedding</em> cost?</h2>
        <p>Move the sliders to get a rough budget for the marriage hall, the bhoj and decoration. Then send an enquiry for halls that fit it.</p>
        <ul className="planner-notes">
          <li>Venue prices are each venue’s starting package.</li>
          <li>Decoration amounts are typical ranges for mandap and stage décor.</li>
          <li>Per-plate rates are typical assumptions — your caterer will confirm.</li>
        </ul>
      </div>
      <div className="planner-card">
        <label className="planner-field"><span><Users size={17} /> Guests <strong>{guests}</strong></span>
          <input type="range" min={0} max={GUEST_STEPS.length - 1} value={gIdx} onChange={e => setGIdx(Number(e.target.value))} aria-valuetext={`${guests} guests`} />
        </label>
        <label className="planner-field"><span><Landmark size={17} /> Marriage hall</span>
          <select value={venueId} onChange={e => setVenueId(e.target.value)}>
            <option value="any">Not decided yet (average hall {money(avgVenue)})</option>
            {venues.map(v => <option key={v.id} value={v.id}>{v.name} — {money(v.price)}</option>)}
          </select>
        </label>
        <div className="planner-field"><span><UtensilsCrossed size={17} /> Bhoj style</span>
          <div className="planner-chips" role="radiogroup" aria-label="Bhoj style">{PLATES.map(p => <button type="button" key={p.id} role="radio" aria-checked={plate === p.id} className={plate === p.id ? "active" : ""} onClick={() => setPlate(p.id)}>{p.label}<small>{money(p.rate)}/plate</small></button>)}</div>
        </div>
        <div className="planner-row">
          <label className="planner-field"><span>Bhoj services <strong>{meals}</strong></span><input type="range" min={1} max={4} value={meals} onChange={e => setMeals(Number(e.target.value))} /></label>
          <label className="planner-field planner-span2"><span><Flower2 size={17} /> Decoration <strong>{DECOR[decor].label}</strong></span><input type="range" min={0} max={DECOR.length - 1} value={decor} onChange={e => setDecor(Number(e.target.value))} aria-valuetext={DECOR[decor].label} /></label>
        </div>
        <div className="planner-result" aria-live="polite">
          <div className="planner-total"><span>Estimated budget</span><strong>{money(calc.total)}</strong></div>
          <div className="planner-bar" aria-hidden="true"><i className="b-venue" style={{ width: pct(calc.v) }} /><i className="b-food" style={{ width: pct(calc.food) }} /><i className="b-stay" style={{ width: pct(calc.stay) }} /></div>
          <dl className="planner-split">
            <div><dt><i className="b-venue" />Hall</dt><dd>{money(calc.v)}</dd></div>
            <div><dt><i className="b-food" />Bhoj</dt><dd>{money(calc.food)}</dd></div>
            <div><dt><i className="b-stay" />Decoration</dt><dd>{money(calc.stay)}</dd></div>
          </dl>
          <Link className="button button-dark button-full" href={href}>{venue ? `Enquire at ${venue.name}` : `Get halls for ${guests} guests`} <ArrowRight size={17} /></Link>
          <p className="planner-disclaimer">A rough estimate only. Final prices and taxes are confirmed by each hall and caterer.</p>
        </div>
      </div>
    </div>
  </section>;
}
