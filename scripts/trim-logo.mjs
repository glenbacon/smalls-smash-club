/**
 * Tight-crop logo.png by trimming edge pixels similar to transparency.
 * Fixes "can't trim closer in Photoshop" when semi-transparent / fringe pixels remain.
 *
 * Usage: npm run logo:trim
 * Backup: public/images/logo.pretrim.png (created once)
 */
import sharp from "sharp";
import { copyFileSync, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "public", "images", "logo.png");
const bak = path.join(root, "public", "images", "logo.pretrim.png");

const threshold = Number(process.env.TRIM_THRESHOLD || 38);

const before = await sharp(src).metadata();
if (!before.width || !before.height) {
  console.error("Could not read logo.png");
  process.exit(1);
}

if (!existsSync(bak)) {
  copyFileSync(src, bak);
  console.log("Backed up to public/images/logo.pretrim.png");
}

// Transparent-ish edge trim (threshold catches ghost / anti-alias pixels)
const buf = await sharp(src)
  .trim({
    background: { r: 0, g: 0, b: 0, alpha: 0 },
    threshold,
  })
  .png({ compressionLevel: 9, effort: 10 })
  .toBuffer();

const after = await sharp(buf).metadata();
console.log(`Trim threshold=${threshold}: ${before.width}×${before.height} → ${after.width}×${after.height}`);

await sharp(buf).toFile(src);
console.log("Wrote public/images/logo.png — update width/height in index.html and --header-logo-h in main.css if dimensions changed.");
