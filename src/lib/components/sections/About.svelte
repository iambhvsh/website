<script lang="ts">
  import { Badge, Panel, Scroll, Section, Shape } from '$lib/components/ui';
  import { SITE } from '$lib/data/site';
  import {
    BADGE_HOVER_SHAPES,
    BADGE_REST_SHAPES,
    HERO_SHAPE_CYCLE,
    type ShapeName,
  } from '$lib/shapes';
  import DarkModeIcon from '~icons/material-symbols/dark-mode-outline-rounded';
  import GridViewIcon from '~icons/material-symbols/grid-view-outline-rounded';
  import LocationOnIcon from '~icons/material-symbols/location-on-outline-rounded';
  import PersonIcon from '~icons/material-symbols/person-outline-rounded';
  import SchoolIcon from '~icons/material-symbols/school-outline-rounded';

  const HIGHLIGHTS = [
    { label: 'Archive', value: '7 projects', icon: GridViewIcon },
    { label: 'Hours', value: 'Late nights', icon: DarkModeIcon },
    { label: 'Based in', value: SITE.location, icon: LocationOnIcon },
    { label: 'Degree', value: 'BSc IT', icon: SchoolIcon },
  ] as const;

  let hovered = $state<number | null>(null);
  let hoverCount = $state(0);
  let heroShapeIdx = $state(0);

  function getShape(index: number): ShapeName {
    if (hovered === index) {
      return BADGE_HOVER_SHAPES[(index + hoverCount) % BADGE_HOVER_SHAPES.length];
    }
    return BADGE_REST_SHAPES[index % BADGE_REST_SHAPES.length];
  }
</script>

<Section id="about">
  <div class="about-hero">
    <div class="hero-left">
      <div class="about-head">
        <span class="label eyebrow">About</span>
        <h1 class="hero about-title">Bhavesh</h1>
        <p class="bm intro">
          Building web interfaces, developer tools and small systems.
        </p>
      </div>

      <dl class="chips-row">
        {#each HIGHLIGHTS as item, i (item.label)}
          {@const IconComponent = item.icon}
          <div
            class="info-chip"
            role="presentation"
            onpointerenter={() => {
              hovered = i;
              hoverCount += 1;
            }}
            onpointerleave={() => {
              hovered = null;
            }}
          >
            <Badge shape={getShape(i)} tone="primary" spring="fast">
              <IconComponent />
            </Badge>
            <div class="chip-meta">
              <dt class="label chip-label">{item.label}</dt>
              <dd class="tm flex600">{item.value}</dd>
            </div>
          </div>
        {/each}
      </dl>
    </div>

    <div
      class="hero-visual"
      role="presentation"
      onpointerenter={() => (heroShapeIdx = (heroShapeIdx + 1) % HERO_SHAPE_CYCLE.length)}
      onclick={() => (heroShapeIdx = (heroShapeIdx + 1) % HERO_SHAPE_CYCLE.length)}
    >
      <Shape
        shape={HERO_SHAPE_CYCLE[heroShapeIdx]}
        spring="default"
        class="visual-shape"
      >
        <span class="visual-icon" aria-hidden="true">
          <PersonIcon />
        </span>
      </Shape>
    </div>

    <div class="hero-scroll">
      <Scroll href="#bio" label="Read more" />
    </div>
  </div>

  <div id="bio" class="bio-section">
    <Panel class="bio">
      <p class="bl inline">
        Pursuing a <b>Bachelor of Science in Information Technology</b> while independently
        building web interfaces, developer tools and small systems.
      </p>
      <p class="bl inline">
        The interest in technology started early and mostly self-directed. Over time it
        became more focused: building things with care, and paying attention to the
        difference between software that <b>works</b> and software that <b>feels right</b>.
      </p>
      <p class="bl inline">
        Most projects are frontend. Transition timing, state, layout density, behaviour
        under edge conditions. Small decisions that compound. The preference throughout:
        do less, but do it carefully.
      </p>
    </Panel>
  </div>
</Section>

<style>
  :global(#about.page-section) {
    padding-top: 48px !important;
  }

  .about-hero {
    position: relative;
    min-height: calc(100svh - 88px);
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    align-items: center;
    align-content: center;
    gap: 48px;
    padding: 20px 0 80px;
  }

  .hero-left {
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
  }

  .about-head {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .eyebrow {
    color: var(--p);
  }

  .about-title {
    font-size: clamp(40px, 6.5vw, 72px);
    line-height: 0.96;
    letter-spacing: -0.02em;
  }

  .intro {
    font-size: clamp(16px, 1.8vw, 19px);
    color: var(--onv);
    max-width: 42ch;
  }

  .chips-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .info-chip {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    width: fit-content;
    max-width: 100%;
    padding: 8px 20px 8px 8px;
    border-radius: 9999px;
    background: var(--sf);
    color: var(--on);
    transition: background-color var(--dur-med2) var(--ease-emphasized);
  }

  .info-chip:hover {
    background: var(--sf2);
  }

  .chip-meta {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  .chip-label {
    color: var(--p);
  }

  .hero-visual {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .hero-visual :global(.visual-shape) {
    width: 280px;
    height: 280px;
    --shape-fill: var(--pc);
    color: var(--onpc);
  }

  .hero-scroll {
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
  }

  .visual-icon {
    display: grid;
    place-items: center;
  }

  .visual-icon :global(.ms-icon) {
    font-size: 96px;
  }

  .bio-section {
    padding: 32px 0 16px;
  }

  :global(.bio) p {
    color: var(--onv);
  }

  :global(.bio) b {
    color: var(--on);
    font-weight: 600;
  }

  :global(.bio) p + p {
    margin-top: 16px;
  }

  @media (max-width: 860px) {
    .about-hero {
      grid-template-columns: 1fr;
      gap: 24px;
      align-content: center;
      padding: 16px 0 24px;
    }

    .hero-visual {
      order: -1;
      justify-content: center;
      width: 100%;
      max-width: 360px;
      margin: 0 auto;
      min-height: 220px;
      padding: 24px 20px;
      background: var(--sf);
      border-radius: 32px;
    }

    .hero-left,
    .about-head {
      align-items: center;
      text-align: center;
    }

    .chips-row {
      justify-content: center;
    }

    .info-chip {
      text-align: left;
    }

    .hero-visual :global(.visual-shape) {
      width: 172px;
      height: 172px;
    }

    .visual-icon :global(.ms-icon) {
      font-size: 64px;
    }
  }

  @media (max-width: 640px) {
    :global(#about.page-section) {
      padding-top: 20px !important;
    }

    .about-hero {
      min-height: calc(100svh - 56px);
      align-content: center;
      gap: 20px;
      padding: 36px 0 68px;
    }

    .hero-left {
      gap: 14px;
    }

    .chips-row {
      gap: 8px;
    }

    .info-chip {
      padding: 5px 12px 5px 5px;
      gap: 8px;
    }

    .info-chip :global(.badge.morph-shape) {
      width: 38px;
      height: 38px;
    }

    .info-chip :global(.badge.morph-shape .ms-icon) {
      font-size: 19px;
    }

    :global(.bio) {
      padding: 24px;
    }
  }
</style>
