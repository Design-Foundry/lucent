# `DialogService`

> Imperative, awaitable modal dialogs. Open any component as a dialog, or use the built-in
> `confirm()`. `providedIn: 'root'`.

**Tier:** Service
**Source:** [`../../dialog/dialog.service.ts`](../../dialog/dialog.service.ts)

## API

| Member | Signature | Notes |
|---|---|---|
| `open` | `<R, D>(component, config?: { data?: D }) => DialogRef<R>` | Renders `component` in a modal overlay |
| `confirm` | `(options: ConfirmOptions) => Promise<boolean>` | Built-in confirmation; resolves `true`/`false` |
| `DialogRef.close` | `(result?: R) => void` | Dismiss + resolve `closed` |
| `DialogRef.closed` | `Promise<R \| undefined>` | Awaitable result |
| `DIALOG_DATA` | `InjectionToken` | Inject inside the dialog component to read `config.data` |

```ts
interface ConfirmOptions {
  title?: string; message?: string;
  confirmLabel?: string; cancelLabel?: string;
  variant?: 'confirmation' | 'destructive';
}
```

**Exported types:** `ConfirmOptions`, plus `DialogRef`, `DIALOG_DATA` values.

## Usage

```ts
private dialog = inject(DialogService);

if (await this.dialog.confirm({ title: 'Delete?', variant: 'destructive' })) { /* … */ }

const ref = this.dialog.open<MyResult, MyData>(MyDialog, { data: { id } });
const result = await ref.closed;
```
```ts
// inside MyDialog
readonly ref = inject<DialogRef<MyResult>>(DialogRef);
readonly data = inject<MyData>(DIALOG_DATA);
```

## Composition

- Centered CDK overlay with scrim + scroll-block; provides `DialogRef` + `DIALOG_DATA` to the
  content component via a child injector. Ships `DfConfirmDialog` as the default `confirm()` UI,
  styled with the shared `modal.scss`.

## Accessibility

- `role="dialog"`, `aria-modal`, focus trap (auto-focus first, Tab cycle), Escape + backdrop
  dismiss, return focus on close — mirrors `df-modal`.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| typed result/data | ✅ | Generic `open<R, D>` / `DialogRef<R>` (the typing other components lack) |
| a11y | ✅ | Full focus-trap dialog |
| §8 tokens | ✅ | Shares `modal.scss` |

## Notes / TODO

- `df-modal` and `DialogService` duplicate the dialog shell/focus-trap — candidate to extract
  a shared dialog primitive.
