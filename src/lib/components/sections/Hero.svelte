<script lang="ts">
  import { Button, Shape } from "$lib/components/ui";
  import { SITE } from "$lib/data/site";
  import Github from "$lib/components/ui/Github.svelte";
  import ArrowDownwardIcon from "~icons/material-symbols/arrow-downward-rounded";
  import MailIcon from "~icons/material-symbols/mail-outline-rounded";
  import { HERO_SHAPE_CYCLE, prewarmMorphCycle } from "$lib/shapes";

  const PROFILE_IMAGE = "https://github.com/iambhvsh.png";
  let imgLoaded = $state(false);
  let imgError = $state(false);

  let shapeIndex = $state(0);
  const activeShape = $derived(HERO_SHAPE_CYCLE[shapeIndex]);

  let heroEl = $state<HTMLElement | undefined>(undefined);
  let heroVisible = $state(true);
  let timer: ReturnType<typeof setInterval> | undefined;

  function nextShape() {
    shapeIndex = (shapeIndex + 1) % HERO_SHAPE_CYCLE.length;
  }

  function resetCycle() {
    if (timer) clearInterval(timer);
    if (
      !heroVisible ||
      (typeof document !== "undefined" && document.hidden) ||
      (typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches)
    ) {
      return;
    }
    timer = setInterval(nextShape, 3200);
  }

  function handleClick() {
    nextShape();
    resetCycle();
  }

  function handleHover() {
    nextShape();
    resetCycle();
  }

  $effect(() => {
    const cancelPrewarm = prewarmMorphCycle(HERO_SHAPE_CYCLE);
    return () => cancelPrewarm();
  });

  $effect(() => {
    if (!heroEl || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver((entries) => {
      heroVisible = entries[0]?.isIntersecting ?? true;
    });
    io.observe(heroEl);
    return () => io.disconnect();
  });

  $effect(() => {
    resetCycle();
    return () => {
      if (timer) clearInterval(timer);
    };
  });
</script>

<section class="heroSec" id="top" bind:this={heroEl}>
  <div>
    <div class="greet label">Hello, I’m</div>
    <h1 class="hero h">{SITE.fullName}</h1>
    <p class="lead inline">
      Software, interfaces and <b>thoughtful systems</b>. {SITE.location}.
    </p>
    <div class="row">
      <Button href="#explore">
        {#snippet icon()}
          <ArrowDownwardIcon />
        {/snippet}
        Explore
      </Button>
      <Button variant="tonal" href="mailto:{SITE.email}">
        {#snippet icon()}
          <MailIcon />
        {/snippet}
        Say hello
      </Button>
      <Button
        variant="tonal"
        iconOnly
        href={SITE.githubUrl}
        external
        ariaLabel="GitHub"
      >
        {#snippet icon()}
          <Github />
        {/snippet}
      </Button>
    </div>
  </div>

  <button
    type="button"
    class="shapeBox"
    aria-label="Morphing Material shape"
    onclick={handleClick}
    onpointerenter={handleHover}
  >
    <Shape shape={activeShape} spring="default" masked class="hero-shape hero">
      {#if !imgError}
        <img
          src={PROFILE_IMAGE}
          alt="Bhavesh Patil"
          referrerpolicy="no-referrer"
          class="profile-img"
          class:visible={imgLoaded}
          onload={() => (imgLoaded = true)}
          onerror={() => {
            imgError = true;
          }}
        />
      {/if}
      {#if imgError || !imgLoaded}
        <span class="initials" aria-hidden={!imgError}>{SITE.initials}</span>
      {/if}
    </Shape>
  </button>
</section>

<style>
  .heroSec {
    min-height: 100vh;
    min-height: 100svh;
    padding: 96px 0 32px;
    display: grid;
    gap: 40px;
    align-items: center;
    align-content: center;
    grid-template-columns: 1.2fr 0.8fr;
  }

  @media (max-width: 820px) {
    .heroSec {
      grid-template-columns: 1fr;
      gap: 20px;
      padding: 92px 0 32px;
    }

    .shapeBox {
      order: -1;
      max-width: 128px;
    }
  }

  .greet {
    color: var(--p);
    margin-bottom: 8px;
  }

  .hero.h {
    font-size: clamp(42px, 11vw, 112px);
    line-height: 0.95;
    letter-spacing: -0.02em;
    margin-bottom: 24px;
  }

  .lead {
    font-size: clamp(18px, 2.4vw, 22px);
    color: var(--onv);
    max-width: 34ch;
    margin-bottom: 32px;
  }

  .shapeBox {
    position: relative;
    aspect-ratio: 1;
    width: 100%;
    max-width: 280px;
    justify-self: center;
    cursor: pointer;
    border: 0;
    padding: 0;
    background: transparent;
    -webkit-tap-highlight-color: transparent;
  }

  .shapeBox:focus-visible {
    outline: 3px solid var(--p);
    outline-offset: 6px;
    border-radius: var(--r-xl-inc);
  }

  .shapeBox :global(.hero-shape) {
    width: 100%;
    height: 100%;
    background: var(--pc);
    color: var(--onpc);
    font-size: clamp(38px, 8vw, 96px);
    transition:
      background var(--dur-med4) var(--ease-emphasized),
      color var(--dur-med4) var(--ease-emphasized);
  }

  .shapeBox:hover :global(.hero-shape) {
    background: var(--p);
    color: var(--onp);
  }

  .profile-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity var(--dur-med2) var(--ease-emphasized);
  }

  .profile-img.visible {
    opacity: 1;
  }

  .initials {
    position: relative;
    z-index: 1;
  }
</style>
