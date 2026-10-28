# Videh redesign + frontend completion — how to apply
Copy everything in this folder into your project, keeping the same paths (overwrite when asked).
Files you already have that are NOT in this folder (BookingForm excepted, see below) stay as they are:
src/app/login/page.tsx, src/app/my-bookings/page.tsx, src/app/not-found.tsx, src/lib/data.ts, next.config.mjs.

NEW pages:   about, contact, faq, policies, privacy, terms, saved (+ sitemap.ts, robots.ts)
NEW parts:   theme.css, HeroCarousel, ImageSlider, SaveButton, Reviews, InfoPage, ContactForm, NewsletterForm, lib/saved.ts
UPDATED:     layout.tsx, page.tsx (home), hotels/restaurants/banquets page.tsx, [category]/[id]/page.tsx,
             Navbar, Footer, PropertyCard, PropertyListing, BookingForm, globals.css (font @import removed)
ADDED:       layout.tsx inside login/ and my-bookings/ (page titles only; they don't replace your page.tsx)

Before launch: replace placeholder email/phone on /contact, review the policy/privacy/terms text,
replace sample reviews and stock photos, and set NEXT_PUBLIC_SITE_URL to your real domain.
Run: npm install && npm run dev

Responsive: tested in Chromium at 360, 390, 768 (iPad), 1024 (iPad landscape) and 1366 (laptop) px on
Home, Stays, Stay detail, About, Contact, FAQ, Saved and Login. No sideways scrolling, no JavaScript errors.
