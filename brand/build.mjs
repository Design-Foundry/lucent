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

// Outfit Light (OFL), L foot shortened to 470, L-u gap 40, tracking -6, pairs kerned by eye. Font units, y up.
const WORDMARK = {
  d: 'M87.5 0L87.5 688L161 688L161 0ZM136 0L136 67L470 67L470 0ZM708 -10Q650.7 -10 605.6 16.2Q560.5 42.5 535.2 88.9Q510 135.3 510 196.6V470H580.5V199.5Q580.5 156.5 596 124.5Q611.5 92.5 640.5 74.8Q669.5 57 708.2 57Q767 57 801.2 95.8Q835.5 134.5 835.5 199.5V470H906V196.5Q906 135.5 880.8 88.8Q855.5 42 810.9 16Q766.4 -10 708 -10ZM1232.5 -10Q1163.5 -10 1108 22.5Q1052.5 55 1020.2 111Q988 167 988 236Q988 305 1020.2 360.2Q1052.5 415.5 1108 447.8Q1163.5 480 1232.5 480Q1285.5 480 1331.5 460Q1377.5 440 1410 403.5L1363.5 356.5Q1339.5 383.5 1305.8 398Q1272 412.5 1232.5 412.5Q1183 412.5 1144 389.5Q1105 366.5 1082.8 327Q1060.5 287.5 1060.5 236Q1060.5 184.5 1082.8 144.2Q1105 104 1144 80.8Q1183 57.5 1232.5 57.5Q1272.5 57.5 1306.5 72Q1340.5 86.5 1365 114L1411.5 67Q1378.5 30 1332 10Q1285.5 -10 1232.5 -10ZM1712.5 -10Q1642 -10 1586 22Q1530 54 1497.5 109.8Q1465 165.5 1465 235.5Q1465 305 1496.8 360.2Q1528.5 415.5 1583.5 447.8Q1638.5 480 1706.5 480Q1771 480 1820.5 450.8Q1870 421.5 1898.2 370Q1926.5 318.5 1926.5 252Q1926.5 244 1925.5 233.5Q1924.5 223 1922 209H1514.5V268.5H1883.5L1858.5 247Q1859.5 298.5 1841 336Q1822.5 373.5 1788 394.2Q1753.5 415 1705 415Q1654 415 1615.8 392.8Q1577.5 370.5 1556.2 331Q1535 291.5 1535 238Q1535 183.5 1557.2 142.5Q1579.5 101.5 1620 78.8Q1660.5 56 1714 56Q1756.5 56 1792.5 71.5Q1828.5 87 1853.5 117.5L1899 71.5Q1866 32.5 1817.2 11.2Q1768.5 -10 1712.5 -10ZM2366 0V276Q2366 337.5 2329.2 376Q2292.5 414.5 2232.6 414.5Q2191.9 414.5 2160.7 396.8Q2129.5 379 2111.8 348Q2094 317 2094 276.5L2062 294.5Q2062 348 2086.8 389.8Q2111.5 431.5 2154.4 455.8Q2197.4 480 2251.7 480Q2306 480 2347.8 453.8Q2389.5 427.5 2413 383.8Q2436.5 340 2436.5 288V0ZM2023.5 0V470H2094V0ZM2620.5 0V668H2691V0ZM2502 406.5V470H2809V406.5Z',
  minX: 87.5,
  maxX: 2809.0,
  cap: 688,
  descent: -10,
};

function wordmark(ink) {
  const w = f(WORDMARK.maxX - WORDMARK.minX);
  const h = WORDMARK.cap - WORDMARK.descent;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${WORDMARK.minX} ${-WORDMARK.cap} ${w} ${h}" role="img" aria-label="Lucent"><path transform="scale(1 -1)" fill="${token(ink)}" d="${WORDMARK.d}"/></svg>
`;
}

// Lockup: wordmark cap height is half the tile, centred on it, a quarter tile away.
function lockup(scheme, ink) {
  const tileSize = 96;
  const s = tileSize / 2 / WORDMARK.cap;
  const gap = tileSize / 4;
  const width = f(tileSize + gap + (WORDMARK.maxX - WORDMARK.minX) * s);
  const tx = f(tileSize + gap - WORDMARK.minX * s);
  const ty = f(tileSize / 4 + WORDMARK.cap * s);
  const tileSvg = tile(tileCss(scheme)).replace('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 96" role="img" aria-label="Lucent">', '<svg viewBox="0 0 96 96" width="96" height="96">').trim();
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${tileSize}" role="img" aria-label="Lucent">${tileSvg}<path transform="translate(${tx} ${ty}) scale(${f(s)} ${f(-s)})" fill="${token(ink)}" d="${WORDMARK.d}"/></svg>
`;
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
  'lucent-wordmark.svg': wordmark('slate-20'),
  'lucent-wordmark-white.svg': wordmark('neutral-100'),
  'lucent-lockup.svg': lockup('light', 'slate-20'),
  'lucent-lockup-dark.svg': lockup('dark', 'neutral-100'),
  'favicon.svg': tile(`${tileCss('light')}@media (prefers-color-scheme:dark){${tileCss('dark')}}`),
};
for (const size of Object.keys(SOLID_CUTS)) out[`lucent-mark-solid-${size}.svg`] = solidMark(+size);

for (const [name, content] of Object.entries(out)) writeFileSync(join(here, name), content);
console.log(Object.keys(out).join('\n'));
