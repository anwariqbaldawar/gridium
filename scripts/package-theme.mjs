#!/usr/bin/env node
/**
 * Gridium theme packager
 * ----------------------
 * Produces a Shopify-upload-ready .zip whose root contains exactly the theme
 * directories (assets/, config/, layout/, locales/, sections/, snippets/,
 * templates/) — the structure required by
 * Admin → Online Store → Themes → Add theme → Upload zip file.
 *
 * Usage: npm run theme:zip [-- --out release]
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import JSZip from 'jszip';

const THEME_DIR = 'gridium';
const OUT_DIR = process.argv.includes('--out')
  ? process.argv[process.argv.indexOf('--out') + 1]
  : 'release';
const THEME_DIRS = ['assets', 'config', 'layout', 'locales', 'sections', 'snippets', 'templates'];

const settings = JSON.parse(fs.readFileSync(path.join(THEME_DIR, 'config/settings_data.json'), 'utf8'));
const schema = JSON.parse(fs.readFileSync(path.join(THEME_DIR, 'config/settings_schema.json'), 'utf8'));
const version = schema[0]?.theme_version || '1.1.0';
const zipName = `gridium-shopify-theme-v${version}.zip`;

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const files = [];
for (const dir of THEME_DIRS) {
  const absolute = path.join(THEME_DIR, dir);
  if (!fs.existsSync(absolute)) {
    console.error(`✗ Missing required theme directory: ${dir}/`);
    process.exit(1);
  }
  for (const file of walk(absolute)) files.push(file);
}

/* Validation gate before packaging */
for (const file of files.filter((f) => f.endsWith('.json'))) {
  try {
    JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    console.error(`✗ Refusing to package: invalid JSON in ${file}\n  ${error.message}`);
    process.exit(1);
  }
}

const zip = new JSZip();
let bytes = 0;
for (const file of files) {
  const buffer = fs.readFileSync(file);
  bytes += buffer.length;
  // Paths must be relative to the theme root inside the archive
  const archivePath = path.relative(THEME_DIR, file).split(path.sep).join('/');
  zip.file(archivePath, buffer);
}

fs.mkdirSync(OUT_DIR, { recursive: true });
const outPath = path.join(OUT_DIR, zipName);
const content = await zip.generateAsync({
  type: 'nodebuffer',
  compression: 'DEFLATE',
  compressionOptions: { level: 9 },
  platform: 'UNIX',
});
fs.writeFileSync(outPath, content);

const hash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
const kb = (n) => `${(n / 1024).toFixed(1)} KB`;

console.log(`\n✓ Shopify theme packaged: ${outPath}`);
console.log(`  version   : v${version}`);
console.log(`  files     : ${files.length} across ${THEME_DIRS.length} directories`);
console.log(`  source    : ${kb(bytes)} → zip ${kb(content.length)}`);
console.log(`  sha256    : ${hash}`);
console.log(`  presets   : ${Object.keys(settings.presets || {}).join(', ') || '—'}`);
console.log('\n  Upload: Shopify Admin → Online Store → Themes → Add theme → Upload zip file\n');
