import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** The kind of a scheduled event — drives its category color. */
export type EventCategory = 'work' | 'meeting' | 'personal' | 'deadline';

/** A single event, as consumed by the Month day cell. */
export interface SchedulerEvent { category: EventCategory; label: string; time?: string; }

/** Compact event pill shown inside month-view day cells. */
@Component({
	selector: 'lucent-event-chip',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '[class]': '"lucent-event-chip lucent-event-chip--" + category()' },
	template: `
		@if (time()) { <span class="lucent-event-chip__time">{{ time() }}</span> }
		<span class="lucent-event-chip__label">{{ label() }}</span>
	`,
})
export class LucentEventChip {
	readonly category = input<EventCategory>('work');
	readonly label = input('');
	readonly time = input('');
}

/** A tall month-grid day cell: a date badge + stacked event chips with overflow. */
@Component({
	selector: 'lucent-month-cell',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [LucentEventChip],
	host: { '[class]': 'hostClass()' },
	template: `
		<span class="lucent-month-cell__date">{{ day() }}</span>
		<div class="lucent-month-cell__events">
			@for (e of shown(); track $index) {
				<lucent-event-chip [category]="e.category" [label]="e.label" [time]="e.time ?? ''" />
			}
			@if (overflow() > 0) { <span class="lucent-month-cell__more">+{{ overflow() }} more</span> }
		</div>
	`,
})
export class LucentMonthCell {
	readonly day = input(1);
	readonly today = input(false);
	readonly outside = input(false);
	readonly events = input<SchedulerEvent[]>([]);
	readonly maxVisible = input(2);

	protected readonly shown = computed(() => this.events().slice(0, this.maxVisible()));
	protected readonly overflow = computed(() => this.events().length - this.shown().length);
	protected readonly hostClass = computed(() =>
		['lucent-month-cell', this.today() ? 'lucent-month-cell--today' : '', this.outside() ? 'lucent-month-cell--outside' : ''].filter(Boolean).join(' '));
}

/** A week time-grid block. Sized (top/height) by its parent column. */
@Component({
	selector: 'lucent-event-block',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '[class]': '"lucent-event-block lucent-event-block--" + category()' },
	template: `
		<span class="lucent-event-block__title">{{ title() }}</span>
		@if (time()) { <span class="lucent-event-block__time">{{ time() }}</span> }
	`,
})
export class LucentEventBlock {
	readonly category = input<EventCategory>('work');
	readonly title = input('');
	readonly time = input('');
}

/** A single row in the agenda (list) view. */
@Component({
	selector: 'lucent-agenda-row',
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush,
	host: { '[class]': '"lucent-agenda-row lucent-agenda-row--" + category()' },
	template: `
		<span class="lucent-agenda-row__time">{{ time() }}</span>
		<span class="lucent-agenda-row__bar"></span>
		<div class="lucent-agenda-row__content">
			<span class="lucent-agenda-row__title">{{ title() }}</span>
			@if (subtitle()) { <span class="lucent-agenda-row__subtitle">{{ subtitle() }}</span> }
		</div>
	`,
})
export class LucentAgendaRow {
	readonly category = input<EventCategory>('work');
	readonly time = input('');
	readonly title = input('');
	readonly subtitle = input('');
}
