import { Directive } from '@angular/core';

/**
 * Content-projection marker directives (Material's matPrefix/matSuffix pattern).
 *
 * They carry no behaviour — they exist so host components can target projected
 * content with `ng-content select="[dfPrefix]"` and detect its presence with
 * `contentChild(DfPrefix)`. Consumers apply them to projected elements:
 *
 * ```html
 * <df-input>
 *   <span dfLabel>Email</span>
 *   <df-icon dfPrefix name="mail" />
 *   <span dfHint>We never share it</span>
 * </df-input>
 * ```
 */
@Directive({ selector: '[dfLabel]', standalone: true })
export class DfLabel {}

@Directive({ selector: '[dfHint]', standalone: true })
export class DfHint {}

@Directive({ selector: '[dfError]', standalone: true })
export class DfError {}

@Directive({ selector: '[dfPrefix]', standalone: true })
export class DfPrefix {}

@Directive({ selector: '[dfSuffix]', standalone: true })
export class DfSuffix {}

/**
 * Adornment slots for row/control components — the kit-wide vocabulary for
 * "what goes before / after the primary content" (API-PROPOSAL §Rule 2).
 *
 * `dfLeading` / `dfTrailing` supersede the older `dfPrefix` / `dfSuffix` pair;
 * `dfSupporting` marks a secondary (second-line) text region (§Rule 1, §Rule 4).
 * `df-list-item` is the reference implementation — other row components adopt
 * the same names as they are refit.
 *
 * ```html
 * <df-list-item [value]="m.id" (activated)="open(m)">
 *   <df-avatar dfLeading [name]="m.name" />
 *   {{ m.name }}
 *   <span dfSupporting>{{ m.email }}</span>
 *   <df-icon-button dfTrailing icon="more_vert" ariaLabel="Actions" />
 * </df-list-item>
 * ```
 */
@Directive({ selector: '[dfLeading]', standalone: true })
export class DfLeading {}

@Directive({ selector: '[dfTrailing]', standalone: true })
export class DfTrailing {}

@Directive({ selector: '[dfSupporting]', standalone: true })
export class DfSupporting {}

/**
 * `df-modal`'s three content groups: header, (default/unnamed) content, and actions.
 *
 * ```html
 * <df-modal [(open)]="open">
 *   <div dfModalHeader>
 *     <h2 class="typography-heading-lg">Custom title</h2>
 *     <p class="typography-caption">Custom subtitle</p>
 *   </div>
 *   <p>Body content (the default slot).</p>
 *   <div dfModalActions>
 *     <df-button variant="ghost">Cancel</df-button>
 *     <df-button variant="primary">Confirm</df-button>
 *   </div>
 * </df-modal>
 * ```
 *
 * Both are optional — when absent, `df-modal` falls back to its `title`/`subtitle`
 * inputs for the header and to `variant`-driven cancel/confirm buttons for actions.
 */
@Directive({ selector: '[dfModalHeader]', standalone: true })
export class DfModalHeader {}

@Directive({ selector: '[dfModalActions]', standalone: true })
export class DfModalActions {}
