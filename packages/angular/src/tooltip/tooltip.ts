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
	selector: 'lucent-tooltip-bubble',
	standalone: true,
	template: '{{ text }}',
	// Bubble styled by the shared base (styles/components/tooltip.css) via the lucent- contract.
	host: { 'class': 'lucent-tooltip', 'role': 'tooltip', '[id]': 'id' },
})
export class LucentTooltipBubble {
	text = '';
	id = '';
}

/**
 * Accessible tooltip. Apply to any focusable trigger: <code>[lucentTooltip]="'Help'"</code>.
 * Shows on hover and keyboard focus, sets <code>aria-describedby</code>, dismisses on Escape.
 */
@Directive({
	selector: '[lucentTooltip]',
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
export class LucentTooltip implements OnDestroy {
	@Input('lucentTooltip') content = '';
	@Input() lucentTooltipPosition: TooltipPosition = 'top';

	private readonly overlay = inject(Overlay);
	private readonly el = inject(ElementRef);
	private readonly id = `lucent-tooltip-${nextId++}`;

	private ref?: OverlayRef;
	describedBy: string | null = null;

	show(): void {
		if (this.ref || !this.content) return;

		this.ref = this.overlay.create({
			positionStrategy: this.overlay.position()
				.flexibleConnectedTo(this.el)
				.withPositions([POSITIONS[this.lucentTooltipPosition]]),
			scrollStrategy: this.overlay.scrollStrategies.reposition(),
		});

		const bubble = this.ref.attach(new ComponentPortal(LucentTooltipBubble));
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
