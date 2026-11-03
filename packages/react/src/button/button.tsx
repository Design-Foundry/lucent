import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cx, type ControlSize, type Tone } from '../foundations';
import { Icon, type IconSize } from '../icon/icon';

export type ButtonVariant = 'primary' | 'secondary' | 'text';
export type ButtonType = 'button' | 'submit' | 'reset';

export interface LucentButtonProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
	children: ReactNode;
	variant?: ButtonVariant;
	tone?: Tone;
	size?: ControlSize;
	icon?: string;
	leading?: ReactNode;
	trailing?: ReactNode;
	loading?: boolean;
	disabled?: boolean;
	type?: ButtonType;
	onClicked?: () => void;
}

const ICON_SIZE: Record<ControlSize, IconSize> = {
	xs: 'sm',
	sm: 'md',
	md: 'md',
	lg: 'lg',
};

export const LucentButton = forwardRef<HTMLButtonElement, LucentButtonProps>(function LucentButton(
	{
		children,
		variant = 'primary',
		tone = 'default',
		size = 'md',
		icon,
		leading,
		trailing,
		loading = false,
		disabled = false,
		type = 'button',
		onClicked,
		className,
		...rest
	},
	ref,
) {
	const start = leading ?? (icon ? <Icon name={icon} size={ICON_SIZE[size]} /> : null);

	return (
		<span
			{...rest}
			className={cx(
				'lucent-button',
				`lucent-button--${variant}`,
				tone === 'danger' && 'lucent-button--danger',
				`lucent-button--${size}`,
				loading && 'is-loading',
				className,
			)}
		>
			<button
				ref={ref}
				className='lucent-button__inner'
				type={type}
				disabled={disabled || loading}
				onClick={() => onClicked?.()}
			>
				{loading ? (
					<span className='lucent-spinner' />
				) : (
					<>
						{start}
						<span className='lucent-button__label'>{children}</span>
						{trailing}
					</>
				)}
			</button>
		</span>
	);
});
