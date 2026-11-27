<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    id: string;
    title?: string;
    class?: string;
    children?: Snippet;
  }

  let { id, title, class: className = '', children }: Props = $props();
</script>

<section {id} class="page-section {className}">
  {#if title}
    <h2 class="headline sec-h">{title}</h2>
  {/if}
  {@render children?.()}
</section>

<style>
  .page-section {
    padding: 72px 0 24px;
  }

  .sec-h {
    margin-bottom: 24px;
  }
</style>
