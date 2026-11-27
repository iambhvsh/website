<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    tone?: 'surface' | 'tertiary';
    class?: string;
    children?: Snippet;
  }

  let { tone = 'surface', class: className = '', children }: Props = $props();
</script>

<div class="panel surface-morph {tone} {className}">
  {@render children?.()}
</div>

<style>
  .panel {
    background: var(--sf);
    padding: 32px;
  }

  .panel.tertiary {
    background: var(--tc);
    color: var(--ontc);
  }
</style>
