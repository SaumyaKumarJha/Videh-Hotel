import Link from "next/link";
export default function NotFound() {
  return <div className="not-found container"><div className="eyebrow">A LITTLE DETOUR</div><h1>This page wandered off.</h1><p>We couldn’t find the place you were looking for. Let’s find another one.</p><Link href="/" className="button button-dark">Back to Videh →</Link></div>;
}
