import {
	Directive,
	ElementRef,
	OnDestroy,
	TemplateRef,
	ViewContainerRef,
	inject,
	input,
} from '@angular/core';
import { ConnectedPosition, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { TemplatePortal } from '@angular/cdk/portal';
import { Subscription, fromEvent } from 'rxjs';

const ANIM_MS = 120;

type MenuPosition = 'bottom-end' | 'bottom-start';

const POSITIONS: Record<MenuPosition, ConnectedPosition> = {
	'bottom-end':   { originX: 'end',   originY: 'bottom', overlayX: 'end',   overlayY: 'top', offsetY: 4 },
	'bottom-start': { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
};

@Directive({
	selector: '[lucentMenuTrigger]',
	standalone: true,
	host: {
		'(click)':         '_onClick($event)',
		'(keydown.enter)': '_onKeyActivate($event)',
		'(keydown.space)': '_onKeyActivate($event)',
		'style':           'cursor: pointer',
	},
})
export class LucentMenuTrigger implements OnDestroy {
	readonly template = input.required<TemplateRef<void>>({ alias: 'lucentMenuTrigger' });
	readonly lucentMenuPosition = input<MenuPosition>('bottom-end');

	private readonly _overlay = inject(Overlay);
	private readonly _el      = inject(ElementRef);
	private readonly _vcr     = inject(ViewContainerRef);

	private _overlayRef?: OverlayRef;
	private _subs: Subscription[] = [];
	private _closeTimer?: ReturnType<typeof setTimeout>;
	private _isOpen = false;

	_onClick(event: Event): void {
		event.stopPropagation();
		this._isOpen ? this.close() : this.open();
	}

	_onKeyActivate(event: Event): void {
		event.preventDefault();
		event.stopPropagation();
		this._isOpen ? this.close() : this.open();
	}

	open(): void {
		if (this._isOpen) return;
		clearTimeout(this._closeTimer);

		this._overlayRef = this._overlay.create({
			positionStrategy: this._overlay.position()
				.flexibleConnectedTo(this._el)
				.withPositions([POSITIONS[this.lucentMenuPosition()]]),
			scrollStrategy: this._overlay.scrollStrategies.reposition(),
		});

		this._subs.push(
			this._overlayRef.outsidePointerEvents().subscribe(() => this.close()),
			this._overlayRef.keydownEvents().subscribe(e => { if (e.key === 'Escape') this.close(); }),
			fromEvent(this._overlayRef.overlayElement, 'click').subscribe(() => this.close()),
		);

		this._overlayRef.attach(new TemplatePortal(this.template(), this._vcr));
		this._isOpen = true;
	}

	close(): void {
		if (!this._isOpen || !this._overlayRef) return;
		clearTimeout(this._closeTimer);
		this._isOpen = false;

		this._overlayRef.overlayElement
			.querySelector('lucent-menu')
			?.classList.add('lucent-menu--closing');

		this._closeTimer = setTimeout(() => this._teardown(), ANIM_MS);
	}

	private _teardown(): void {
		for (const sub of this._subs) sub.unsubscribe();
		this._subs = [];
		this._overlayRef?.detach();
		this._overlayRef?.dispose();
		this._overlayRef = undefined;
	}

	ngOnDestroy(): void {
		clearTimeout(this._closeTimer);
		this._teardown();
	}
}
