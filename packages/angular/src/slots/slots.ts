import { Directive } from '@angular/core';

/**
 * Content-projection marker directives (Material's matPrefix/matSuffix pattern).
 *
 * They carry no behaviour — they exist so host components can target projected
 * content with `ng-content select="[lucentPrefix]"` and detect its presence with
 * `contentChild(LucentPrefix)`. Consumers apply them to projected elements:
 *
 * ```html
 * <lucent-text-input>
 *   <span lucentLabel>Email</span>
 *   <lucent-icon lucentPrefix name="mail" />
 *   <span lucentHint>We never share it</span>
 * </lucent-text-input>
 * ```
 */
@Directive({ selector: '[lucentLabel]', standalone: true })
export class LucentLabel {}

@Directive({ selector: '[lucentHint]', standalone: true })
export class LucentHint {}

@Directive({ selector: '[lucentError]', standalone: true })
export class LucentError {}

@Directive({ selector: '[lucentPrefix]', standalone: true })
export class LucentPrefix {}

@Directive({ selector: '[lucentSuffix]', standalone: true })
export class LucentSuffix {}

/**
 * Adornment slots for row/control components — the kit-wide vocabulary for
 * "what goes before / after the primary content" (API-PROPOSAL §Rule 2).
 *
 * `lucentLeading` / `lucentTrailing` supersede the older `lucentPrefix` / `lucentSuffix` pair;
 * `lucentSupporting` marks a secondary (second-line) text region (§Rule 1, §Rule 4).
 * `lucent-list-item` is the reference implementation — other row components adopt
 * the same names as they are refit.
 *
 * ```html
 * <lucent-list-item [value]="m.id" (activated)="open(m)">
 *   <lucent-avatar lucentLeading [name]="m.name" />
 *   {{ m.name }}
 *   <span lucentSupporting>{{ m.email }}</span>
 *   <lucent-icon-button lucentTrailing icon="more_vert" ariaLabel="Actions" />
 * </lucent-list-item>
 * ```
 */
@Directive({ selector: '[lucentLeading]', standalone: true })
export class LucentLeading {}

@Directive({ selector: '[lucentTrailing]', standalone: true })
export class LucentTrailing {}

@Directive({ selector: '[lucentSupporting]', standalone: true })
export class LucentSupporting {}

/**
 * `lucent-modal`'s three content groups: header, (default/unnamed) content, and actions.
 *
 * ```html
 * <lucent-modal [(open)]="open">
 *   <div lucentModalHeader>
 *     <h2 class="typography-heading-lg">Custom title</h2>
 *     <p class="typography-caption">Custom subtitle</p>
 *   </div>
 *   <p>Body content (the default slot).</p>
 *   <div lucentModalActions>
 *     <lucent-button variant="ghost">Cancel</lucent-button>
 *     <lucent-button variant="primary">Confirm</lucent-button>
 *   </div>
 * </lucent-modal>
 * ```
 *
 * Both are optional — when absent, `lucent-modal` falls back to its `title`/`subtitle`
 * inputs for the header and to `variant`-driven cancel/confirm buttons for actions.
 */
@Directive({ selector: '[lucentModalHeader]', standalone: true })
export class LucentModalHeader {}

@Directive({ selector: '[lucentModalActions]', standalone: true })
export class LucentModalActions {}
