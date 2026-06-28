import { ChangeDetectionStrategy, Component, ElementRef, booleanAttribute, inject, input, model, output } from '@angular/core';
import { DfIcon } from '../icon/icon';

export type TabScale = 'lg' | 'md' | 'sm' | 'xs';

@Component({
	selector: 'df-tab',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [DfIcon],
	templateUrl: './tab.html',
	styleUrl: './tab.scss',
	host: {
		'role': 'tab',
		'[attr.aria-selected]':     'active()',
		'[attr.tabindex]':          'active() ? 0 : -1',
		'[class.df-tab--lg]':       'scale() === "lg"',
		'[class.df-tab--md]':       'scale() === "md"',
		'[class.df-tab--sm]':       'scale() === "sm"',
		'[class.df-tab--xs]':       'scale() === "xs"',
		'[class.df-tab--active]':   'active()',
		'[class.df-tab--disabled]': 'disabled()',
		'(click)':                  'onClick()',
	}
})
export class DfTab {
	private readonly el = inject(ElementRef<HTMLElement>);

	readonly label = input('');
	readonly icon = input('');
	readonly disabled = input(false, { transform: booleanAttribute });
	readonly value = input('');

	// Owned by df-tab-list (driven from its scale/activeTab) but also settable directly.
	readonly scale = model<TabScale>('md');
	readonly active = model(false);

	readonly tabClick = output<void>();

	get nativeElement(): HTMLElement { return this.el.nativeElement; }

	onClick(): void {
		if (!this.disabled()) this.tabClick.emit();
	}
}
