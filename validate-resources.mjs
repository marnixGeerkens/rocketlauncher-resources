import assert from 'node:assert/strict';
import { readFile, realpath } from 'node:fs/promises';
import { resolve, sep, basename } from 'node:path';
import { pathToFileURL } from 'node:url';

const text = (value, name, min = 3) => assert(typeof value === 'string' && value.trim().length >= min && !/^(todo|tbd|coming soon|placeholder)$/i.test(value.trim()), `${name}: useful text required`);
const date = value => /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString().slice(0, 10) === value;
const version = value => /^\d+\.\d+\.\d+(?:-[a-zA-Z0-9.-]+)?$/.test(value);
const normalize = value => value.replace(/\r\n/g, '\n');
export function safeUrl(value, internal = false) {
  assert(typeof value === 'string' && !/[\s\\\x00-\x1f]/.test(value), 'Invalid URL characters');
  if (internal && /^\/(?!\/)[a-zA-Z0-9/_-]*$/.test(value)) return;
  const url = new URL(value);
  assert(url.protocol === 'https:' && !url.username && !url.password && !url.port, 'Only public HTTPS URLs allowed');
  assert(!/^(localhost|[\d.]+$|\[)/.test(url.hostname) && url.hostname.includes('.') && !/\.(local|internal)$/.test(url.hostname), 'Private URL rejected');
}
export function noSecrets(value) {
  assert(!/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|\b(?:sk-(?:proj-)?[A-Za-z0-9_-]{24,}|gh[pousr]_[A-Za-z0-9]{30,}|AKIA[A-Z0-9]{16})\b|\b(?:api_key|access_token|password|secret)\s*[:=]\s*["']?[A-Za-z0-9_/-]{20,}/i.test(value), 'Potential secret in public resource');
}
export function downloadRelative(path) {
  assert(typeof path === 'string' && /^\/resources\/files\/[a-zA-Z0-9/_-]+\.(md|txt|json|yaml|yml)$/.test(path), 'Download must remain within /resources/files/');
  assert(!path.split('/').some(part => part === '..' || part === '.'), 'Download traversal');
  return path.slice('/resources/'.length);
}
export async function validateResources(catalog, resourcesDir = 'public/resources') {
  assert(catalog?.schemaVersion === 1 && Array.isArray(catalog.resources) && catalog.resources.length > 0, 'Catalog schemaVersion/resources invalid');
  noSecrets(JSON.stringify(catalog));
  const root = await realpath(resourcesDir); const ids = new Set(); const slugs = new Set(); const downloads = new Set();
  for (const resource of catalog.resources) {
    const name = resource.id || '<missing id>';
    assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(resource.id) && !ids.has(resource.id), `Invalid/duplicate ID: ${name}`); ids.add(resource.id);
    assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(resource.slug) && !slugs.has(resource.slug), `Invalid/duplicate slug: ${name}`); slugs.add(resource.slug);
    assert(version(resource.version) && date(resource.updated), `${name}: version/date invalid`);
    for (const field of ['type', 'useCase', 'compatibility', 'author', 'license']) text(resource[field], `${name}.${field}`);
    assert(Array.isArray(resource.platforms) && resource.platforms.length && new Set(resource.platforms).size === resource.platforms.length, `${name}: platforms required and unique`);
    resource.platforms.forEach(p => assert(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p), `${name}: invalid platform`));
    assert(Array.isArray(resource.sources) && resource.sources.length, `${name}: sources required`);
    for (const source of resource.sources) { safeUrl(source.url); for (const field of ['title', 'author', 'license']) text(source[field], `${name}.source.${field}`); }
    assert(['reviewed', 'tested', 'unverified', 'stale'].includes(resource.verification?.status) && date(resource.verification?.date), `${name}: verification status/date invalid`);
    text(resource.verification.details, `${name}.verification.details`, 20);
    assert(resource.translations?.en && resource.translations?.nl, `${name}: complete English and Dutch required`);
    for (const [locale, translation] of Object.entries(resource.translations)) {
      assert(/^[a-z]{2}(?:-[A-Z]{2})?$/.test(locale), `${name}: invalid locale`);
      for (const [field, min] of Object.entries({ title: 10, summary: 25, intro: 80, example: 25, outcome: 25, compatibility: 20 })) text(translation[field], `${name}.${locale}.${field}`, min);
      for (const [field, min] of [['steps', 2], ['limitations', 1]]) { assert(Array.isArray(translation[field]) && translation[field].length >= min, `${name}.${locale}.${field} incomplete`); translation[field].forEach(v => text(v, `${name}.${locale}.${field}`, 15)); }
    }
    assert(Array.isArray(resource.history) && resource.history.length, `${name}: version history required`);
    const versions = new Set();
    for (const item of resource.history) { assert(version(item.version) && date(item.date) && !versions.has(item.version), `${name}: history version/date invalid or duplicate`); versions.add(item.version); text(item.note, `${name}.history.note`, 10); }
    assert(resource.history.some(h => h.version === resource.version && h.date === resource.updated), `${name}: current version/date missing from history`);
    for (const field of ['tutorial', 'video']) if (resource[field]) { safeUrl(resource[field].url, true); text(resource[field].title, `${name}.${field}.title`); }
    if (resource.university) safeUrl(resource.university);
    if (resource.download) {
      assert(resource.license === 'MIT' && resource.author === 'RocketLauncher', `${name}: hosted downloads require approved original MIT material`);
      const relative = downloadRelative(resource.download.path);
      assert(!downloads.has(relative), `${name}: duplicate download path`); downloads.add(relative);
      assert(basename(relative) === resource.download.filename, `${name}: filename mismatch`);
      text(resource.download.content, `${name}.download.content`, 80);
      const file = await realpath(resolve(root, relative));
      assert(file.startsWith(root + sep), `${name}: download symlink escapes resource directory`);
      const actual = await readFile(file, 'utf8'); noSecrets(actual);
      assert.equal(normalize(actual), normalize(resource.download.content), `${name}: download bytes differ from catalog content`);
      if (relative.endsWith('.json')) JSON.parse(actual);
    }
  }
  return { resources: ids.size, translations: catalog.resources.reduce((n, r) => n + Object.keys(r.translations).length, 0), downloads: downloads.size };
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { console.log(JSON.stringify(await validateResources(JSON.parse(await readFile(process.argv[2] || 'public/resources/catalog.json', 'utf8')), process.argv[3] || 'public/resources'), null, 2)); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
