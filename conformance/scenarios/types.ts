export type Mode = 'light' | 'dark';
export type State = 'hover' | 'active' | 'focus-visible';
export type Target = 'angular' | 'react';

export interface Scenario {
	id: string;
	component: string;
	props?: Record<string, unknown>;
	slots?: Record<string, string>;
	state?: State;
	stateTarget?: string;
	mode?: Mode;
	targets?: Target[];
}

export const MODES: Mode[] = ['light', 'dark'];

export function fixture(slot: string | undefined): { kind: 'icon'; name: string } | { kind: 'text'; text: string } | null {
	if (slot === undefined) return null;
	if (slot.startsWith('icon:')) return { kind: 'icon', name: slot.slice('icon:'.length) };
	return { kind: 'text', text: slot };
}
