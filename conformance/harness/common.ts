import { findScenario, type Mode, type Scenario } from '../scenarios';

export interface LucentEvent {
	name: string;
	detail: unknown;
}

export interface LucentHarness {
	ready: Promise<void>;
	events: LucentEvent[];
	set: (props: Record<string, unknown>) => void;
}

declare global {
	interface Window {
		__lucent: LucentHarness;
	}
}

const FREEZE = `
*, *::before, *::after { transition: none !important; animation: none !important; caret-color: transparent !important; }
body { margin: 0; }
#stage { display: block; padding: 16px; }
`;

export function boot(): {
	scenario: Scenario;
	mode: Mode;
	emit: (name: string, detail?: unknown) => void;
	onSet: (fn: (props: Record<string, unknown>) => void) => void;
	rendered: () => void;
} {
	const query = new URLSearchParams(location.search);
	const scenario = findScenario(query.get('s'));
	if (!scenario) throw new Error(`Unknown scenario: ${query.get('s')}`);
	const mode: Mode = query.get('mode') === 'dark' ? 'dark' : 'light';

	document.documentElement.dataset['theme'] = mode;
	const style = document.createElement('style');
	style.textContent = FREEZE;
	document.head.append(style);

	let resolve!: () => void;
	window.__lucent = { ready: new Promise((r) => (resolve = r)), events: [], set: () => {} };

	return {
		scenario,
		mode,
		emit: (name, detail) => window.__lucent.events.push({ name, detail }),
		onSet: (fn) => (window.__lucent.set = fn),
		rendered: () => requestAnimationFrame(() => void document.fonts.ready.then(() => resolve())),
	};
}
