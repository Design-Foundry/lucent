/**
 * Action intent ("tone") for interactive controls — orthogonal to visual `variant`
 * and to the `info/success/warning/error` *status* scale (see status-tag/toast).
 *
 * `danger` marks destructive actions (delete, remove) in red; it intensifies on
 * hover. Extend deliberately (e.g. a future `warning`) — keep it the same word
 * kit-wide (we use `danger`, not `destructive`).
 */
export type Tone = 'default' | 'danger';
