# `DfActivityBar` — `<df-activity-bar>`

> A horizontal bar container (VS Code-style activity/status strip). Layout only — projects its
> children.

**Tier:** Navigation
**Selector:** `df-activity-bar`
**Source:** [`../../activity-bar/activity-bar.ts`](../../activity-bar/activity-bar.ts)

## API

No inputs/outputs. Template is `<ng-content />`; styling in `activity-bar.scss`.

**Content slots:** default — project whatever the bar holds (icons, buttons, status).
**Exported types:** none.

## Usage

```html
<df-activity-bar>
  <df-icon-button icon="terminal" ariaLabel="Terminal" variant="ghost" />
  <df-status-tag variant="success" label="Connected" />
</df-activity-bar>
```

## Composition

- Generic projection container; no opinion on its contents or coordination.

## States & accessibility

- No role/landmark; add semantics at the usage site if it represents navigation/status.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 collection model | ✅ | Projection container |
| §7 a11y | ⚠️ | No role |
| §8 tokens | ✅ | |

## Notes / TODO

- Document/standardize the expected children and any landmark role.
