import { scenarios } from '../scenarios';
import { domDiff, inlineStyles } from '../lib/normalize';
import { expect, render, runsOn, snapshot, test } from '../lib/stage';

for (const scenario of scenarios.filter((s) => !s.state)) {
	test(`${scenario.id}`, async ({ page, target }) => {
		test.skip(!runsOn(scenario, target), `not on ${target}`);
		const referencePage = await page.context().newPage();
		await render(referencePage, 'reference', scenario, 'light');
		await render(page, target, scenario, 'light');
		const kit = await snapshot(page);

		for (const warning of inlineStyles(kit)) {
			test.info().annotations.push({ type: 'inline style', description: warning });
		}
		expect(domDiff(await snapshot(referencePage), kit)).toEqual([]);
	});
}
