import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type SkeletonShape = 'line' | 'circle' | 'block';

@Component({
	selector: 'lucent-skeleton',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	// Pure CSS (styles/components/skeleton.css) — no template content.
	template: '',
	host: {
		'[class]': '"lucent-skeleton lucent-skeleton--" + shape()',
		// Decorative — the container announces the loading state (aria-busy), not each shard.
		'aria-hidden': 'true',
	},
})
export class LucentSkeleton {
	readonly shape = input<SkeletonShape>('line');
}
