import { scenarios } from '../scenarios';
import { expect, render, runsOn, test } from '../lib/stage';

for (const scenario of scenarios.filter((s) => !s.state)) {
	test(`${scenario.id}`, async ({ page, target }) => {
		test.skip(!runsOn(scenario, target), `not on ${target}`);
		const referencePage = await page.context().newPage();
		await render(referencePage, 'reference', scenario, 'light');
		await render(page, target, scenario, 'light');
		const reference = await referencePage.locator('#stage').ariaSnapshot();
		expect(await page.locator('#stage').ariaSnapshot()).toBe(reference);
	});
}
