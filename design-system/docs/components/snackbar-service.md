# `SnackbarService`

> Imperative API for a single bottom-center snackbar with one action. Opening a new one
> replaces the current. `providedIn: 'root'`.

**Tier:** Service
**Source:** [`../../notifications/snackbar.service.ts`](../../notifications/snackbar.service.ts)

## API

| Method | Signature | Notes |
|---|---|---|
| `open` | `(options: SnackbarOptions) => void` | Shows / replaces the snackbar |
| `action` | `() => void` | Runs `onAction` then dismisses |
| `dismiss` | `() => void` | Hide the current snackbar |

```ts
interface SnackbarOptions {
  message: string;
  icon?: string;
  showIcon?: boolean;
  actionLabel?: string;
  duration?: number;     // ms; 0 = sticky; default 5000
  onAction?: () => void;
}
```

**Exported types:** `SnackbarOptions`.

## Usage

```ts
private snackbar = inject(SnackbarService);
this.snackbar.open({ message: 'Item archived', actionLabel: 'Undo', onAction: () => this.undo() });
```

## Composition

- Holds a `current` signal (single item); renders `DfSnackbarOutlet` once into a bottom-center
  overlay. Same zoneless `detectChanges()` pattern as `ToastService`.

## Accessibility

- Inherits `df-snackbar`'s gap: **no live-region role**, so it may not be announced. See
  [snackbar.md](./snackbar.md).

## Conventions check

| Rule | Status | Note |
|---|---|---|
| root-provided imperative overlay | ✅ | Consistent with the other services |
| §7 a11y | ⚠️ | No announce (component-level gap) |
| §8 tokens | ✅ | |

## Notes / TODO

- Add a live-region role to the outlet/component.
