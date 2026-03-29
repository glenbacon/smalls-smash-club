/**
 * Raster favicons from public/images/logo.png (site bg #050507).
 * Run: node scripts/generate-favicon.mjs
 */
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const logo = join(root, "public/images/logo.png");
const bg = { r: 5, g: 5, b: 7, alpha: 1 };

async function squarePng(outName, size) {
  await sharp(logo)
    .resize(size, size, { fit: "contain", background: bg })
    .png()
    .toFile(join(root, "public", outName));
}

await squarePng("favicon-32.png", 32);
await squarePng("apple-touch-icon.png", 180);
console.log("Wrote public/favicon-32.png, public/apple-touch-icon.png");
