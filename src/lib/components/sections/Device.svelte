<script lang="ts">
  import { Card, Badge } from '$lib/components/ui';
  import type { DeviceItem } from '$lib/data/devices';
  import { BADGE_HOVER_SHAPES, BADGE_REST_SHAPES, type ShapeName } from '$lib/shapes';

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
  onpointerenter={handlePointerEnter}
  onpointerleave={handlePointerLeave}
>
  <Badge shape={displayedShape} {tone} spring="fast">
    <IconComponent />
  </Badge>
  <h3 class="tl flex600">{device.name}</h3>
  <p class="bm desc">{device.description}</p>
</Card>

<style>
  .desc {
    color: var(--onv);
  }
</style>
