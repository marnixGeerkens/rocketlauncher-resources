import { readFile, realpath } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = await realpath(fileURLToPath(new URL('.', import.meta.url)));
const manifest = JSON.parse(await readFile(resolve(root, 'checksums.json'), 'utf8'));
const seen = new Set();
for (const file of manifest.files) {
  if (!file.path || file.path.startsWith('/') || file.path.includes('\\') || file.path.split('/').some(p => !p || p === '.' || p === '..') || seen.has(file.path)) throw new Error('Invalid manifest path');
  seen.add(file.path);
  const target = await realpath(resolve(root, file.path));
  if (!target.startsWith(root + sep)) throw new Error('File outside package');
  const bytes = await readFile(target);
  if (bytes.length !== file.bytes || createHash('sha256').update(bytes).digest('hex') !== file.sha256) throw new Error(`Integrity mismatch: ${file.path}`);
}
console.log(`Verified ${seen.size} package files. Imported content was not executed.`);
