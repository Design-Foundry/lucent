// Writes dist/lucent/api.json: every selector of the Angular kit with its inputs, models and
// outputs, read from the source so defaults survive. Runs after `ng build lucent`.
import { existsSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const KIT_DIR = join(root, "packages", "angular", "src");
const OUT = join(root, "dist", "lucent", "api.json");

if (!existsSync(dirname(OUT))) {
  console.error(`${dirname(OUT)} not found; run ng build lucent first`);
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const sources = walk(KIT_DIR).filter((f) => f.endsWith('.ts') && !f.endsWith('.spec.ts'));
const text = new Map(sources.map((f) => [f, readFileSync(f, 'utf8')]));

// String-literal union aliases (`export type ControlSize = 'xs' | 'sm' | …`) so tables show the values.
const aliases = new Map();
for (const src of text.values()) {
  for (const m of src.matchAll(/export type (\w+)(?:<[^>]*>)?\s*=\s*([^;]+);/g)) {
    const body = m[2].replace(/\s+/g, ' ').trim();
    if (/^('[^']*'\s*\|?\s*)+$/.test(body)) aliases.set(m[1], body.replace(/'/g, ''));
  }
}
const expand = (t) => (t ? t.replace(/\b[A-Z]\w+\b/g, (n) => aliases.get(n) ?? n) : t);

function inferType(def) {
  if (def === undefined || def === '') return 'unknown';
  if (/^['"`]/.test(def)) return 'string';
  if (/^-?\d/.test(def)) return 'number';
  if (def === 'true' || def === 'false') return 'boolean';
  if (def.startsWith('[')) return 'array';
  return 'unknown';
}

function members(body) {
  const out = [];
  const re = /(?:\/\*\*([\s\S]*?)\*\/\s*)?readonly\s+(\w+)\s*=\s*(input|model|output)(\.required)?\s*(?:<([^>]*(?:<[^>]*>[^>]*)?)>)?\(((?:[^()]|\(\))*)\)/g;
  for (const m of body.matchAll(re)) {
    const [, doc, name, kind, required, genericRaw, argsRaw] = m;
    const generic = genericRaw?.replace(/'/g, '');
    const args = argsRaw.trim();
    const alias = /alias:\s*'([^']+)'/.exec(args)?.[1];
    const boolean = /booleanAttribute/.test(args);
    const def = kind === 'output' || required ? undefined : args.split(/,\s*\{/)[0].trim() || undefined;
    const desc = doc ? doc.replace(/^\s*\*\s?/gm, '').replace(/\s+/g, ' ').trim() : '';
    out.push({
      name: alias ?? name,
      kind,
      type: kind === 'output' ? expand(generic) || 'void' : boolean ? 'boolean' : expand(generic) || inferType(def),
      default: def === undefined ? null : def.replace(/^'(.*)'$/, '$1'),
      required: !!required,
      desc,
    });
  }
  // Decorator inputs: `@Input('alias') name = 'x';` / `@Input() name: Type = 'x';`
  for (const m of body.matchAll(/@Input\((?:'([^']+)')?\)\s*(\w+)(?:\s*:\s*([\w<>\[\] |']+?))?\s*=\s*([^;]+);/g)) {
    const [, alias, name, type, def] = m;
    out.push({
      name: alias ?? name,
      kind: 'input',
      type: expand(type?.trim()) || inferType(def.trim()),
      default: def.trim().replace(/^'(.*)'$/, '$1'),
      required: false,
      desc: '',
    });
  }
  return out;
}

const api = [];
for (const [file, src] of text) {
  const re = /@(Component|Directive)\(\{([\s\S]*?)\}\)\s*export class (\w+)(?:<[^>]*>)?[^{]*\{/g;
  const decls = [...src.matchAll(re)];
  decls.forEach((m, i) => {
    const selector = /selector:\s*'([^']+)'/.exec(m[2])?.[1];
    if (!selector) return;
    const start = m.index + m[0].length;
    const end = i + 1 < decls.length ? decls[i + 1].index : src.length;
    api.push({
      selector,
      className: m[3],
      kind: m[1].toLowerCase(),
      file: relative(KIT_DIR, file).replace(/\\/g, '/'),
      members: members(src.slice(start, end)),
    });
  });
}
api.sort((a, b) => a.selector.localeCompare(b.selector));

writeFileSync(OUT, JSON.stringify(api, null, 2) + "\n");
console.log(`api.json: ${api.length} selectors`);
