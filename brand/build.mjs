// Generates the Lucent mark set from the primitive tokens. Run: node brand/build.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const primitives = readFileSync(join(here, '../styles/tokens/primitives.css'), 'utf8');

function token(name) {
  const m = new RegExp(`--color--primitive--${name}:\\s*oklch\\(([\\d.]+) ([\\d.]+) ([\\d.]+)`).exec(primitives);
  if (!m) throw new Error(`Missing primitive ${name}`);
  return hex(+m[1], +m[2], +m[3]);
}

function hex(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180);
  const b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const lin = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return '#' + lin
    .map((v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055))
    .map((v) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, '0'))
    .join('');
}

const SHEET_H = 60;
const SHEET_RX = 8;
const PIVOT = [48, 78];
const GEOMETRY = {
  five: { width: 28, angles: [-25, -12.5, 0, 12.5, 25] },
  three: { width: 32, angles: [-18, 0, 18] },
};

const PALETTES = {
  five: {
    light: [['slate-20', 1], ['slate-50', 0.85], ['sage-80', 0.8], ['sage-95', 0.8], ['neutral-100', 0.8]],
    dark: [['slate-80', 1], ['slate-50', 0.8], ['sage-30', 0.8], ['sage-20', 0.6], ['neutral-100', 0.14]],
    mono: [1, 0.75, 0.5, 0.32, 0.18],
  },
  three: {
    light: [['slate-20', 1], ['sage-80', 0.8], ['neutral-100', 0.8]],
    dark: [['slate-80', 1], ['sage-30', 0.8], ['neutral-100', 0.16]],
    mono: [1, 0.5, 0.2],
  },
};

const SOLID_CUTS = { 16: 1, 24: 1, 32: 1.5, 48: 2, 64: 2, 96: 3 };
const SMALL_MAX = 32;

function bounds({ width, angles }) {
  const x0 = PIVOT[0] - width / 2;
  const y0 = PIVOT[1] - 2 - SHEET_H;
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const deg of angles) {
    const r = (deg * Math.PI) / 180;
    for (const [x, y] of [[x0, y0], [x0 + width, y0], [x0, y0 + SHEET_H], [x0 + width, y0 + SHEET_H]]) {
      const dx = x - PIVOT[0], dy = y - PIVOT[1];
      const px = PIVOT[0] + dx * Math.cos(r) - dy * Math.sin(r);
      const py = PIVOT[1] + dx * Math.sin(r) + dy * Math.cos(r);
      minX = Math.min(minX, px); maxX = Math.max(maxX, px);
      minY = Math.min(minY, py); maxY = Math.max(maxY, py);
    }
  }
  return { minX, minY, maxX, maxY };
}

const f = (n) => +n.toFixed(3);

function fit(geometry, box, inset) {
  const b = bounds(geometry);
  const scale = (box - 2 * inset) / Math.max(b.maxX - b.minX, b.maxY - b.minY);
  const tx = box / 2 - ((b.minX + b.maxX) / 2) * scale;
  const ty = box / 2 - ((b.minY + b.maxY) / 2) * scale;
  return { scale, transform: `translate(${f(tx)} ${f(ty)}) scale(${f(scale)})` };
}

function rects(geometry, paint) {
  const { width, angles } = geometry;
  const x = PIVOT[0] - width / 2;
  const y = PIVOT[1] - 2 - SHEET_H;
  return angles
    .map((a, i) => `<rect x="${x}" y="${y}" width="${width}" height="${SHEET_H}" rx="${SHEET_RX}" ${paint(i)} transform="rotate(${a} ${PIVOT[0]} ${PIVOT[1]})"/>`)
    .join('');
}

const svg = (body, title) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="${title}">${body}</svg>\n`;

function colorMark(kind, sheets) {
  const g = GEOMETRY[kind];
  const { transform } = fit(g, 96, 4);
  return svg(`<g transform="${transform}">${rects(g, (i) => `fill="${token(sheets[i][0])}" fill-opacity="${sheets[i][1]}"`)}</g>`, 'Lucent');
}

function monoMark(kind, ink) {
  return colorMark(kind, PALETTES[kind].mono.map((o) => [ink, o]));
}

function solidMark(size) {
  const kind = size <= SMALL_MAX ? 'three' : 'five';
  const g = GEOMETRY[kind];
  const { scale, transform } = fit(g, 96, 4);
  const cut = (SOLID_CUTS[size] * 96) / size / scale;
  const sheets = rects(g, () => `fill="#fff" stroke="#000" stroke-width="${f(2 * cut)}" paint-order="stroke"`);
  return svg(
    `<mask id="lucent-cut-${size}" maskUnits="userSpaceOnUse" x="0" y="0" width="96" height="96"><rect width="96" height="96"/><g transform="${transform}">${sheets}</g></mask><rect width="96" height="96" fill="currentColor" mask="url(#lucent-cut-${size})"/>`,
    'Lucent',
  );
}

const TILE = { light: 'sage-95', dark: 'neutral-10' };

function tileCss(scheme) {
  return `.tile{fill:${token(TILE[scheme])}}` + PALETTES.three[scheme].map(([t, o], i) => `.s${i}{fill:${token(t)};fill-opacity:${o}}`).join('');
}

function tile(css) {
  const g = GEOMETRY.three;
  const { transform } = fit(g, 96, 16);
  return svg(`<style>${css}</style><rect class="tile" width="96" height="96" rx="24"/><g transform="${transform}">${rects(g, (i) => `class="s${i}"`)}</g>`, 'Lucent');
}

const out = {
  'lucent-mark.svg': colorMark('five', PALETTES.five.light),
  'lucent-mark-dark.svg': colorMark('five', PALETTES.five.dark),
  'lucent-mark-small.svg': colorMark('three', PALETTES.three.light),
  'lucent-mark-small-dark.svg': colorMark('three', PALETTES.three.dark),
  'lucent-mark-slate.svg': monoMark('five', 'slate-20'),
  'lucent-mark-slate-small.svg': monoMark('three', 'slate-20'),
  'lucent-mark-white.svg': monoMark('five', 'neutral-100'),
  'lucent-mark-white-small.svg': monoMark('three', 'neutral-100'),
  'lucent-tile.svg': tile(tileCss('light')),
  'lucent-tile-dark.svg': tile(tileCss('dark')),
  'favicon.svg': tile(`${tileCss('light')}@media (prefers-color-scheme:dark){${tileCss('dark')}}`),
};
for (const size of Object.keys(SOLID_CUTS)) out[`lucent-mark-solid-${size}.svg`] = solidMark(+size);

for (const [name, content] of Object.entries(out)) writeFileSync(join(here, name), content);
console.log(Object.keys(out).join('\n'));
