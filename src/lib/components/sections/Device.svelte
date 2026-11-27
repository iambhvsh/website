<script lang="ts">
  import { Card, Badge } from '$lib/components/ui';
  import type { DeviceItem } from '$lib/data/devices';
  import { BADGE_HOVER_SHAPES, BADGE_REST_SHAPES, type ShapeName } from '$lib/shapes';
  import ArrowForwardIcon from '~icons/material-symbols/arrow-forward-rounded';

  interface Props {
    device: DeviceItem;
    index: number;
  }

  let { device, index }: Props = $props();

  const IconComponent = $derived(device.icon);
  const restShape = $derived(
    BADGE_REST_SHAPES[(index + 2) % BADGE_REST_SHAPES.length]
  );
  const tone = $derived<'primary' | 'secondary' | 'tertiary'>(
    index % 3 === 1 ? 'secondary' : index % 3 === 2 ? 'tertiary' : 'primary'
  );

  let hoverCount = $state(0);
  let activeShape = $state<ShapeName | null>(null);
  const displayedShape = $derived(activeShape ?? restShape);

  function handlePointerEnter() {
    const nextIdx = (index + hoverCount) % BADGE_HOVER_SHAPES.length;
    hoverCount += 1;
    activeShape = BADGE_HOVER_SHAPES[nextIdx];
  }

  function handlePointerLeave() {
    activeShape = restShape;
  }
</script>

<Card
  compact
  href={device.href}
  onpointerenter={handlePointerEnter}
  onpointerleave={handlePointerLeave}
>
  <div class="dev-top">
    <Badge shape={displayedShape} {tone} spring="fast">
      <IconComponent />
    </Badge>
    {#if device.href}
      <span class="dev-link label" aria-hidden="true">
        Setup
        <ArrowForwardIcon />
      </span>
    {/if}
  </div>
  <h3 class="tl flex600">{device.name}</h3>
  <p class="bm desc">{device.description}</p>
</Card>

<style>
  .dev-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .dev-link {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    border-radius: 9999px;
    background: var(--sf2);
    color: var(--p);
    transition: border-radius var(--dur-spring-fast) var(--spring-fast);
  }

  .dev-link :global(.ms-icon) {
    font-size: 16px;
  }

  .desc {
    color: var(--onv);
  }
</style>
