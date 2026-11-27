<script lang="ts">
  import { Section, Panel, Pill } from '$lib/components/ui';
  import { STACK_GROUPS } from '$lib/data/stack';
</script>

<Section id="stack" title="Stack">
  <div class="stack-grid">
    {#each STACK_GROUPS as group (group.title)}
      <Panel class="stack-panel">
        <h3 class="tl flex600">{group.title}</h3>
        <div class="tags">
          {#each group.items as item (item)}
            <Pill label={item} compact />
          {/each}
        </div>
      </Panel>
    {/each}
  </div>
</Section>

<style>
  .stack-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }

  :global(.stack-panel) h3 {
    margin-bottom: 14px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
</style>
