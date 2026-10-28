import { BUSINESS as B } from "@/lib/business";

export default function BusinessDetails({ className = "" }: { className?: string }) {
  return <section className={`business-card ${className}`} aria-label="Business details">
    <h3>Business details</h3>
    <dl>
      <div><dt>Trade name</dt><dd>{B.tradeName}</dd></div>
      <div><dt>Registered under</dt><dd>{B.legalName} ({B.constitution})</dd></div>
      <div className="gstin-row"><dt>GSTIN</dt><dd><strong>{B.gstin}</strong></dd></div>
      <div><dt>Registered address</dt><dd>{B.addressLines.map(l => <span key={l}>{l}<br /></span>)}</dd></div>
      <div><dt>Email</dt><dd><a href={`mailto:${B.email}`}>{B.email}</a></dd></div>
    </dl>
  </section>;
}
