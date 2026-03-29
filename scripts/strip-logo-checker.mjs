/**
 * Adobe Express traced the transparency grid as gray vector tiles.
 * Drop paths that are neutral gray with mid luminance (checker squares).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const src = path.join(root, "Adobe Express 2026-03-28 11.50.09.svg");

const s = fs.readFileSync(src, "utf8");

const pathRe =
  /<path fill="(#[0-9A-Fa-f]{6})" opacity="[^"]*" stroke="none"\s+d="\s*[\s\S]*?z"\s*\/>/gi;

/** Whites used in lettering / highlights — never strip */
const KEEP_LIGHT = new Set([
  "#F9F9F9",
  "#F5F5F5",
  "#FFFFFF",
  "#FAFAFA",
  "#FCFCFC",
  "#FEFEFE",
]);

function shouldRemoveFill(hex) {
  const h = hex.toUpperCase();
  if (KEEP_LIGHT.has(h)) return false;

  const r = parseInt(h.slice(1, 3), 16);
  const g = parseInt(h.slice(3, 5), 16);
  const b = parseInt(h.slice(5, 7), 16);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max - min;
  const lum = (r + g + b) / 3;

  if (sat > 24) return false;

  // Dark / black tiles
  if (lum < 30) return false;

  // Mid gray checker squares
  if (lum >= 30 && lum <= 215) return true;

  // Light gray checker squares (not pure white text)
  if (sat <= 20 && lum >= 175 && lum <= 248) return true;

  return false;
}

let removed = 0;
let kept = 0;

let out = s.replace(pathRe, (full, fill) => {
  if (shouldRemoveFill(fill)) {
    removed++;
    return "";
  }
  kept++;
  return full;
});

/**
 * Black disc behind the mark is 1–2 massive paths. Smaller #100E0B / #100805 paths
 * are letter counters (holes) — removing those turned the type into solid blobs.
 */
const BADGE_FILL = new Set(["#100E0B", "#100805"]);
const BADGE_MIN_D_LEN = 8000;

const pathReWithD =
  /<path fill="(#[0-9A-Fa-f]{6})" opacity="[^"]*" stroke="none"\s+d="\s*([\s\S]*?)z"\s*\/>/gi;

let removedBadge = 0;
out = out.replace(pathReWithD, (full, fill, dInner) => {
  const h = fill.toUpperCase();
  if (!BADGE_FILL.has(h) || dInner.length < BADGE_MIN_D_LEN) return full;
  removedBadge++;
  return "";
});

const cleaned = out.replace(/\n{3,}/g, "\n\n");

const dest = path.join(root, "public", "images", "logo-transparent.svg");
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, cleaned);

console.log(
  JSON.stringify(
    { kept, removed, removedBadge, outBytes: cleaned.length, dest },
    null,
    2
  )
);
