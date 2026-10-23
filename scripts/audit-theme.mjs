#!/usr/bin/env node
/**
 * Gridium theme audit
 * -------------------
 * Static checks that catch the failures which break a Shopify upload:
 *   - invalid JSON in config / locales / templates
 *   - template references to sections that do not exist
 *   - `{% render %}` / `{% section %}` / asset_url references to missing files
 *   - section settings referenced in Liquid but missing from the schema
 *   - unknown global settings and missing translation keys
 *
 * Usage: npm run theme:audit
 */
import fs from 'node:fs';
import path from 'node:path';

const ROOT = 'gridium';
const errors = [];
const warnings = [];

const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });

const rel = (file) => file.slice(ROOT.length + 1);
const files = walk(ROOT);

/* ---------------------------------------------------------------- JSON */
for (const file of files.filter((f) => f.endsWith('.json'))) {
  try {
    JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    errors.push(`Invalid JSON — ${rel(file)}: ${error.message}`);
  }
}

/* ------------------------------------------------------------ Inventory */
const names = (dir) =>
  new Set(
    files
      .filter((f) => f.startsWith(path.join(ROOT, dir) + path.sep))
      .map((f) => path.basename(f).replace(/\.liquid$/, ''))
  );

const sections = names('sections');
const snippets = names('snippets');
const assets = new Set(files.filter((f) => f.startsWith(path.join(ROOT, 'assets') + path.sep)).map((f) => path.basename(f)));

/* ------------------------------------------------------- Liquid scanning */
for (const file of files.filter((f) => f.endsWith('.liquid'))) {
  const source = fs.readFileSync(file, 'utf8');

  for (const match of source.matchAll(/\{%-?\s*render\s+'([^']+)'/g)) {
    if (!snippets.has(match[1])) errors.push(`Missing snippet "${match[1]}" — ${rel(file)}`);
  }
  for (const match of source.matchAll(/\{%-?\s*section\s+'([^']+)'/g)) {
    if (!sections.has(match[1])) errors.push(`Missing section "${match[1]}" — ${rel(file)}`);
  }
  for (const match of source.matchAll(/'([\w.-]+\.(?:css|js|png|jpe?g|svg|webp|woff2?))'\s*\|\s*asset_url/g)) {
    if (!assets.has(match[1])) errors.push(`Missing asset "${match[1]}" — ${rel(file)}`);
  }

  const schemaMatch = source.match(/\{%\s*schema\s*%\}([\s\S]*?)\{%\s*endschema\s*%\}/);
  if (!schemaMatch) continue;

  let schema;
  try {
    schema = JSON.parse(schemaMatch[1]);
  } catch {
    continue; // already reported by the JSON pass
  }

  const known = new Set();
  for (const setting of schema.settings || []) if (setting.id) known.add(setting.id);
  for (const block of schema.blocks || []) for (const setting of block.settings || []) if (setting.id) known.add(setting.id);

  for (const match of source.matchAll(/(?<![\w.])section\.settings\.(\w+)/g)) {
    if (!known.has(match[1])) errors.push(`Unknown section setting "${match[1]}" — ${rel(file)}`);
  }
}

/* ------------------------------------------------- JSON template wiring */
for (const file of files.filter((f) => f.includes(`templates${path.sep}`) && f.endsWith('.json'))) {
  const template = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const [id, section] of Object.entries(template.sections || {})) {
    if (!sections.has(section.type)) errors.push(`Template ${rel(file)} → section "${section.type}" (${id}) not found`);
  }
}

/* ------------------------------------------------------ Global settings */
const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/settings_schema.json'), 'utf8'));
const globalIds = new Set();
for (const group of schema) for (const setting of group.settings || []) if (setting.id) globalIds.add(setting.id);

for (const file of files.filter((f) => f.endsWith('.liquid'))) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(/(?<![\w.])(?<!section\.)(?<!block\.)settings\.(\w+)/g)) {
    if (!globalIds.has(match[1])) errors.push(`Unknown global setting "settings.${match[1]}" — ${rel(file)}`);
  }
}

/* -------------------------------------------------------- Translations */
const locales = JSON.parse(fs.readFileSync(path.join(ROOT, 'locales/en.default.json'), 'utf8'));
const flatKeys = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([key, value]) =>
    value && typeof value === 'object' && !Array.isArray(value)
      ? [prefix + key, ...flatKeys(value, `${prefix}${key}.`)]
      : [prefix + key]
  );
const translationKeys = new Set(flatKeys(locales));

for (const file of files.filter((f) => f.endsWith('.liquid'))) {
  const source = fs.readFileSync(file, 'utf8');
  for (const match of source.matchAll(/'((?:[\w-]+\.)+[\w-]+)'\s*\|\s*t\b/g)) {
    if (!translationKeys.has(match[1])) errors.push(`Missing translation "${match[1]}" — ${rel(file)}`);
  }
}

/* ------------------------------------------------------ Zero-config glue */
const settingsData = JSON.parse(fs.readFileSync(path.join(ROOT, 'config/settings_data.json'), 'utf8'));
if (!settingsData.current) errors.push('config/settings_data.json is missing the required "current" object');
if (!settingsData.presets) warnings.push('config/settings_data.json has no "presets" object (Shopify expects one)');
if (!assets.has('logo.png')) errors.push('assets/logo.png is missing — the default brand lockup will not render');

/* --------------------------------------------------------------- Report */
const label = `${files.length} files · ${sections.size} sections · ${snippets.size} snippets · ${assets.size} assets`;
if (warnings.length) {
  console.log('\n⚠  Warnings');
  warnings.forEach((warning) => console.log(`   • ${warning}`));
}
if (errors.length) {
  console.error(`\n✗ ${errors.length} problem(s) found (${label})`);
  errors.forEach((error) => console.error(`   • ${error}`));
  process.exit(1);
}
console.log(`\n✓ Theme audit passed (${label})`);
