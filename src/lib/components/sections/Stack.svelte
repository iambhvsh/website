<script lang="ts">
  import type { Component } from 'svelte';
  import { Badge, Panel, Pill, Section } from '$lib/components/ui';
  import { STACK_GROUPS } from '$lib/data/stack';
  import { BADGE_HOVER_SHAPES, BADGE_REST_SHAPES, type ShapeName } from '$lib/shapes';
  import AndroidIcon from '~icons/material-symbols/android';
  import DnsIcon from '~icons/material-symbols/dns-outline-rounded';
  import LanguageIcon from '~icons/material-symbols/language';

  const GROUP_ICONS: Record<string, Component> = {
    Web: LanguageIcon,
    Android: AndroidIcon,
    Backend: DnsIcon,
  };

  let hoveredIndex = $state<number | null>(null);
  let hoverCount = $state(0);

  function getShape(index: number): ShapeName {
    if (hoveredIndex === index) {
      return BADGE_HOVER_SHAPES[(index + hoverCount) % BADGE_HOVER_SHAPES.length];
    }
    return BADGE_REST_SHAPES[index % BADGE_REST_SHAPES.length];
  }

  function getTone(index: number): 'primary' | 'secondary' | 'tertiary' {
    return index % 3 === 1 ? 'secondary' : index % 3 === 2 ? 'tertiary' : 'primary';
  }
</script>

<Section id="stack" title="Stack">
  <div class="stack-grid">
    {#each STACK_GROUPS as group, i (group.title)}
      {@const IconComponent = GROUP_ICONS[group.title] ?? LanguageIcon}
      <div
        class="stack-wrap"
        role="presentation"
        onpointerenter={() => {
          hoveredIndex = i;
          hoverCount += 1;
        }}
        onpointerleave={() => {
          hoveredIndex = null;
        }}
      >
        <Panel class="stack-panel">
          <div class="stack-head">
            <Badge shape={getShape(i)} tone={getTone(i)} spring="fast">
              <IconComponent />
            </Badge>
            <h3 class="tl flex600">{group.title}</h3>
          </div>
          <div class="tags">
            {#each group.items as item (item)}
              <Pill label={item} compact />
            {/each}
          </div>
        </Panel>
      </div>
    {/each}
  </div>
</Section>

<style>
  .stack-grid {
    display: grid;
    gap: 16px;
    grid-template-columns: 1.45fr 1fr 0.85fr;
  }

  @media (max-width: 900px) {
    .stack-grid {
      grid-template-columns: 1fr;
    }
  }

  .stack-wrap {
    display: flex;
  }

  .stack-wrap :global(.stack-panel) {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .stack-head {
    display: flex;
    align-items: center;
    gap: 14px;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
</style>
