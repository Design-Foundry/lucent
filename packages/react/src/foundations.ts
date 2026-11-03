export type ControlSize = 'xs' | 'sm' | 'md' | 'lg';
export type Tone = 'default' | 'danger';

export function cx(...classes: (string | false | null | undefined)[]): string {
	return classes.filter(Boolean).join(' ');
}
