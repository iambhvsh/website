<script lang="ts">
  import { Badge, Section } from '$lib/components/ui';
  import { INTERESTS } from '$lib/data/interests';
  import { BADGE_HOVER_SHAPES, BADGE_REST_SHAPES, type ShapeName } from '$lib/shapes';

  let hoveredIndex = $state<number | null>(null);
  let hoverCount = $state(0);

  function getShape(index: number): ShapeName {
    if (hoveredIndex === index) {
      return BADGE_HOVER_SHAPES[(index + hoverCount) % BADGE_HOVER_SHAPES.length];
    }
    return BADGE_REST_SHAPES[(index + 1) % BADGE_REST_SHAPES.length];
  }

  function getTone(index: number): 'primary' | 'secondary' | 'tertiary' {
    return index % 3 === 1 ? 'secondary' : index % 3 === 2 ? 'tertiary' : 'primary';
  }
</script>

<Section id="interests" title="Interests">
  <div class="int">
    {#each INTERESTS as interest, i (interest.label)}
      {@const IconComponent = interest.icon}
      {#if interest.href}
        <a
          href={interest.href}
          class="interest-pill link"
          onpointerenter={() => {
            hoveredIndex = i;
            hoverCount += 1;
          }}
          onpointerleave={() => {
            hoveredIndex = null;
          }}
        >
          <Badge shape={getShape(i)} tone={getTone(i)} spring="fast">
            <IconComponent />
          </Badge>
          <span class="tm flex600">{interest.label}</span>
        </a>
      {:else}
        <div
          class="interest-pill"
          role="presentation"
          onpointerenter={() => {
            hoveredIndex = i;
            hoverCount += 1;
          }}
          onpointerleave={() => {
            hoveredIndex = null;
          }}
        >
          <Badge shape={getShape(i)} tone={getTone(i)} spring="fast">
            <IconComponent />
          </Badge>
          <span class="tm flex600">{interest.label}</span>
        </div>
      {/if}
    {/each}
  </div>
</Section>

<style>
  .int {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .interest-pill {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 6px 18px 6px 6px;
    border-radius: 9999px;
    background: var(--sf);
    color: var(--on);
    text-decoration: none;
    transition:
      background-color var(--dur-med2) var(--ease-emphasized),
      border-radius var(--dur-spring-fast) var(--spring-fast);
  }

  .interest-pill:hover {
    background: var(--sf2);
  }

  .interest-pill.link:active {
    border-radius: var(--r-lg);
  }

  .interest-pill :global(.badge.morph-shape) {
    width: 44px;
    height: 44px;
  }

  .interest-pill :global(.badge.morph-shape .ms-icon) {
    font-size: 20px;
  }
</style>
