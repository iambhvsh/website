<script lang="ts" module>
  let shapeUid = 0;
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import { untrack } from 'svelte';
  import {
    createInterruptibleMorph,
    getShapePath,
    type ShapeName,
    type SpringPreset,
  } from '$lib/shapes';

  interface Props {
    shape: ShapeName;
    spring?: SpringPreset;
    spin?: boolean;
    masked?: boolean;
    class?: string;
    ariaHidden?: boolean;
    children?: Snippet;
  }

  let {
    shape,
    spring = 'default',
    spin = false,
    masked = false,
    class: className = '',
    ariaHidden = false,
    children,
  }: Props = $props();

  const clipId = `m3-shape-${++shapeUid}`;
  const initialPath = untrack(() => getShapePath(shape));
  let containerEl = $state<HTMLDivElement | undefined>(undefined);
  let pathEl = $state<SVGPathElement | undefined>(undefined);

  const controller = untrack(() =>
    createInterruptibleMorph(shape, (d) => {
      pathEl?.setAttribute('d', d);
    })
  );

  $effect(() => {
    if (!pathEl) return;
    controller.morphTo(shape, spring);
  });

  $effect(() => {
    if (!containerEl || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) controller.setVisible(entry.isIntersecting);
      },
      { rootMargin: '120px' }
    );
    io.observe(containerEl);
    return () => io.disconnect();
  });

  $effect(() => {
    return () => controller.destroy();
  });
</script>

{#if masked}
  <svg class="clip-defs" width="0" height="0" aria-hidden="true" focusable="false">
    <defs>
      <clipPath id={clipId} clipPathUnits="objectBoundingBox">
        <path bind:this={pathEl} d={initialPath} />
      </clipPath>
    </defs>
  </svg>

  <div
    bind:this={containerEl}
    class="morph-shape masked {className}"
    class:spinning={spin}
    style:clip-path="url(#{clipId})"
    aria-hidden={ariaHidden || undefined}
  >
    {@render children?.()}
  </div>
{:else}
  <div
    bind:this={containerEl}
    class="morph-shape {className}"
    aria-hidden={ariaHidden || undefined}
  >
    <svg
      class="shape-svg"
      class:spinning={spin}
      viewBox="0 0 1 1"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path bind:this={pathEl} d={initialPath} />
    </svg>
    <div class="shape-content">
      {@render children?.()}
    </div>
  </div>
{/if}

<style>
  .clip-defs {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
  }

  .morph-shape {
    position: relative;
    display: grid;
    place-items: center;
    contain: layout style;
  }

  .morph-shape.masked {
    contain: layout style paint;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    will-change: transform;
  }

  .shape-svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    fill: var(--shape-fill, currentColor);
    pointer-events: none;
    overflow: visible;
    contain: layout style paint;
    transform: translate3d(0, 0, 0);
    backface-visibility: hidden;
    will-change: transform;
    transition: fill var(--dur-med2) var(--ease-emphasized);
  }

  .shape-content {
    position: relative;
    z-index: 1;
    display: grid;
    place-items: center;
  }

  .spinning {
    animation: m3-shape-spin 6.5s linear infinite;
  }

  @keyframes m3-shape-spin {
    to {
      transform: translate3d(0, 0, 0) rotate(360deg);
    }
  }
</style>
