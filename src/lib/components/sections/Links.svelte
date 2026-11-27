<script lang="ts">
  import { Section } from '$lib/components/ui';
  import { EXTERNAL_LINKS } from '$lib/data/links';
  import Link from './Link.svelte';
</script>

<Section id="links" title="Elsewhere">
  <div class="links">
    {#each EXTERNAL_LINKS as item (item.href)}
      <Link {item} />
    {/each}
  </div>
</Section>

<style>
  .links {
    display: grid;
    gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
</style>
