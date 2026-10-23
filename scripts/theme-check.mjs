#!/usr/bin/env node
/**
 * Runs Shopify's own Theme Check over the gridium/ theme and prints offenses.
 * Usage: npm run theme:check
 */
import { fileURLToPath } from 'node:url';
import { check } from '@shopify/theme-check-node';

const root = fileURLToPath(new URL('../gridium', import.meta.url));
const offenses = await check(root);

const counts = new Map();
for (const offense of offenses) counts.set(offense.check, (counts.get(offense.check) || 0) + 1);

const sevName = (severity) => (severity === 1 || severity === 'error' ? 'error' : 'warn');

console.log(`\nTheme Check — ${offenses.length} offense(s)`);
for (const [name, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
  console.log(`  ${String(count).padStart(3)} × ${name}`);
}

const shown = offenses.slice(0, 80);
for (const offense of shown) {
  const uri = String(offense.uri || '').replace(/^.*\/gridium\//, '');
  const range = offense.start ? `${offense.start.line + 1}:${offense.start.character + 1}` : '';
  console.log(`\n[${sevName(offense.severity)}] ${offense.check} — ${uri}:${range}\n  ${offense.message}`);
}
if (offenses.length > shown.length) console.log(`\n… ${offenses.length - shown.length} more`);
process.exit(offenses.some((o) => o.severity === 1 || o.severity === 'error') ? 1 : 0);
