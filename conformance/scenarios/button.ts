import type { Scenario } from './types';

const label = { label: 'Save' };

export const button: Scenario[] = [
	{ id: 'button/primary-md', component: 'button', props: { variant: 'primary' }, slots: label },
	{ id: 'button/secondary-md', component: 'button', props: { variant: 'secondary' }, slots: label },
	{ id: 'button/text-md', component: 'button', props: { variant: 'text' }, slots: label },
	{ id: 'button/primary-xs', component: 'button', props: { size: 'xs' }, slots: label },
	{ id: 'button/primary-sm', component: 'button', props: { size: 'sm' }, slots: label },
	{ id: 'button/primary-lg', component: 'button', props: { size: 'lg' }, slots: label },
	{ id: 'button/secondary-md-disabled', component: 'button', props: { variant: 'secondary', disabled: true }, slots: label },
	{ id: 'button/primary-md-danger', component: 'button', props: { tone: 'danger' }, slots: { label: 'Delete' } },
	{ id: 'button/secondary-md-danger', component: 'button', props: { variant: 'secondary', tone: 'danger' }, slots: { label: 'Delete' } },
	{ id: 'button/primary-md-loading', component: 'button', props: { loading: true }, slots: label },
	{ id: 'button/primary-md-leading', component: 'button', slots: { label: 'Add', leading: 'icon:add' } },
	{ id: 'button/primary-md-trailing', component: 'button', slots: { label: 'Next', trailing: 'icon:arrow_forward' } },
	{ id: 'button/primary-md-hover', component: 'button', slots: label, state: 'hover', stateTarget: '.lucent-button__inner' },
	{ id: 'button/primary-md-active', component: 'button', slots: label, state: 'active', stateTarget: '.lucent-button__inner' },
	{ id: 'button/primary-md-focus-visible', component: 'button', slots: label, state: 'focus-visible' },
];
