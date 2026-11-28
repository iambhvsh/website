<script lang="ts">
  import { Button, Section, Shape } from '$lib/components/ui';
  import { NAV_ITEMS } from '$lib/data/site';
  import { router } from '$lib/stores/router.svelte';
  import { HERO_SHAPE_CYCLE } from '$lib/shapes';
  import ArrowBackIcon from '~icons/material-symbols/arrow-back-rounded';
  import HomeIcon from '~icons/material-symbols/home-rounded';

  let shapeIdx = $state(2);

  function cycleShape() {
    shapeIdx = (shapeIdx + 1) % HERO_SHAPE_CYCLE.length;
  }

  function goBack() {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      window.history.back();
      return;
    }
    router.navigate('/');
  }
</script>

<Section id="not-found">
  <div class="missing-hero">
    <div class="hero-left">
      <span class="error-pill label">Error 404</span>

      <h1 class="hero missing-title">Page not found</h1>

      <p class="bm missing-sub">
        <code class="path-chip">{router.current.path}</code>
        doesn’t exist or may have moved.
      </p>

      <div class="row acts">
        <Button href="/">
          {#snippet icon()}
            <HomeIcon />
          {/snippet}
          Go home
        </Button>

        <Button variant="tonal" onclick={goBack}>
          {#snippet icon()}
            <ArrowBackIcon />
          {/snippet}
          Go back
        </Button>
      </div>

      <div class="quick-nav" aria-label="Available pages">
        {#each NAV_ITEMS as item (item.href)}
          <a href={item.href} class="quick-pill label">{item.label}</a>
        {/each}
      </div>
    </div>

    <div
      class="hero-visual"
      role="presentation"
      onpointerenter={cycleShape}
      onclick={cycleShape}
    >
      <div class="stage surface-morph">
        <Shape
          shape={HERO_SHAPE_CYCLE[shapeIdx]}
          spring="default"
          class="visual-shape"
        >
          <span class="hero code-mark" aria-hidden="true">404</span>
        </Shape>
      </div>
    </div>
  </div>
</Section>

<style>
  :global(#not-found.page-section) {
    padding-top: 48px !important;
  }

  .missing-hero {
    min-height: calc(100svh - 140px);
    display: grid;
    grid-template-columns: 1.1fr 0.9fr;
    align-items: center;
    align-content: center;
    gap: 48px;
    padding: 20px 0 40px;
  }

  .hero-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 18px;
    min-width: 0;
  }

  .error-pill {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 9999px;
    background: var(--tc);
    color: var(--ontc);
  }

  .missing-title {
    font-size: clamp(42px, 6.8vw, 76px);
    line-height: 0.94;
    letter-spacing: -0.025em;
  }

  .missing-sub {
    font-size: clamp(16px, 1.8vw, 19px);
    color: var(--onv);
    max-width: 42ch;
    line-height: 1.6;
  }

  .path-chip {
    display: inline-block;
    padding: 2px 10px;
    border-radius: 9999px;
    background: var(--sf2);
    color: var(--on);
    font-family: inherit;
    font-size: 0.92em;
    max-width: 100%;
    overflow-wrap: anywhere;
  }

  .quick-nav {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding-top: 4px;
  }

  .quick-pill {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 9999px;
    background: var(--sf);
    color: var(--onv);
    text-decoration: none;
    transition:
      background-color var(--dur-short4) var(--ease-emphasized),
      color var(--dur-short4) var(--ease-emphasized),
      border-radius var(--dur-spring-fast) var(--spring-fast);
  }

  .quick-pill:hover {
    background: var(--sc);
    color: var(--onsc);
    border-radius: var(--r-md);
  }

  .hero-visual {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .stage {
    width: 100%;
    max-width: 360px;
    aspect-ratio: 1;
    display: grid;
    place-items: center;
    background: radial-gradient(
        circle at 50% 45%,
        color-mix(in srgb, var(--tc) 34%, transparent),
        transparent 70%
      ),
      var(--sf);
    border-radius: var(--r-2xl);
  }

  .stage :global(.visual-shape) {
    width: 240px;
    height: 240px;
    --shape-fill: var(--tc);
    color: var(--ontc);
  }

  .code-mark {
    font-size: 64px;
    line-height: 1;
    letter-spacing: -0.04em;
  }

  @media (max-width: 860px) {
    .missing-hero {
      min-height: calc(100svh - 56px);
      grid-template-columns: 1fr;
      gap: 20px;
      padding: 36px 0 68px;
    }

    .hero-visual {
      order: -1;
    }

    .stage {
      width: 100%;
      max-width: 360px;
      margin: 0 auto;
      aspect-ratio: auto;
      padding: 24px 20px;
      border-radius: 32px;
    }

    .stage :global(.visual-shape) {
      width: 172px;
      height: 172px;
    }

    .code-mark {
      font-size: 46px;
    }

    .hero-left {
      align-items: center;
      text-align: center;
      gap: 14px;
    }

    .acts,
    .quick-nav {
      justify-content: center;
    }
  }

  @media (max-width: 640px) {
    :global(#not-found.page-section) {
      padding-top: 20px !important;
    }
  }
</style>
