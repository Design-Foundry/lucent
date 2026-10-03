// Generates the Lucent glyphs: icons/svg/*.svg and the Angular kit's glyph table. Run: node icons/build.mjs
import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));

const n = (v) => String(+v.toFixed(2));
const rad = (a) => (a * Math.PI) / 180;
const pt = (cx, cy, r, a) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];

function arc(cx, cy, r, a0, a1) {
  const [x0, y0] = pt(cx, cy, r, a0);
  const [x1, y1] = pt(cx, cy, r, a1);
  const span = (((a1 - a0) % 360) + 360) % 360;
  return `M${n(x0)} ${n(y0)}A${n(r)} ${n(r)} 0 ${span > 180 ? 1 : 0} 1 ${n(x1)} ${n(y1)}`;
}

const P = (d) => `<path d="${d}"/>`;
const dot = (x, y, r = 1.1) => `<circle class="dot" cx="${x}" cy="${y}" r="${r}"/>`;
const rect = (x, y, w, h, r) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/>`;

// The cut: circles open between -70 and -20 degrees, rounded containers lose their top-right corner.
const ccut = (cx, cy, r) => P(arc(cx, cy, r, -20, 290));

function rcut(x, y, w, h, r, c = 5) {
  const R = x + w, B = y + h;
  return P(
    `M${n(R - c)} ${n(y)}H${n(x + r)}A${r} ${r} 0 0 0 ${n(x)} ${n(y + r)}V${n(B - r)}A${r} ${r} 0 0 0 ${n(x + r)} ${n(B)}` +
      `H${n(R - r)}A${r} ${r} 0 0 0 ${n(R)} ${n(B - r)}V${n(y + c)}`,
  );
}

function gear() {
  const pts = [];
  for (let i = 0; i < 24; i++) pts.push(pt(12, 12, i % 4 < 2 ? 8.75 : 6.75, i * 15 - 90 + 7.5));
  return `<path d="M${pts.map(([x, y]) => `${n(x)} ${n(y)}`).join('L')}Z"/>` + ccut(12, 12, 2.75);
}

export const GLYPHS = {
  close: P('M6.5 6.5L17.5 17.5M17.5 6.5L6.5 17.5'),
  check: P('M5 12.5L9.75 17.25L19 7.5'),
  add: P('M12 5V19M5 12H19'),
  remove: P('M5 12H19'),
  chevron_left: P('M14.5 6L8.5 12L14.5 18'),
  chevron_right: P('M9.5 6L15.5 12L9.5 18'),
  expand_more: P('M6 9.5L12 15.5L18 9.5'),
  expand_less: P('M6 14.5L12 8.5L18 14.5'),
  more: dot(5.5, 12, 1.4) + dot(12, 12, 1.4) + dot(18.5, 12, 1.4),
  arrow_up: P('M12 19V5.5M6 11.5L12 5.5L18 11.5'),
  arrow_down: P('M12 5V18.5M6 12.5L12 18.5L18 12.5'),
  arrow_back: P('M19 12H5.5M11.5 6L5.5 12L11.5 18'),
  menu: P('M4.5 7H19.5M4.5 12H19.5M4.5 17H19.5'),
  search: '<circle cx="10.5" cy="10.5" r="6"/>' + P('M16.1 16.1L19.5 19.5'),
  copy: rcut(8.5, 8.5, 11, 11, 2.5, 4.5) + P('M15.5 4.5H7A2.5 2.5 0 0 0 4.5 7V15.5'),
  open_in_new: rcut(4.5, 4.5, 15, 15, 2.5, 6.5) + P('M14 4.5H19.5V10M19.5 4.5L11.5 12.5'),

  info: ccut(12, 12, 8.5) + P('M12 11V16.5') + dot(12, 7.9),
  success: ccut(12, 12, 8.5) + P('M8 12.25L11 15.25L16.25 9.75'),
  error: ccut(12, 12, 8.5) + P('M12 7.5V13') + dot(12, 16.1),
  warning: P('M12 4.25L20.5 19.25H3.5Z') + P('M12 10V14.25') + dot(12, 16.75),

  edit: P('M5 19V15.75L15.4 5.35A1.8 1.8 0 0 1 17.95 5.35L18.65 6.05A1.8 1.8 0 0 1 18.65 8.6L8.25 19Z') + P('M13.5 7.25L16.75 10.5'),
  delete: P('M4.5 7H19.5M9.5 7V5.5A1 1 0 0 1 10.5 4.5H13.5A1 1 0 0 1 14.5 5.5V7') + P('M6.5 9.5V17.5A2 2 0 0 0 8.5 19.5H15.5A2 2 0 0 0 17.5 17.5V9.5') + P('M10.25 11V16M13.75 11V16'),
  undo: P('M9 5.5L5 9.5L9 13.5M5 9.5H14.5A5 5 0 0 1 14.5 19.5H10.5'),
  redo: P('M15 5.5L19 9.5L15 13.5M19 9.5H9.5A5 5 0 0 0 9.5 19.5H13.5'),
  save: rcut(4.5, 4.5, 15, 15, 2, 5) + P('M8.5 4.5V8.5H14V4.5M8 19.5V14H16V19.5'),
  upload: P('M12 15V5M7.5 9.5L12 5L16.5 9.5M4.5 15V17.5A2 2 0 0 0 6.5 19.5H17.5A2 2 0 0 0 19.5 17.5V15'),
  download: P('M12 4.5V14.5M7.5 10L12 14.5L16.5 10M4.5 15V17.5A2 2 0 0 0 6.5 19.5H17.5A2 2 0 0 0 19.5 17.5V15'),
  link: P('M9.75 14.25L14.25 9.75') + P('M8.25 11.25L6.75 12.75A3.2 3.2 0 0 0 11.25 17.25L12.75 15.75') + P('M11.25 8.25L12.75 6.75A3.2 3.2 0 0 1 17.25 11.25L15.75 12.75'),
  filter: P('M4.5 8H10.5M15.5 8H19.5M4.5 16H8.5M13.5 16H19.5') + '<circle cx="13" cy="8" r="2.25"/><circle cx="11" cy="16" r="2.25"/>',
  history: P(arc(12, 12, 7.5, 160, 90)) + P('M1.95 12.97L4.95 14.57L6.23 11.41') + P('M12 8.5V12L14.5 14'),
  logout: P('M10.5 4.5H6.5A2 2 0 0 0 4.5 6.5V17.5A2 2 0 0 0 6.5 19.5H10.5') + P('M10 12H19.5M16 8.5L19.5 12L16 15.5'),
  reset: P('M19.05 14.57A7.5 7.5 0 1 0 12 19.5') + P('M17.77 11.41L19.05 14.57L22.05 12.97'),

  settings: gear(),
  person: ccut(12, 8, 3.75) + P(arc(12, 20.5, 7.5, 180, 360)),
  group: ccut(9.5, 8.5, 3.25) + P(arc(9.5, 20, 6, 180, 360)) + P(arc(15.5, 8.5, 3.25, -90, 90)) + P('M17.5 13.6A6 6 0 0 1 21 19.75'),
  mail: rcut(4.5, 5.5, 15, 13, 2, 5) + P('M4.9 7.4L12 12.5L15.6 9.9'),
  lock: rcut(5, 10.5, 14, 9.5, 2, 2.75) + P('M8 10.5V8A4 4 0 0 1 16 8V10.5'),
  organization: P('M4 19.5H20') + P('M6 19.5V6.5A2 2 0 0 1 8 4.5H9.5') + P('M13 19.5V8.5A2 2 0 0 1 15 6.5H16A2 2 0 0 1 18 8.5V19.5') + P('M9 9H10.5M9 12.5H10.5M9 16H10.5'),
  folder: P('M19.5 11.5V17.5A2 2 0 0 1 17.5 19.5H6.5A2 2 0 0 1 4.5 17.5V6.5A2 2 0 0 1 6.5 4.5H9.5L11.5 6.5H14.5'),
  palette: P('M14.6 7.6C16.2 9.7 17.5 12 17.5 14A5.5 5.5 0 0 1 6.5 14C6.5 10.5 12 4.5 12 4.5'),
  component: rect(4.5, 4.5, 6.5, 6.5, 1.5) + rect(4.5, 13, 6.5, 6.5, 1.5) + rect(13, 13, 6.5, 6.5, 1.5) + P('M16.25 3.9L20.1 7.75L16.25 11.6L12.4 7.75Z'),
  calendar: rcut(4.5, 6, 15, 13.5, 2, 5) + P('M8.5 4V7.5') + dot(15.25, 15.25, 1.35),
  time: ccut(12, 12, 8.5) + P('M12 7.5V12L15 14'),
  tag: P('M13.4 6.9L19 12.5A2 2 0 0 1 19 15.3L15.3 19A2 2 0 0 1 12.5 19L4.5 11V6.5A2 2 0 0 1 6.5 4.5H10.5') + dot(8.5, 8.5, 1.25),
  dashboard: rect(4.5, 4.5, 6.5, 9, 1.5) + rect(13, 4.5, 6.5, 5, 1.5) + rect(4.5, 15.5, 6.5, 4, 1.5) + rect(13, 11.5, 6.5, 8, 1.5),
};

// Material Icons names that resolve to a Lucent glyph, so existing `name` values pick up the set.
export const ALIASES = {
  more_horiz: 'more', more_vert: 'more',
  arrow_upward: 'arrow_up', arrow_downward: 'arrow_down',
  arrow_drop_down: 'expand_more', keyboard_arrow_down: 'expand_more', keyboard_arrow_up: 'expand_less',
  content_copy: 'copy',
  check_circle: 'success', task_alt: 'success',
  error_outline: 'error',
  delete_outline: 'delete',
  upload_file: 'upload', file_upload: 'upload', file_download: 'download',
  tune: 'filter',
  restart_alt: 'reset',
  account_circle: 'person',
  domain: 'organization', corporate_fare: 'organization',
  widgets: 'component',
  calendar_today: 'calendar', date_range: 'calendar', event: 'calendar', today: 'calendar',
  schedule: 'time',
  space_dashboard: 'dashboard',
};

const STROKE = 1.5;
const svgFile = (body) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${STROKE}" stroke-linecap="butt" stroke-linejoin="round">` +
  body.replaceAll('<circle class="dot"', '<circle fill="currentColor" stroke="none"') +
  '</svg>\n';

const svgDir = join(here, 'svg');
rmSync(svgDir, { recursive: true, force: true });
mkdirSync(svgDir, { recursive: true });
for (const [name, body] of Object.entries(GLYPHS)) writeFileSync(join(svgDir, `${name}.svg`), svgFile(body));

// The kit binds shapes into its own <svg>, so it never parses or sanitizes markup.
function shapes(body) {
  return [...body.matchAll(/<(path|circle|rect)([^>]*)\/>/g)].map(([, t, attrs]) => {
    const a = Object.fromEntries([...attrs.matchAll(/([a-z]+)="([^"]*)"/g)].map(([, k, v]) => [k, v]));
    const dot = a.class === 'dot';
    delete a.class;
    for (const k of Object.keys(a)) if (k !== 'd') a[k] = +a[k];
    return { t, ...a, ...(dot ? { dot: true } : {}) };
  });
}

const table = [
  '// Generated by icons/build.mjs. Do not edit.',
  '',
  'export type LucentGlyphShape =',
  "\t| { t: 'path'; d: string }",
  "\t| { t: 'circle'; cx: number; cy: number; r: number; dot?: true }",
  "\t| { t: 'rect'; x: number; y: number; width: number; height: number; rx: number };",
  '',
  'export const LUCENT_GLYPHS: Readonly<Record<string, readonly LucentGlyphShape[]>> = {',
  ...Object.entries(GLYPHS).map(([k, b]) => `\t${k}: ${JSON.stringify(shapes(b))},`),
  '};',
  '',
  'export const LUCENT_GLYPH_ALIASES: Readonly<Record<string, string>> = {',
  ...Object.entries(ALIASES).map(([k, v]) => `\t${k}: '${v}',`),
  '};',
  '',
].join('\n');
writeFileSync(join(here, '../packages/angular/src/icon/glyphs.ts'), table);

console.log(`${Object.keys(GLYPHS).length} glyphs, ${Object.keys(ALIASES).length} aliases`);
