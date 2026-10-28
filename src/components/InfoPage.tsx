export default function InfoPage({ eyebrow, title, intro, children }: { eyebrow: string; title: string; intro: string; children: React.ReactNode }) {
  return <div className="info-page">
    <section className="listing-heading container"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{intro}</p></section>
    <section className="container info-body">{children}</section>
  </div>;
}
