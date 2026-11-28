<script lang="ts">
  import Shape from './Shape.svelte';
  import { LOADING_SHAPES } from '$lib/shapes';

  interface Props {
    size?: 'sm' | 'md' | 'lg';
    contained?: boolean;
    label?: string;
    class?: string;
  }

  let {
    size = 'md',
    contained = true,
    label,
    class: className = '',
  }: Props = $props();

  let shapeIndex = $state(0);

  $effect(() => {
    if (
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    const timer = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      shapeIndex = (shapeIndex + 1) % LOADING_SHAPES.length;
    }, 650);

    return () => clearInterval(timer);
  });
</script>

<div
  class="loader-wrap {className}"
  role="status"
  aria-live="polite"
  aria-label={label || 'Loading'}
>
  <div class="loader-box {size}" class:contained>
    <Shape
      shape={LOADING_SHAPES[shapeIndex]}
      spring="fast"
      spin
      ariaHidden
      class="loader-shape"
    />
  </div>
  {#if label}
    <span class="bm loader-label">{label}</span>
  {/if}
</div>

<style>
  .loader-wrap {
    display: inline-flex;
    align-items: center;
    gap: 14px;
  }

  .loader-box {
    display: grid;
    place-items: center;
    flex: none;
    border-radius: 50%;
    --shape-fill: var(--p);
  }

  .loader-box.contained {
    background: var(--pc);
  }

  .loader-box.sm {
    width: 36px;
    height: 36px;
  }

  .loader-box.sm :global(.loader-shape) {
    width: 22px;
    height: 22px;
  }

  .loader-box.md {
    width: 48px;
    height: 48px;
  }

  .loader-box.md :global(.loader-shape) {
    width: 28px;
    height: 28px;
  }

  .loader-box.lg {
    width: 64px;
    height: 64px;
  }

  .loader-box.lg :global(.loader-shape) {
    width: 38px;
    height: 38px;
  }

  .loader-label {
    color: var(--onv);
  }
</style>
