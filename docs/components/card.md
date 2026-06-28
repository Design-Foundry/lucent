# `DfCard` — `<df-card>`

> A surface container. Projects arbitrary content onto a card background (radius, border,
> shadow from tokens).

**Tier:** Container
**Selector:** `df-card`
**Source:** [`../../card/card.ts`](../../card/card.ts)

## API

No inputs/outputs. `template: '<ng-content />'`; all styling in `card.scss`.

**Content slots:** default — any content.
**Exported types:** none.

## Usage

```html
<df-card>
  <div style="padding: 1rem">
    <h3>Title</h3>
    <p>Body content on a card surface.</p>
  </div>
</df-card>
```

## Composition

- Pure surface wrapper; no header/media/footer regions or padding opinion (consumer pads).

## States & accessibility

- No interactive state or role; it's a presentational surface.

## Conventions check

| Rule | Status | Note |
|---|---|---|
| §5 content model | ✅ | Projection container |
| §8 tokens | ✅ | Surface/radius/shadow tokens |

## Notes / TODO

- Consider optional structured slots (`dfCardHeader`/media/actions) and a padding/elevation
  variant if richer cards are needed.
