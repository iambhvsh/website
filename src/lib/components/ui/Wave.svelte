<script lang="ts">
  import { untrack } from 'svelte';

  interface Props {
    progress?: number;
    playing?: boolean;
    disabled?: boolean;
    ariaLabel?: string;
    onseek?: (ratio: number) => void;
  }

  let {
    progress = 0,
    playing = false,
    disabled = false,
    ariaLabel = 'Playback progress',
    onseek,
  }: Props = $props();

  let wrapEl = $state<HTMLDivElement | undefined>(undefined);
  let activePathEl = $state<SVGPathElement | undefined>(undefined);
  let trackLineEl = $state<SVGLineElement | undefined>(undefined);
  let width = $state(220);

  const height = 16;
  const centerY = height / 2;
  const strokeW = 3.5;
  const padX = strokeW / 2;
  const wavelength = 24;
  const maxAmplitude = 3.2;

  let phase = 0;
  let amplitude = 0;
  let rafId = 0;
  let lastTime = 0;
  let dragging = false;

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function buildActivePath(endX: number, amp: number, ph: number): string {
    if (endX <= padX + 0.5) return '';
    if (amp < 0.08) {
      return `M${padX.toFixed(1)} ${centerY}L${endX.toFixed(1)} ${centerY}`;
    }

    const k = (Math.PI * 2) / wavelength;
    const step = 2.5;
    let d = '';
    for (let x = padX; x < endX; x += step) {
      const y = centerY + Math.sin(x * k - ph) * amp;
      d += d ? `L${x.toFixed(1)} ${y.toFixed(2)}` : `M${x.toFixed(1)} ${y.toFixed(2)}`;
    }
    const endY = centerY + Math.sin(endX * k - ph) * amp;
    return `${d}L${endX.toFixed(1)} ${endY.toFixed(2)}`;
  }

  function renderFrame() {
    if (!activePathEl || !trackLineEl) return;

    const clamped = Math.max(0, Math.min(1, progress));
    const usable = Math.max(0, width - padX * 2);
    const endX = padX + usable * clamped;

    activePathEl.setAttribute('d', buildActivePath(endX, amplitude, phase));

    const gap = clamped > 0.005 ? 6 : 0;
    const trackStart = Math.min(width - padX, endX + gap);
    if (trackStart >= width - padX - 0.5) {
      trackLineEl.setAttribute('visibility', 'hidden');
    } else {
      trackLineEl.setAttribute('visibility', 'visible');
      trackLineEl.setAttribute('x1', trackStart.toFixed(1));
      trackLineEl.setAttribute('x2', (width - padX).toFixed(1));
    }
  }

  function tick(now: number) {
    const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;

    const targetAmp = playing && !prefersReducedMotion() ? maxAmplitude : 0;
    const ease = 1 - Math.exp(-10 * dt);
    amplitude += (targetAmp - amplitude) * ease;

    if (playing && !prefersReducedMotion()) {
      phase = (phase + dt * 5.2) % (Math.PI * 2);
    }

    renderFrame();

    const settled = !playing && amplitude < 0.05;
    if (settled) {
      amplitude = 0;
      renderFrame();
      rafId = 0;
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  function ensureRunning() {
    if (rafId || typeof requestAnimationFrame !== 'function') return;
    lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    rafId = requestAnimationFrame(tick);
  }

  $effect(() => {
    void progress;
    void width;
    untrack(renderFrame);
  });

  $effect(() => {
    if (playing || amplitude > 0.05) {
      ensureRunning();
    } else {
      untrack(renderFrame);
    }
  });

  $effect(() => {
    if (!wrapEl || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const nextW = entries[0]?.contentRect.width;
      if (nextW && nextW > 0) width = nextW;
    });
    ro.observe(wrapEl);
    return () => ro.disconnect();
  });

  $effect(() => {
    return () => {
      if (rafId && typeof cancelAnimationFrame === 'function') {
        cancelAnimationFrame(rafId);
      }
    };
  });

  function seekFromEvent(event: PointerEvent) {
    if (disabled || !wrapEl || !onseek) return;
    const rect = wrapEl.getBoundingClientRect();
    if (!rect.width) return;
    const ratio = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    onseek(ratio);
  }

  function handlePointerDown(event: PointerEvent) {
    if (disabled || !onseek) return;
    dragging = true;
    wrapEl?.setPointerCapture(event.pointerId);
    seekFromEvent(event);
  }

  function handlePointerMove(event: PointerEvent) {
    if (!dragging) return;
    seekFromEvent(event);
  }

  function handlePointerUp(event: PointerEvent) {
    if (!dragging) return;
    dragging = false;
    if (wrapEl?.hasPointerCapture(event.pointerId)) {
      wrapEl.releasePointerCapture(event.pointerId);
    }
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (disabled || !onseek) return;
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault();
      onseek(Math.min(1, progress + 0.05));
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault();
      onseek(Math.max(0, progress - 0.05));
    }
  }
</script>

<div
  bind:this={wrapEl}
  class="wave"
  class:disabled
  role="slider"
  tabindex={disabled ? -1 : 0}
  aria-label={ariaLabel}
  aria-valuemin={0}
  aria-valuemax={100}
  aria-valuenow={Math.round(Math.max(0, Math.min(1, progress)) * 100)}
  aria-disabled={disabled}
  onpointerdown={handlePointerDown}
  onpointermove={handlePointerMove}
  onpointerup={handlePointerUp}
  onpointercancel={handlePointerUp}
  onkeydown={handleKeyDown}
>
  <svg
    class="wave-svg"
    viewBox="0 0 {width} {height}"
    preserveAspectRatio="none"
    aria-hidden="true"
  >
    <line
      bind:this={trackLineEl}
      class="wave-track"
      x1={padX}
      y1={centerY}
      x2={width - padX}
      y2={centerY}
      stroke-width={strokeW}
      stroke-linecap="round"
    />
    <path
      bind:this={activePathEl}
      class="wave-active"
      fill="none"
      stroke-width={strokeW}
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</div>

<style>
  .wave {
    position: relative;
    flex: 1;
    min-width: 100px;
    height: 28px;
    display: flex;
    align-items: center;
    cursor: pointer;
    touch-action: none;
    border-radius: var(--r-sm);
  }

  .wave.disabled {
    cursor: default;
    opacity: 0.5;
  }

  .wave:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }

  .wave-svg {
    width: 100%;
    height: 16px;
    overflow: visible;
    contain: layout style paint;
    transform: translate3d(0, 0, 0);
  }

  .wave-track {
    stroke: currentColor;
    opacity: 0.24;
  }

  .wave-active {
    stroke: currentColor;
  }
</style>
