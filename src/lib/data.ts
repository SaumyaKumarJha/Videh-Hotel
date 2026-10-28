export type Category = "hotel" | "restaurant" | "banquet";

export type Property = {
  id: string;
  name: string;
  category: Category;
  city: string;
  area: string;
  price: number;
  rating: number;
  reviews: number;
  image: string;
  gallery?: string[];
  tag?: string;
  description: string;
  amenities: string[];
  /** Wedding details (banquets): guest capacity and which ceremonies the venue suits */
  capacity?: string;
  functions?: string[];
  /** Stays/dining: how the place helps a wedding party */
  weddingNote?: string;
};

export const properties: Property[] = [
  // THE venue. Edit the details below. Price and capacity are left out on purpose until you add the real numbers:
  // set `price: 12345` (starting package, in rupees) and `capacity: "200–600 guests"` and they appear on the site automatically.
  {
    id: "videh-hall", name: "Hotel Videh & Marriage Hall", category: "banquet", city: "Madhubani", area: "Ranti Road",
    price: 0, rating: 0, reviews: 0,
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=75",
    gallery: [
      "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=75",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=75",
    ],
    description: "Hotel Videh & Marriage Hall is a marriage hall and hotel on Ranti Road, Madhubani, Bihar — a place to bring the whole family together for tilak, haldi, vivah and reception.",
    amenities: ["Marriage hall", "Hotel stay for guests"],
    functions: ["Tilak", "Haldi & Matkor", "Vivah", "Reception", "Chaturthi"],
  },
];

/** The one venue this site is about. */
export const HALL = properties[0];

import photos from "./photos.generated.json";
// Real photos dropped into public/halls/<id>/ replace the stock image (see public/halls/README.txt).
properties.forEach(p => { const g = (photos as Record<string, string[]>)[p.id]; if (g && g.length) { p.image = g[0]; p.gallery = g; } });

export const categoryLabel = (category: string) =>
  category === "hotel" ? "Guest stays" : category === "restaurant" ? "Bhoj & catering" : "Marriage halls";

export const money = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);

/** "200–600 guests" → { min: 200, max: 600 } */
export const capacityRange = (capacity?: string) => {
  const n = (capacity || "").replace(/,/g, "").match(/\d+/g)?.map(Number) || [];
  return n.length ? { min: n[0], max: n[n.length - 1] } : null;
};

/** Number of guests → the matching option in the enquiry form */
export const guestBucket = (guests?: string | number) => {
  const g = Number(guests);
  if (!g) return undefined;
  return g < 100 ? "Under 100" : g <= 200 ? "100–200" : g <= 300 ? "200–300" : g <= 500 ? "300–500" : g <= 800 ? "500–800" : "800+";
};
