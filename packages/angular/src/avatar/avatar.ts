import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type AvatarScale = 'xs' | 'sm' | 'md' | 'lg';
export type AvatarVariant = 'trailing' | 'leading' | 'none';

@Component({
	selector: 'lucent-avatar',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './avatar.html',
	// Styled by the shared base (styles/components/avatar.css) via the lucent- contract.
	host: {
		'[class]': '"lucent-avatar lucent-avatar--" + scale() + " lucent-avatar--" + variant()'
	}
})
export class LucentAvatar {
	readonly src = input('');
	readonly name = input('');
	readonly tenant = input('');
	readonly scale = input<AvatarScale>('md');
	readonly variant = input<AvatarVariant>('trailing');

	/** Shows name + tenant only on md and lg. */
	readonly showTenant = computed(() =>
		!!this.tenant() && (this.scale() === 'md' || this.scale() === 'lg'));

	readonly initials = computed(() => {
		const name = this.name();
		if (!name) return '';
		return name
			.split(' ')
			.slice(0, 2)
			.map(w => w[0])
			.join('')
			.toUpperCase();
	});
}
