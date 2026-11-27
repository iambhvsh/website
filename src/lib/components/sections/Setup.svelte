<script lang="ts">
  import type { Snippet } from 'svelte';
  import { Badge, Card, Scroll, Section } from '$lib/components/ui';
  import type { SetupApp, SpecItem } from '$lib/data/mac';
  import { BADGE_HOVER_SHAPES, BADGE_REST_SHAPES, type ShapeName } from '$lib/shapes';
  import ArrowOutwardIcon from '~icons/material-symbols/arrow-outward-rounded';

  interface Props {
    id: string;
    title: string;
    subtitle: string;
    specs: readonly SpecItem[];
    appsTitle: string;
    apps: readonly SetupApp[];
    centered?: boolean;
    illustration?: Snippet;
  }

  let {
    id,
    title,
    subtitle,
    specs,
    appsTitle,
    apps,
    centered = false,
    illustration,
  }: Props = $props();

  let hoveredSpec = $state<number | null>(null);
  let specHoverCount = $state(0);

  function getSpecShape(index: number): ShapeName {
    if (hoveredSpec === index) {
      return BADGE_HOVER_SHAPES[(index + specHoverCount) % BADGE_HOVER_SHAPES.length];
    }
    return BADGE_REST_SHAPES[index % BADGE_REST_SHAPES.length];
  }

  function getStageTone(index: number): string {
    const tones = ['stage-primary', 'stage-secondary', 'stage-tertiary'];
    return tones[index % tones.length];
  }
</script>

<Section {id} class={centered ? 'setup-page setup-centered' : 'setup-page'}>
  <div class="setup-hero" class:split={Boolean(illustration)}>
    <div class="hero-left">
      <div class="hero-head">
        <span class="eyebrow label">{id === 'mac' ? 'Workstation' : 'Daily driver'}</span>
        <h1 class="hero-title hero">{title}</h1>
        <p class="bm intro">{subtitle}</p>
      </div>

      <dl class="specs-row">
        {#each specs as spec, i (spec.label)}
          {@const SpecIcon = spec.icon}
          <div
            class="spec-chip"
            role="presentation"
            onpointerenter={() => {
              hoveredSpec = i;
              specHoverCount += 1;
            }}
            onpointerleave={() => {
              hoveredSpec = null;
            }}
          >
            <Badge shape={getSpecShape(i)} tone="primary" spring="fast">
              <SpecIcon />
            </Badge>
            <div class="spec-meta">
              <dt class="label spec-label">{spec.label}</dt>
              <dd class="tm flex600 spec-val">{spec.value}</dd>
            </div>
          </div>
        {/each}
      </dl>
    </div>

    {#if illustration}
      <div class="hero-visual">
        {@render illustration()}
      </div>
    {/if}

    <div class="hero-scroll">
      <Scroll href="#apps" label={appsTitle} />
    </div>
  </div>

  <div id="apps" class="apps-section">
    <h2 class="headline apps-heading">{appsTitle}</h2>

    <div class="masonry">
      {#each apps as app, i (app.name)}
        {@const IconComponent = app.icon}
        <div class="masonry-item">
          <Card
            compact
            href={app.url}
            external={Boolean(app.url)}
            class="setup-card"
          >
            {#if app.image && app.imageKind === 'banner'}
              <div class="app-banner">
                <img
                  src={app.image}
                  alt={app.name}
                  loading="lazy"
                />
              </div>
            {:else if app.image}
              <div
                class="app-icon-stage {app.stageColor ? '' : getStageTone(i)}"
                style:background={app.stageColor
                  ? `color-mix(in srgb, ${app.stageColor} 28%, var(--sf2))`
                  : undefined}
              >
                <img
                  src={app.image}
                  alt="{app.name} icon"
                  class="app-thumb"
                  loading="lazy"
                />
              </div>
            {:else}
              <div class="app-icon-stage {getStageTone(i)}">
                <span class="app-icon" aria-hidden="true">
                  <IconComponent />
                </span>
              </div>
            {/if}

            <div class="app-meta">
              <div class="app-top">
                <span class="label app-cat">{app.category}</span>
                {#if app.url}
                  <ArrowOutwardIcon class="ext-icon" aria-hidden="true" />
                {/if}
              </div>
              <h3 class="tl flex600">{app.name}</h3>
              <p class="bm app-desc">{app.description}</p>
            </div>
          </Card>
        </div>
      {/each}
    </div>
  </div>
</Section>

<style>
  :global(.setup-page) {
    padding-top: 48px !important;
  }

  .setup-hero {
    position: relative;
    min-height: calc(100svh - 88px);
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 28px;
    padding: 20px 0 80px;
  }

  .setup-hero.split {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    align-items: center;
    align-content: center;
    gap: 48px;
  }

  .hero-left {
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
  }

  .hero-head {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .eyebrow {
    color: var(--p);
  }

  .hero-title {
    font-size: clamp(40px, 6.5vw, 72px);
    line-height: 0.96;
    letter-spacing: -0.02em;
  }

  .intro {
    font-size: clamp(16px, 1.8vw, 19px);
    color: var(--onv);
    max-width: 42ch;
  }

  .hero-visual {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .hero-scroll {
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
  }

  .specs-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .spec-chip {
    display: inline-flex;
    align-items: center;
    gap: 14px;
    width: fit-content;
    max-width: 100%;
    padding: 8px 20px 8px 8px;
    border-radius: 9999px;
    background: var(--sf);
    color: var(--on);
    transition:
      background-color var(--dur-med2) var(--ease-emphasized),
      border-radius var(--dur-spring-fast) var(--spring-fast);
  }

  .spec-chip:hover {
    background: var(--sf2);
  }

  .spec-meta {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  .spec-label {
    color: var(--p);
  }

  .apps-section {
    padding: 40px 0 32px;
  }

  .apps-heading {
    margin-bottom: 24px;
  }

  .masonry {
    columns: 3 260px;
    column-gap: 16px;
  }

  .masonry-item {
    break-inside: avoid;
    margin-bottom: 16px;
  }

  .masonry-item :global(.setup-card) {
    padding: 12px;
    gap: 14px;
  }

  .app-banner {
    width: 100%;
    border-radius: var(--r-lg);
    overflow: hidden;
    background: var(--sf2);
  }

  .app-banner img {
    width: 100%;
    height: auto;
    max-height: 210px;
    object-fit: cover;
    display: block;
  }

  .app-icon-stage {
    width: 100%;
    height: 124px;
    border-radius: var(--r-lg);
    display: grid;
    place-items: center;
    overflow: hidden;
  }

  .app-icon-stage.stage-primary {
    background: var(--pc);
    color: var(--onpc);
  }

  .app-icon-stage.stage-secondary {
    background: var(--sc);
    color: var(--onsc);
  }

  .app-icon-stage.stage-tertiary {
    background: var(--tc);
    color: var(--ontc);
  }

  .app-thumb {
    width: 68px;
    height: 68px;
    border-radius: var(--r-lg);
    object-fit: contain;
    filter: drop-shadow(0 8px 16px rgba(0, 0, 0, 0.18));
  }

  .app-icon {
    display: grid;
    place-items: center;
  }

  .app-icon :global(.ms-icon) {
    font-size: 40px;
  }

  .app-meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 8px 8px;
  }

  .app-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .app-cat {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 9999px;
    background: var(--sf2);
    color: var(--onv);
  }

  :global(.ext-icon) {
    color: var(--onv);
    font-size: 18px;
    flex: none;
    transition: color var(--dur-short4) var(--ease-emphasized);
  }

  .masonry-item:hover :global(.ext-icon) {
    color: var(--p);
  }

  .app-desc {
    color: var(--onv);
  }

  :global(.setup-centered) .setup-hero {
    align-items: center;
    text-align: center;
  }

  :global(.setup-centered) .hero-head {
    align-items: center;
  }

  :global(.setup-centered) .specs-row {
    justify-content: center;
  }

  :global(.setup-centered) .spec-chip {
    align-items: center;
    text-align: center;
  }

  :global(.setup-centered) .apps-heading {
    text-align: center;
  }

  @media (max-width: 860px) {
    .setup-hero.split {
      grid-template-columns: 1fr;
      gap: 24px;
      align-content: center;
      padding: 16px 0 24px;
    }

    .hero-visual {
      order: -1;
      justify-content: center;
      min-height: 220px;
      padding: 28px 20px;
      background: var(--sf);
      border-radius: var(--r-card);
    }
  }

  @media (max-width: 640px) {
    :global(.setup-page) {
      padding-top: 28px !important;
    }

    .setup-hero {
      min-height: calc(100svh - 64px);
      gap: 20px;
      padding: 8px 0 72px;
    }

    .hero-left {
      gap: 14px;
    }

    .specs-row {
      gap: 8px;
    }

    .spec-chip {
      padding: 5px 12px 5px 5px;
      gap: 8px;
    }

    .spec-chip :global(.badge.morph-shape) {
      width: 38px;
      height: 38px;
    }

    .spec-chip :global(.badge.morph-shape .ms-icon) {
      font-size: 19px;
    }

    .apps-section {
      padding: 28px 0 16px;
    }

    .app-banner img {
      max-height: 180px;
    }

    .app-icon-stage {
      height: 96px;
    }

    .app-thumb {
      width: 56px;
      height: 56px;
    }
  }
</style>
