<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    href?: string;
    external?: boolean;
    compact?: boolean;
    class?: string;
    onpointerenter?: () => void;
    onpointerleave?: () => void;
    children?: Snippet;
  }

  let {
    href,
    external = false,
    compact = false,
    class: className = '',
    onpointerenter,
    onpointerleave,
    children,
  }: Props = $props();
</script>

{#if href}
  <a
    class="card surface-morph interactive {className}"
    class:compact
    {href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    {onpointerenter}
    {onpointerleave}
  >
    {@render children?.()}
  </a>
{:else}
  <div
    class="card surface-morph {className}"
    class:compact
    role="presentation"
    {onpointerenter}
    {onpointerleave}
  >
    {@render children?.()}
  </div>
{/if}

<style>
  .card {
    display: flex;
    flex-direction: column;
    gap: 12px;
    background: var(--sf);
    color: inherit;
    text-decoration: none;
    padding: 24px;
    min-height: 220px;
  }

  .card.compact {
    min-height: 0;
  }

  .card:hover {
    background: var(--sf3);
  }

  .card:focus-visible {
    outline: 3px solid var(--p);
    outline-offset: 3px;
  }
</style>
