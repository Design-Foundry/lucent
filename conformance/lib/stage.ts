import { test as base, type CDPSession, type Page } from '@playwright/test';
import { MODES, type Mode, type Scenario, type Target } from '../scenarios';
import { snapshotStage, type NormalNode } from './normalize';
import { PROPERTIES } from './properties';

export const URLS: Record<Target | 'reference', string> = {
	reference: 'http://localhost:4401/reference/',
	react: 'http://localhost:4401/react/',
	angular: 'http://localhost:4402/',
};

const FOCUSABLE = ['button', 'a[href]', 'input', 'select', 'textarea', '[tabindex]'];

export const test = base.extend<{ target: Target }>({
	target: ['react', { option: true }],
});

export { expect } from '@playwright/test';

export function modesOf(scenario: Scenario): Mode[] {
	return scenario.mode ? [scenario.mode] : MODES;
}

export function runsOn(scenario: Scenario, target: Target): boolean {
	return !scenario.targets || scenario.targets.includes(target);
}

export async function render(page: Page, at: Target | 'reference', scenario: Scenario, mode: Mode): Promise<CDPSession | null> {
	await page.goto(`${URLS[at]}?s=${encodeURIComponent(scenario.id)}&mode=${mode}`);
	await page.evaluate(() => window.__lucent.ready);
	return applyState(page, scenario);
}

async function applyState(page: Page, scenario: Scenario): Promise<CDPSession | null> {
	if (!scenario.state) return null;
	if (scenario.state === 'focus-visible') {
		await page.keyboard.press('Tab');
		return null;
	}
	const selector = scenario.stateTarget
		? `#stage ${scenario.stateTarget}`
		: FOCUSABLE.map((f) => `#stage ${f}`).join(', ');
	const cdp = await page.context().newCDPSession(page);
	await cdp.send('DOM.enable');
	await cdp.send('CSS.enable');
	const { root } = await cdp.send('DOM.getDocument');
	const { nodeId } = await cdp.send('DOM.querySelector', { nodeId: root.nodeId, selector });
	await cdp.send('CSS.forcePseudoState', { nodeId, forcedPseudoClasses: [scenario.state] });
	return cdp;
}

export async function snapshot(page: Page): Promise<NormalNode> {
	return page.evaluate(snapshotStage, PROPERTIES);
}
