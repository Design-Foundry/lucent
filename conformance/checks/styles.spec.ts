import { scenarios } from '../scenarios';
import { styleDiff } from '../lib/normalize';
import { expect, modesOf, render, runsOn, snapshot, test } from '../lib/stage';

for (const scenario of scenarios) {
	for (const mode of modesOf(scenario)) {
		test(`${scenario.id} [${mode}]`, async ({ page, target }) => {
			test.skip(!runsOn(scenario, target), `not on ${target}`);
			const referencePage = await page.context().newPage();
			await render(referencePage, 'reference', scenario, mode);
			await render(page, target, scenario, mode);
			expect(styleDiff(await snapshot(referencePage), await snapshot(page))).toEqual([]);
		});
	}
}
