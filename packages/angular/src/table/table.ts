import { Directive } from '@angular/core';

/**
 * Styles a native `<table>` with the Lucent contract (`styles/components/table.css`). Applied
 * as an attribute so the table keeps its native semantics, keyboard, and a11y — author normal
 * `<thead>/<tbody>/<tr>/<th>/<td>`; cells hold any content (avatar, status-tag, icon-button).
 *
 *   <table lucentTable> … </table>
 */
@Directive({
	selector: 'table[lucentTable]',
	standalone: true,
	host: { 'class': 'lucent-table' },
})
export class LucentTable {}
