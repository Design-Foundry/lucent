import { Component, Directive, ElementRef, Input, OnDestroy, inject } from '@angular/core';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

let nextId = 0;

const POSITIONS: Record<TooltipPosition, ConnectedPosition> = {
	top:    { originX: 'center', originY: 'top',    overlayX: 'center', overlayY: 'bottom', offsetY: -6 },
	bottom: { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top',    offsetY: 6 },
	left:   { originX: 'start',  originY: 'center', overlayX: 'end',    overlayY: 'center', offsetX: -6 },
	right:  { originX: 'end',    originY: 'center', overlayX: 'start',  overlayY: 'center', offsetX: 6 },
};

/** The floating bubble. Rendered into a CDK overlay by the directive — not used directly. */
@Component({
	selector: 'df-tooltip-bubble',
	standalone: true,
	template: '{{ text }}',
	styleUrl: './tooltip.scss',
	host: { 'class': 'df-tooltip', 'role': 'tooltip', '[id]': 'id' },
})
export class DfTooltipBubble {
	text = '';
	id = '';
}

/**
 * Accessible tooltip. Apply to any focusable trigger: <code>[dfTooltip]="'Help'"</code>.
 * Shows on hover and keyboard focus, sets <code>aria-describedby</code>, dismisses on Escape.
 */
@Directive({
	selector: '[dfTooltip]',
	standalone: true,
	host: {
		'(mouseenter)': 'show()',
		'(mouseleave)': 'hide()',
		'(focusin)': 'show()',
		'(focusout)': 'hide()',
		'(keydown.escape)': 'hide()',
		'[attr.aria-describedby]': 'describedBy',
	},
})
export class DfTooltip implements OnDestroy {
	@Input('dfTooltip') content = '';
	@Input() dfTooltipPosition: TooltipPosition = 'top';

	private readonly overlay = inject(Overlay);
	private readonly el = inject(ElementRef);
	private readonly id = `df-tooltip-${nextId++}`;

	private ref?: OverlayRef;
	describedBy: string | null = null;

	show(): void {
		if (this.ref || !this.content) return;

		this.ref = this.overlay.create({
			positionStrategy: this.overlay.position()
				.flexibleConnectedTo(this.el)
				.withPositions([POSITIONS[this.dfTooltipPosition]]),
			scrollStrategy: this.overlay.scrollStrategies.reposition(),
		});

		const bubble = this.ref.attach(new ComponentPortal(DfTooltipBubble));
		bubble.instance.text = this.content;
		bubble.instance.id = this.id;
		this.describedBy = this.id;
	}

	hide(): void {
		this.describedBy = null;
		this.ref?.dispose();
		this.ref = undefined;
	}

	ngOnDestroy(): void {
		this.hide();
	}
}
