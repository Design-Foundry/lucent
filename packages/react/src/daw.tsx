import { useRef, useState } from 'react';
import { cx } from './cx';

const clamp = (v: number, lo: number, hi: number): number => Math.min(hi, Math.max(lo, v));

export interface KnobProps {
  min?: number;
  max?: number;
  value?: number;
  defaultValue?: number;
  bipolar?: boolean;
  disabled?: boolean;
  size?: number;
  onInput?: (value: number) => void;
  onChange?: (value: number) => void;
  ariaLabel?: string;
  className?: string;
}

/** A rotary control (270° arc). Vertical drag / wheel / arrows adjust; dbl-click resets. */
export function Knob({ min = 0, max = 1, value, defaultValue, bipolar = false, disabled = false, size = 72, onInput, onChange, ariaLabel, className }: KnobProps) {
  const controlled = value !== undefined;
  const seed = defaultValue ?? value ?? (bipolar ? (min + max) / 2 : min);
  const [internal, setInternal] = useState(seed);
  const cur = controlled ? (value as number) : internal;
  const curRef = useRef(cur);
  curRef.current = cur;
  const defaultRef = useRef(seed);

  const set = (v: number) => {
    const nv = clamp(v, min, max);
    if (nv === curRef.current) return;
    curRef.current = nv;
    if (!controlled) setInternal(nv);
    onInput?.(nv);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    const sy = e.clientY, sv = cur;
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* capture optional */ }
    const move = (ev: PointerEvent) => set(sv + (sy - ev.clientY) / 180 * (max - min));
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); onChange?.(curRef.current); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    e.preventDefault();
  };

  const onWheel = (e: React.WheelEvent) => { if (disabled) return; const step = (max - min) / 100; set(cur - Math.sign(e.deltaY) * step * (e.shiftKey ? 0.2 : 1)); };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const step = (max - min) / (e.shiftKey ? 200 : 20);
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); set(cur + step); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); set(cur - step); }
  };
  const onDoubleClick = () => { if (!disabled) set(defaultRef.current); };

  const s = size, r = s * 0.34, cxp = s / 2, cyp = s / 2, w = s * 0.08;
  const t = (cur - min) / (max - min);
  const A0 = 135, A1 = 405, curDeg = A0 + t * 270;
  const pol = (deg: number, rr: number): [number, number] => { const a = deg * Math.PI / 180; return [cxp + rr * Math.cos(a), cyp + rr * Math.sin(a)]; };
  const arc = (a: number, b: number, rr: number): string => {
    const [x0, y0] = pol(a, rr), [x1, y1] = pol(b, rr);
    const lg = (b - a) > 180 ? 1 : 0;
    return `M${x0.toFixed(2)} ${y0.toFixed(2)} A${rr} ${rr} 0 ${lg} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
  };
  const from = bipolar ? 270 : A0;
  const [ix, iy] = pol(curDeg, r), [ix0, iy0] = pol(curDeg, r * 0.42);

  return (
    <div
      className={cx('lucent-knob', disabled && 'is-disabled', className)}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-valuenow={Number(cur.toFixed(2))}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-disabled={disabled || undefined}
      onPointerDown={onPointerDown}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      onDoubleClick={onDoubleClick}
    >
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`} aria-hidden="true">
        <path d={arc(A0, A1, r)} fill="none" stroke="var(--color--semantic--border-default)" strokeWidth={w} strokeLinecap="round" />
        <path d={arc(Math.min(from, curDeg), Math.max(from, curDeg), r)} fill="none" stroke="var(--color--semantic--accent-default)" strokeWidth={w} strokeLinecap="round" />
        <circle cx={cxp} cy={cyp} r={r * 0.6} fill="var(--color--semantic--surface-raised)" stroke="var(--color--semantic--border-subtle)" />
        <line x1={Number(ix0.toFixed(2))} y1={Number(iy0.toFixed(2))} x2={Number(ix.toFixed(2))} y2={Number(iy.toFixed(2))} stroke="var(--color--semantic--text-default)" strokeWidth={2} strokeLinecap="round" />
      </svg>
    </div>
  );
}

export interface FaderProps {
  min?: number;
  max?: number;
  value?: number;
  defaultValue?: number;
  disabled?: boolean;
  size?: number;
  onInput?: (value: number) => void;
  onChange?: (value: number) => void;
  ariaLabel?: string;
  className?: string;
}

/** A channel fader with a tapered dB scale (unity at 75% travel). Click/drag/wheel/arrows. */
export function Fader({ min = -60, max = 6, value, defaultValue, disabled = false, size = 200, onInput, onChange, ariaLabel, className }: FaderProps) {
  const controlled = value !== undefined;
  const seed = defaultValue ?? value ?? 0;
  const [internal, setInternal] = useState(seed);
  const cur = controlled ? (value as number) : internal;
  const curRef = useRef(cur);
  curRef.current = cur;
  const trackRef = useRef<HTMLDivElement>(null);

  // Fader taper: unity (0 dB) sits at 75% of travel, like a real channel fader.
  const dbToP = (db: number): number => db >= 0 ? 0.75 + (db / max) * 0.25 : 0.75 * (1 + db / (-min));
  const pToDb = (p: number): number => p >= 0.75 ? (p - 0.75) / 0.25 * max : (p / 0.75 - 1) * (-min);

  const set = (v: number) => {
    const nv = clamp(v, min, max);
    if (nv === curRef.current) return;
    curRef.current = nv;
    if (!controlled) setInternal(nv);
    onInput?.(nv);
  };

  const posFromEvent = (clientY: number): number => {
    const track = trackRef.current;
    if (!track) return 0;
    const r = track.getBoundingClientRect();
    return clamp((r.bottom - clientY) / r.height, 0, 1);
  };

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    set(pToDb(posFromEvent(e.clientY)));
    try { (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); } catch { /* capture optional */ }
    const move = (ev: PointerEvent) => set(pToDb(posFromEvent(ev.clientY)));
    const up = () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); onChange?.(curRef.current); };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    e.preventDefault();
  };

  const onWheel = (e: React.WheelEvent) => { if (disabled) return; set(cur - Math.sign(e.deltaY) * (e.shiftKey ? 0.2 : 1)); };
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;
    const s = e.shiftKey ? 0.2 : 1;
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') { e.preventDefault(); set(cur + s); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') { e.preventDefault(); set(cur - s); }
  };
  const onDoubleClick = () => { if (!disabled) set(0); };

  const W = 40, H = size;
  const y = dbToP(cur) * H;
  const ticks = [6, -6, -12, -24, -48];

  return (
    <div
      className={cx('lucent-fader', disabled && 'is-disabled', className)}
      role="slider"
      tabIndex={disabled ? -1 : 0}
      aria-label={ariaLabel}
      aria-valuenow={Number(cur.toFixed(1))}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-disabled={disabled || undefined}
      style={{ width: W, height: H }}
      onPointerDown={onPointerDown}
      onWheel={onWheel}
      onKeyDown={onKeyDown}
      onDoubleClick={onDoubleClick}
    >
      <div ref={trackRef} className="lucent-fader__track" style={{ left: W / 2 - 3, top: 0, width: 6, height: H }} />
      <div className="lucent-fader__fill" style={{ left: W / 2 - 3, width: 6, bottom: 0, height: y }} />
      {ticks.map((db) => (
        <div key={db} className="lucent-fader__tick" style={{ left: W / 2 + 6, width: 5, height: 1, bottom: dbToP(db) * H - 0.5 }} />
      ))}
      <div className="lucent-fader__unity" style={{ left: W / 2 - 9, width: 18, height: 2, bottom: dbToP(0) * H - 1 }} />
      <div className="lucent-fader__thumb" style={{ left: W / 2 - 14, width: 28, height: 12, bottom: y - 6 }} />
    </div>
  );
}
