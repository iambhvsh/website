<script lang="ts">
  import { Button, Scroll, Shape } from "$lib/components/ui";
  import { SITE } from "$lib/data/site";
  import Github from "$lib/components/ui/Github.svelte";
  import ArrowDownwardIcon from "~icons/material-symbols/arrow-downward-rounded";
  import LocationOnIcon from "~icons/material-symbols/location-on-outline-rounded";
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
  <div class="hero-left">
    <span class="greet-pill label">Hello, I’m</span>

    <h1 class="hero h">{SITE.fullName}</h1>

    <p class="lead inline">
      Software, interfaces and <b>thoughtful systems</b>.
    </p>

    <div class="row acts">
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

  <div class="hero-visual">
    <div class="portrait-stage surface-morph">
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

      <div class="stage-meta">
        <span class="label meta-pill tonal-pri">@{SITE.handle}</span>
        <span class="label meta-pill tonal-surf">
          <LocationOnIcon aria-hidden="true" />
          <span>{SITE.location}</span>
        </span>
      </div>
    </div>
  </div>

  <div class="hero-scroll">
    <Scroll href="#explore" label="Explore" />
  </div>
</section>

<style>
  .heroSec {
    position: relative;
    min-height: 100vh;
    min-height: 100svh;
    padding: 96px 0 80px;
    display: grid;
    gap: 48px;
    align-items: center;
    align-content: center;
    grid-template-columns: 1.15fr 0.85fr;
  }

  .hero-left {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
    min-width: 0;
  }

  .greet-pill {
    display: inline-flex;
    align-items: center;
    padding: 6px 14px;
    border-radius: 9999px;
    background: var(--pc);
    color: var(--onpc);
  }

  .hero.h {
    font-size: clamp(48px, 8.8vw, 96px);
    line-height: 0.94;
    letter-spacing: -0.025em;
  }

  .lead {
    font-size: clamp(18px, 2.2vw, 22px);
    color: var(--onv);
    max-width: 34ch;
  }

  .hero-visual {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .portrait-stage {
    width: 100%;
    max-width: 380px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 22px;
    padding: 32px 24px 24px;
    background: radial-gradient(
        circle at 50% 38%,
        color-mix(in srgb, var(--pc) 34%, transparent),
        transparent 70%
      ),
      var(--sf);
    border-radius: var(--r-2xl);
  }

  .shapeBox {
    position: relative;
    aspect-ratio: 1;
    width: 100%;
    max-width: 260px;
    cursor: pointer;
    border: 0;
    padding: 0;
    background: transparent;
    -webkit-tap-highlight-color: transparent;
  }

  .shapeBox:focus-visible {
    outline: 3px solid var(--p);
    outline-offset: 8px;
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

  .stage-meta {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }

  .meta-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 12px;
    border-radius: 9999px;
  }

  .meta-pill :global(.ms-icon) {
    font-size: 15px;
  }

  .meta-pill.tonal-pri {
    background: var(--pc);
    color: var(--onpc);
  }

  .meta-pill.tonal-surf {
    background: var(--sf2);
    color: var(--onv);
  }

  .hero-scroll {
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
  }

  @media (max-width: 860px) {
    .heroSec {
      grid-template-columns: 1fr;
      gap: 20px;
      padding: 84px 0 68px;
    }

    .hero-visual {
      order: -1;
    }

    .portrait-stage {
      width: 100%;
      max-width: 360px;
      margin: 0 auto;
      padding: 24px 20px;
      gap: 16px;
      border-radius: 32px;
    }

    .shapeBox {
      max-width: 172px;
    }

    .hero-left {
      align-items: center;
      text-align: center;
      gap: 14px;
    }

    .acts {
      justify-content: center;
    }
  }
</style>
