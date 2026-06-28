# `ToastService`

> Imperative API for stacked, transient toasts (top-right). `providedIn: 'root'` — `inject()`
> and call. Self-hosts a CDK overlay on first use.

**Tier:** Service
**Source:** [`../../notifications/toast.service.ts`](../../notifications/toast.service.ts)

## API

| Method | Signature | Notes |
|---|---|---|
| `show` | `(options: ToastOptions) => number` | Returns a toast id |
| `success` / `info` / `warning` / `error` | `(message, options?) => number` | Variant shortcuts |
| `dismiss` | `(id: number) => void` | Remove a specific toast |

```ts
interface ToastOptions {
  title?: string;
  message?: string;
  variant?: ToastVariant;
  duration?: number;   // ms; 0 = sticky; default 5000
}
```

**Exported types:** `ToastOptions` (and `ToastVariant` via `df-toast`).

## Usage

```ts
private toast = inject(ToastService);
this.toast.success('Saved');
const id = this.toast.show({ title: 'Uploading', message: '…', duration: 0 });
this.toast.dismiss(id);
```

## Composition

- Holds a `toasts` signal; renders a `DfToastOutlet` (the stack) once into a top-right overlay.
- **Zoneless note:** calls `detectChanges()` after each change because a dynamically-attached
  overlay view doesn't pick up signal-driven CD on its own.

## Accessibility

- The stack is an `aria-live="polite"` region (via the outlet + each `df-toast`'s `role="status"`).

## Conventions check

| Rule | Status | Note |
|---|---|---|
| root-provided imperative overlay | ✅ | Consistent with `SnackbarService`/`DialogService` |
| §8 tokens | ✅ | |

## Notes / TODO

- No global cap on stack length; consider a max + coalescing.
