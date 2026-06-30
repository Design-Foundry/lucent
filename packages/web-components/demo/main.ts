// Shared framework-neutral base — the single CSS layer that styles every kit.
import '../../../styles/lucent.css';
import './demo.css';
// Side-effect import: registers every <lucent-*> custom element.
import '@design-foundry/lucent-wc';
import type { LucentBreadcrumbs, LucentSelect } from '@design-foundry/lucent-wc';

// Seed theme from ?theme= so Playwright can drive both themes by URL.
const initial = new URLSearchParams(location.search).get('theme') === 'dark' ? 'dark' : 'light';
document.documentElement.dataset.theme = initial;

const toggle = document.getElementById('sc-theme');
const sync = () => {
  const t = document.documentElement.dataset.theme ?? 'light';
  if (toggle) toggle.innerHTML = `<span class="material-icons" style="font-size:18px">${t === 'light' ? 'dark_mode' : 'light_mode'}</span> ${t === 'light' ? 'Dark' : 'Light'}`;
};
toggle?.addEventListener('click', () => {
  document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
  sync();
});
sync();

// ── Property-based data (arrays/objects can't be set via attributes) ─────────────
customElements.whenDefined('lucent-breadcrumbs').then(() => {
  const el = document.getElementById('crumbs') as LucentBreadcrumbs | null;
  if (el) el.items = [{ label: 'Home', path: '/' }, { label: 'Settings', path: '/settings' }, { label: 'Profile' }];
});

customElements.whenDefined('lucent-select').then(() => {
  const el = document.getElementById('env') as LucentSelect | null;
  if (el) el.options = [{ label: 'Production', value: 'prod' }, { label: 'Staging', value: 'staging' }, { label: 'Development', value: 'dev' }];
});

// Modal open trigger.
document.getElementById('open-modal')?.addEventListener('click', () => {
  const modal = document.getElementById('modal') as HTMLElement & { open: boolean } | null;
  if (modal) modal.open = true;
});
