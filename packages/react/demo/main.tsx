import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// The shared framework-neutral base — the single CSS layer that styles every kit.
import '../../../styles/lucent.css';
import './demo.css';
import { App } from './App';

// Seed theme from ?theme= so Playwright can drive both themes by URL (same contract as the other kits).
const theme = new URLSearchParams(location.search).get('theme') === 'dark' ? 'dark' : 'light';
document.documentElement.dataset.theme = theme;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
