import { ChangeDetectionStrategy, Component, contentChildren, effect, HostListener, input, output } from '@angular/core';
import { DfTab, TabScale } from '../tab/tab';

@Component({
	selector: 'df-tab-list',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	template: '<ng-content />',
	// Styled by the shared base (styles/components/tab-list.css) via the lucent- contract.
	host: { 'class': 'lucent-tab-list', 'role': 'tablist' }
})
export class DfTabList {
	readonly scale     = input<TabScale>('md');
	readonly activeTab = input<string>('');
	readonly tabChange = output<string>();

	private readonly tabs = contentChildren(DfTab);

	constructor() {
		// Drive each projected tab's scale + selected state from the list.
		effect(() => {
			const scale   = this.scale();
			const current = this.activeTab();
			this.tabs().forEach(tab => {
				tab.scale.set(scale);
				tab.active.set(tab.value() === current);
			});
		});
	}

	@HostListener('click', ['$event'])
	onClick(event: Event): void {
		const tab = this.tabs().find(t => t.nativeElement.contains(event.target as Node));
		if (tab && !tab.disabled()) this.tabChange.emit(tab.value());
	}

	@HostListener('keydown', ['$event'])
	onKeydown(event: KeyboardEvent): void {
		const enabled = this.tabs().filter(t => !t.disabled());
		if (!enabled.length) return;

		const currentIdx = enabled.findIndex(t => t.value() === this.activeTab());
		let nextIdx = currentIdx;

		switch (event.key) {
			case 'ArrowRight': nextIdx = (currentIdx + 1) % enabled.length; break;
			case 'ArrowLeft':  nextIdx = (currentIdx - 1 + enabled.length) % enabled.length; break;
			case 'Home':       nextIdx = 0; break;
			case 'End':        nextIdx = enabled.length - 1; break;
			default: return;
		}

		event.preventDefault();
		const next = enabled[nextIdx];
		this.tabChange.emit(next.value());
		next.nativeElement.focus();
	}
}
