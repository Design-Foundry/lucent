import { cx } from '../foundations';

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface IconProps {
	name: string;
	size?: IconSize;
	className?: string;
}

export function Icon({ name, size = 'md', className }: IconProps) {
	return (
		<span className={cx('lucent-icon', `lucent-icon--${size}`, className)} aria-hidden='true'>
			<span className='material-icons lucent-icon__glyph'>{name}</span>
		</span>
	);
}
