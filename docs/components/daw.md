# DAW Controls

Audio-workstation widgets. Unlike the rest of Lucent these render **SVG / canvas** and carry
**pointer interaction** (drag, resize, seek, real-time meters), so their behavior lives in each
kit's code rather than in shared markup. The shared CSS (`styles/components/daw.css`) still
tokenizes every color, cursor, focus ring, and the meter/waveform palettes.

Ported from the verified prototypes in `lucent-docs/public/daw/`. **Web Components + React** are
done; Angular + Blazor wrappers are a follow-up.

## Where they're named

| Control | React | Web Components | Package |
|---|---|---|---|
| Knob | `<Knob>` | `<lucent-knob>` | react / wc |
| Fader | `<Fader>` | `<lucent-fader>` | react / wc |
| Level Meter | `<Meter>` | `<lucent-meter>` | react / wc |
| Waveform | `<Waveform>` | `<lucent-waveform>` | react / wc |
| Track lane | `<Track>` | `<lucent-track>` | react / wc |
| Piano Roll | `<PianoRoll>` | `<lucent-piano-roll>` | react / wc |

## Knob

A 270° rotary. **Vertical drag** / wheel / arrow keys (shift = fine) adjust; double-click resets to
the initial value. `bipolar` draws the value arc out from 12 o'clock (for pan). `role="slider"`
with `aria-valuenow/min/max`.

| Prop | Type | Default | Notes |
|---|---|---|---|
| `min` / `max` | number | `0` / `1` | Range. |
| `value` | number | — | Controlled value (WC: property, not attribute). |
| `bipolar` | boolean | `false` | Center-anchored arc. |
| `size` | number | `72` | Diameter (px). |
| `disabled` | boolean | `false` | — |
| `input` / `onInput`, `change` / `onChange` | event | — | Live + commit. |

## Fader

A channel fader with a **tapered dB scale** — unity (0 dB) sits at 75% of travel, like a real
console. Click or drag the track to jump/scrub; wheel and arrows nudge; double-click → unity.
Scale ticks at 6 / −6 / −12 / −24 / −48.

| Prop | Type | Default |
|---|---|---|
| `min` / `max` | number | `-60` / `6` |
| `value` | number | — |
| `size` | number | `200` (track px) |
| `disabled` | boolean | `false` |

## Level Meter

A segmented meter (mono or `stereo`) with **green → amber → red** zones and **peak-hold** that
decays ~0.7 dB/frame. Drive it each animation frame by assigning `level` (dB per channel: `[-12]`
or `[-12, -9]`). `role="meter"`. LED colors are bright primitives — the semantic feedback tokens
read muddy as LEDs.

| Prop | Type | Default |
|---|---|---|
| `level` | number[] | — |
| `segments` | number | `14` |
| `stereo` | boolean | `false` |
| `min` / `max` | number | `-60` / `0` |

## Waveform

A **canvas** peak render. Click or drag to seek — the played portion is solid accent, the rest a
translucent accent, with a playhead line. Assign `peaks` (0–1 array); `progress` is 0–1.
Redraws on resize (`ResizeObserver`).

| Prop | Type | Default |
|---|---|---|
| `peaks` | number[] | `[]` |
| `progress` | number | `0` |
| `height` | number | `96` |
| `input`/`onInput`, `change`/`onChange` | event | — |

## Track lane

An arrangement view: track headers with **M / S / R** toggles + a bar ruler and lanes. Clips are
**audio** (canvas waveform) or **MIDI** (note blocks); drag a clip horizontally and it **snaps to
the bar grid** (clamped to the timeline). Drag the ruler to move the playhead. Driven by `tracks`
and `clips` data (sensible defaults render a demo arrangement).

## Piano Roll

A pitch × time note grid (2 octaves from C3, black keys shaded). **Drag a note** to move it (pitch
+ time), **drag its right edge** to resize, **click empty grid** to add, **select + Delete** to
remove, **drag the ruler** for the playhead. Snaps to 1/4 beat.

> Interaction note (shared by Track & Piano Roll): during a drag the dragged element's style is
> mutated directly and state is committed only on pointer-up. A re-render mid-drag would replace the
> node the listeners are bound to — the bug that was found and fixed in the prototype, preserved here.

## Accessibility & conventions

| Convention | Status |
|---|---|
| All colors / cursors / focus tokenized (`daw.css`) | ✅ |
| Knob / Fader / Waveform are `role="slider"`; Meter is `role="meter"` | ✅ |
| `try/catch` around `setPointerCapture` (robust to synthetic pointers) | ✅ |
| Shared 4-kit CSS-class contract | ⚠️ relaxed — these need per-kit JS (SVG/canvas + pointer) |
| Angular / Blazor kits | ⚠️ follow-up (WC + React first) |
| Dedicated meter-LED / secondary-brand (MIDI) tokens | ⚠️ flagged — currently bright primitives |
