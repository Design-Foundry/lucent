import { ChangeDetectionStrategy, Component, afterNextRender, signal } from '@angular/core';
import { LucentButton, LucentIcon } from '@designfoundry/lucent-angular';
import { fixture } from '../../../scenarios';
import { boot } from '../../common';

const harness = boot();

@Component({
	selector: 'app-root',
	imports: [LucentButton, LucentIcon],
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './app.html',
})
export class App {
	protected readonly scenario = harness.scenario;
	protected readonly props = signal<Record<string, any>>(harness.scenario.props ?? {});

	constructor() {
		harness.onSet((next) => this.props.update((prev) => ({ ...prev, ...next })));
		afterNextRender(() => harness.rendered());
	}

	protected emit(name: string): void {
		harness.emit(name);
	}

	protected text(slot: string): string {
		const f = fixture(this.scenario.slots?.[slot]);
		return f?.kind === 'text' ? f.text : '';
	}

	protected icon(slot: string): string | null {
		const f = fixture(this.scenario.slots?.[slot]);
		return f?.kind === 'icon' ? f.name : null;
	}
}
