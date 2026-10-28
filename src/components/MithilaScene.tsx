// Animated Mithila painting: every motif is its own moving piece, placed at a different depth.
// Pointer movement (set in CinemaHero) tilts the whole stage, so near pieces slide more than far ones — real 3D parallax.

type Mandala = { x: number; y: number; s: number; z: number; d: number; rev?: boolean; hideM?: boolean };
type Fish = { y: number; s: number; d: number; dl: number; img: string; left?: boolean; z: number; hideM?: boolean };

const MANDALAS: Mandala[] = [
  { x: 3, y: 8, s: 54, z: 70, d: 90 },
  { x: 97, y: 8, s: 54, z: 70, d: 90, rev: true },
  { x: 4, y: 96, s: 46, z: 40, d: 110, rev: true },
  { x: 96, y: 96, s: 46, z: 40, d: 110 },
  { x: -3, y: 52, s: 28, z: -50, d: 70, hideM: true },
  { x: 103, y: 52, s: 28, z: -50, d: 70, rev: true, hideM: true },
  { x: 50, y: -14, s: 36, z: -90, d: 130, hideM: true },
];
const FISH: Fish[] = [
  { y: 30, s: 15, d: 46, dl: -8, img: "red", z: 30 },
  { y: 36, s: 12, d: 54, dl: -26, img: "gold", z: 10, left: true },
  { y: 62, s: 13, d: 60, dl: -40, img: "indigo", z: 50, left: true },
  { y: 74, s: 16, d: 50, dl: -18, img: "red", z: 20, hideM: true },
  { y: 48, s: 10, d: 70, dl: -55, img: "gold", z: -30, hideM: true },
  { y: 86, s: 11, d: 64, dl: -5, img: "indigo", z: 0, left: true, hideM: true },
];
const PETALS = Array.from({ length: 16 }, (_, i) => ({
  x: (i * 37 + 11) % 100, s: 2.4 + ((i * 7) % 5) * 0.5, d: 16 + ((i * 5) % 11), dl: -((i * 3.7) % 22),
  img: (["green", "pink", "gold"] as const)[i % 3], z: 60 + ((i * 13) % 80), hideM: i % 2 === 1,
}));
const SPARKS = Array.from({ length: 18 }, (_, i) => ({ x: (i * 53 + 7) % 100, y: (i * 29 + 13) % 100, d: 2.4 + (i % 4) * 0.8, dl: -(i % 5) }));

export default function MithilaScene() {
  return (
    <div className="ms" aria-hidden="true">
      <div className="ms-stage">
        {SPARKS.map((p, i) => <i key={"s" + i} className="ms-spark" style={{ left: `${p.x}%`, top: `${p.y}%`, animationDuration: `${p.d}s`, animationDelay: `${p.dl}s` }} />)}
        {MANDALAS.map((m, i) => (
          <div key={"m" + i} className={`ms-o ms-mandala ${m.hideM ? "hide-m" : ""}`} style={{ left: `${m.x}%`, top: `${m.y}%`, ["--s" as any]: m.s, ["--z" as any]: `${m.z}px` }}>
            <div className="ms-a" style={{ animationDuration: `${m.d}s`, animationDirection: m.rev ? "reverse" : "normal" }}><img src="/ms-mandala.svg" alt="" /></div>
          </div>
        ))}
        <div className="ms-o ms-vine ms-vine-top" style={{ ["--z" as any]: "20px" }}><div className="ms-a"><img src="/ms-vine.svg" alt="" /></div></div>
        <div className="ms-o ms-vine ms-vine-bottom" style={{ ["--z" as any]: "20px" }}><div className="ms-a"><img src="/ms-vine.svg" alt="" /></div></div>
        {FISH.map((f, i) => (
          <div key={"f" + i} className={`ms-o ms-fish ${f.hideM ? "hide-m" : ""}`} style={{ top: `${f.y}%`, ["--s" as any]: f.s, ["--z" as any]: `${f.z}px` }}>
            <div className={`ms-a ${f.left ? "swim-l" : "swim-r"}`} style={{ animationDuration: `${f.d}s`, animationDelay: `${f.dl}s` }}>
              <div className={f.left ? "ms-flip" : ""}><img src={`/ms-fish-${f.img}.svg`} alt="" /></div>
            </div>
          </div>
        ))}
        {PETALS.map((p, i) => (
          <div key={"p" + i} className={`ms-o ms-petal ${p.hideM ? "hide-m" : ""}`} style={{ left: `${p.x}%`, ["--s" as any]: p.s, ["--z" as any]: `${p.z}px` }}>
            <div className="ms-a" style={{ animationDuration: `${p.d}s`, animationDelay: `${p.dl}s` }}><img src={`/ms-leaf-${p.img}.svg`} alt="" /></div>
          </div>
        ))}
      </div>
    </div>
  );
}
