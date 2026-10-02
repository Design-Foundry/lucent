# Table — `.lucent-table`

> Tabular data: rows of records with aligned columns, a header, and an optional pagination
> footer. Applied to **native table markup**, so semantics, keyboard, and screen-reader support
> come for free; cells hold any content (avatar, status-tag, icon-button, plain text).

**Tier:** Data display
**Targets:** `[lucentTable]` directive (Angular) · `Table` (React) · `<table class="lucent-table">` (Web Components / plain HTML) · `LucentTable` (Blazor)
**Source:** [`../../packages/angular/src/table/table.ts`](../../packages/angular/src/table/table.ts) · CSS [`../../styles/components/table.css`](../../styles/components/table.css)

## API

The contract is a **CSS class on a real `<table>`** — there are no configuration inputs. The
framework wrappers only attach the class and forward attributes:

| Target | How |
|---|---|
| Angular | `<table lucentTable> … </table>` (attribute directive) |
| Web Components / HTML | `<table class="lucent-table"> … </table>` (a custom element can't *be* a table) |

**Structure:** author `<thead><tr><th>…` and `<tbody><tr><td>…`. Alignment helpers:
`.lucent-table__cell--right` / `--center` on a `th`/`td`. Optional footer:
`.lucent-table__pagination` (+ `.lucent-table__pagination-controls`).

## When to use

- **Comparable records across columns** — users, invoices, files — where scanning down a
  column matters. For a single-column stack of rich rows, prefer `list` + `list-item`.
- Keep columns few and cells shallow; heavy per-cell UI belongs in a detail view.

## Usage

```html
<!-- Web Components / HTML -->
<table class="lucent-table">
  <thead>
    <tr><th>Member</th><th>Role</th><th class="lucent-table__cell--right">Actions</th></tr>
  </thead>
  <tbody>
    <tr>
      <td><!-- <lucent-avatar> + name --></td>
      <td><lucent-status-tag variant="success" label="Active"></lucent-status-tag></td>
      <td class="lucent-table__cell--right"><lucent-icon-button icon="more_vert" variant="ghost" size="sm"></lucent-icon-button></td>
    </tr>
  </tbody>
</table>
```
```html
<!-- Angular -->
<table lucentTable> … </table>
```
```tsx
/* React */
<Table><thead>…</thead><tbody>…</tbody></Table>
```
```razor
@* Blazor *@
<LucentTable><thead>…</thead><tbody>…</tbody></LucentTable>
```

## Composition

- Cells embed other Lucent components — `avatar` (member), `status-tag` (state), `icon-button`
  (row actions), `badge` (counts).
- **Pagination** is a composed footer: put a range label ("1–10 of 42") and a couple of
  `icon-button`s (prev/next) inside `.lucent-table__pagination` beneath the table.

## States & accessibility

- Native `<table>`/`<th>`/`<td>` give the correct roles and screen-reader table navigation —
  don't rebuild it with `<div>`s. Use `<th scope="col">` for header cells.
- Row hover is a light `surface-base`; selected rows take `.is-selected`. Convey selection with
  more than colour (e.g. a checkbox cell).

## Do / Don't

- **Do** use real table elements and `scope` on headers.
- **Do** right-align numeric and action columns.
- **Don't** use a table for layout, or for a single-column list (use `list`).
- **Don't** cram interactive-heavy widgets into every cell — link out to detail instead.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §2 naming (`lucent-table`, `__cell--*`, `__pagination`) | ✅ | |
| §7 a11y (native table semantics) | ✅ | Author `scope` on headers |
| §8 tokens | ✅ | Borders `border-default`/`border-subtle`, hover `surface-base` |

## Notes / TODO

- A data-driven wrapper (columns + rows config, sortable headers) could sit on top later; the
  base contract stays the styled native table.
