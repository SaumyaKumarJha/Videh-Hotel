# Videh frontend

Responsive Next.js starter for Videh, a Mithila-inspired discovery and booking platform for stays, restaurants, and banquet halls.

## Run locally
1. Install Node.js 18.17+.
2. Open this folder in VS Code / Cursor.
3. Run `npm install`
4. Run `npm run dev`
5. Open http://localhost:3000

## Included
- Responsive sticky navbar and mobile menu
- Homepage with search tabs, hero, horizontal discovery rails, offers and Mithila-inspired decorative styling
- Hotels, restaurants and banquet listings with category search and filters
- Property detail routes (`/hotels/[id]`, `/restaurants/[id]`, `/banquets/[id]`)
- Booking form with client-side validation and calculated summary
- Login and account booking-history demo screens
- Mock data in `src/lib/data.ts`
- No backend or real payment processing is connected yet

## Before production
Connect the UI to a backend for inventory/availability, authentication, payment gateway, booking persistence, transactional email/SMS, reviews, and admin/property-owner tools. Replace demo photos with licensed property photography and configure real policies/pricing.

## Brand asset
The supplied Videh geometric gold logomark is stored at `public/videh-logo.png` and used in the navbar and footer.

## Mithila visual identity
The UI uses `public/mithila-pattern.svg` as a custom folk-art motif across the hero, intro panel, cultural band, and listing headings. Adjust its colors and motifs to refine the brand language.
