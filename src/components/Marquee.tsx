const words = ["तिलक", "Haldi", "मटकोर", "Baraat", "सिंदूरदान", "Vivah", "भोज", "Reception", "चतुर्थी"];
export default function Marquee() {
  const row = <>{words.map(w => <span key={w}>{w}<i aria-hidden="true" /></span>)}</>;
  return <div className="marquee" aria-hidden="true"><div className="marquee-track">{row}{row}{row}{row}</div></div>;
}
