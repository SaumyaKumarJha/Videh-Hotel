// Scans public/halls/<hall-id>/ for photos and writes src/lib/photos.generated.json.
// Drop your real photos into public/halls/<hall-id>/ (e.g. public/halls/madhurima-palace/1.jpg) and the site uses them automatically.
import fs from "node:fs";
import path from "node:path";
const root = path.resolve("public/halls");
const out = {};
if (fs.existsSync(root)) {
  for (const d of fs.readdirSync(root, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const files = fs.readdirSync(path.join(root, d.name)).filter(f => /\.(jpe?g|png|webp|avif)$/i.test(f)).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    if (files.length) out[d.name] = files.map(f => `/halls/${d.name}/${f}`);
  }
}
fs.mkdirSync("src/lib", { recursive: true });
fs.writeFileSync("src/lib/photos.generated.json", JSON.stringify(out, null, 2) + "\n");
console.log(`photos: ${Object.keys(out).length} hall folder(s) with photos`);
