const icon = (name: string) =>
	`<span class="lucent-icon lucent-icon--md" aria-hidden="true"><span class="material-icons lucent-icon__glyph">${name}</span></span>`;

const label = (text: string) => `<span class="lucent-button__label">${text}</span>`;

const button = (modifiers: string, content: string, inner = '') =>
	`<span class="lucent-button ${modifiers}"><button class="lucent-button__inner" type="button"${inner}>${content}</button></span>`;

const primaryMd = button('lucent-button--primary lucent-button--md', label('Save'));

export const markup: Record<string, string> = {
	'button/primary-md': primaryMd,
	'button/secondary-md': button('lucent-button--secondary lucent-button--md', label('Save')),
	'button/text-md': button('lucent-button--text lucent-button--md', label('Save')),
	'button/primary-xs': button('lucent-button--primary lucent-button--xs', label('Save')),
	'button/primary-sm': button('lucent-button--primary lucent-button--sm', label('Save')),
	'button/primary-lg': button('lucent-button--primary lucent-button--lg', label('Save')),
	'button/secondary-md-disabled': button('lucent-button--secondary lucent-button--md', label('Save'), ' disabled'),
	'button/primary-md-danger': button('lucent-button--primary lucent-button--danger lucent-button--md', label('Delete')),
	'button/secondary-md-danger': button('lucent-button--secondary lucent-button--danger lucent-button--md', label('Delete')),
	'button/primary-md-loading': button('lucent-button--primary lucent-button--md is-loading', '<span class="lucent-spinner"></span>', ' disabled'),
	'button/primary-md-leading': button('lucent-button--primary lucent-button--md', icon('add') + label('Add')),
	'button/primary-md-trailing': button('lucent-button--primary lucent-button--md', label('Next') + icon('arrow_forward')),
	'button/primary-md-hover': primaryMd,
	'button/primary-md-active': primaryMd,
	'button/primary-md-focus-visible': primaryMd,
};
