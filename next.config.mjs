const isProd = process.env.NODE_ENV === "production";

// Security headers. The Content-Security-Policy only allows what the site really uses:
// its own files, Supabase (enquiry form), Google Maps (the map), and the placeholder photos from Unsplash.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isProd ? "" : " 'unsafe-eval'"}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://images.unsplash.com https://*.google.com https://*.gstatic.com https://*.googleapis.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co" + (isProd ? "" : " ws://localhost:* http://localhost:*"),
  "frame-src https://www.google.com https://maps.google.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
];

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: { unoptimized: true },
  poweredByHeader: false,
  async headers() { return [{ source: "/:path*", headers: securityHeaders }]; },
  // Old listing-site addresses now point permanently (308) to the single hall, so search engines pass their value on.
  async redirects() {
    return [
      { source: "/:old(hotels|restaurants|banquets|saved)", destination: "/hall", permanent: true },
      { source: "/:cat(hotels|hotel|restaurants|restaurant|banquets|banquet|halls)/:id", destination: "/hall", permanent: true },
      { source: "/my-bookings", destination: "/enquire", permanent: true },
      { source: "/login", destination: "/", permanent: true },
    ];
  },
};
export default nextConfig;
