// Entry 9 — GTA 6 meme bounty (make.fun gta6-meme-x-01)
//
// Program ini adalah bagian dari bukti kerja entry: ia membaca file
// POST.json dari root repo, memeriksa bahwa URL di dalamnya adalah URL
// post X yang valid, lalu menyalin POST.json dan meme.png ke direktori
// output yang dipakai harness make.fun.
//
// Hanya memakai standard library Node 22, tanpa akses jaringan.

// Utilitas file bawaan Node: baca/tulis file dan kelola direktori.
import { copyFileSync, existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

// Direktori kerja bot dan direktori output dibaca dari environment,
// dengan nilai default yang dipakai harness make.fun.
const botDir = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const outputDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Ambil dan parse POST.json. File ini wajib ada di root repo.
const postPath = join(botDir, "POST.json");
let post: unknown;
try {
  post = JSON.parse(readFileSync(postPath, "utf8"));
} catch (error) {
  console.error(`Gagal membaca atau mem-parse ${postPath}:`, error);
  process.exit(1);
}

// Validasi: url harus berupa tautan status X yang lengkap, bukan sekadar
// alamat di domain x.com. Polanya: https://x.com/<handle>/status/<id>,
// di mana handle hanya boleh huruf, angka, dan underscore, dan id hanya
// boleh digit, tanpa tambahan apa pun setelahnya. Pemeriksaan ketat ini
// ada supaya bukti entry benar-benar menunjuk ke satu post spesifik —
// tautan ke halaman profil atau halaman lain di x.com tidak cukup
// membuktikan post yang dimaksud, dan URL di luar x.com jelas bukan
// post X sama sekali.
const url = (post as { url?: unknown }).url;
const statusUrlPattern = /^https:\/\/x\.com\/[A-Za-z0-9_]+\/status\/[0-9]+$/;

if (typeof url !== "string" || !statusUrlPattern.test(url)) {
  console.error(
    "POST.json tidak valid: field \"url\" harus berupa tautan status X yang lengkap, contohnya https://x.com/<handle>/status/<id> (handle hanya huruf, angka, dan underscore; id hanya digit; tidak boleh ada tambahan setelah id).",
  );
  process.exit(1);
}

// Pastikan direktori output ada, lalu salin kedua file bukti ke sana.
mkdirSync(outputDir, { recursive: true });
copyFileSync(postPath, join(outputDir, "POST.json"));
copyFileSync(join(botDir, "meme.png"), join(outputDir, "meme.png"));

console.log(`OK: entry 9 diverifikasi untuk ${url}`);
