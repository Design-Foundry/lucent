import { button } from './button';
import type { Scenario } from './types';

export * from './types';

export const scenarios: Scenario[] = [...button];

export function findScenario(id: string | null): Scenario | undefined {
	return scenarios.find((s) => s.id === id);
}
