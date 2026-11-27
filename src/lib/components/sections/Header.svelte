<script lang="ts">
  import { untrack } from "svelte";
  import { Button } from "$lib/components/ui";
  import { NAV_ITEMS, SITE } from "$lib/data/site";
  import ContrastIcon from "~icons/material-symbols/contrast";
  import { themeStore } from "$lib/stores/theme.svelte";

  interface Props {
    activeSection?: string;
  }

  let { activeSection = "" }: Props = $props();
  let navEl = $state<HTMLElement | undefined>(undefined);
  let pillLeft = $state(0);
  let pillWidth = $state(0);
  let pillVisible = $state(false);
  let themeSpin = $state(0);

  function syncIndicator() {
    if (!navEl || !activeSection) {
      pillVisible = false;
      return;
    }

    const activeLink = navEl.querySelector<HTMLAnchorElement>(
      `a[data-section="${activeSection}"]`,
    );
    if (!activeLink) {
      pillVisible = false;
      return;
    }

    pillLeft = activeLink.offsetLeft;
    pillWidth = activeLink.offsetWidth;
    pillVisible = true;
  }

  $effect(() => {
    void activeSection;
    syncIndicator();
  });

  $effect(() => {
    if (!navEl || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(() => untrack(syncIndicator));
    ro.observe(navEl);
    return () => ro.disconnect();
  });

  function handleThemeToggle() {
    themeSpin += 180;
    themeStore.toggle();
  }
</script>

<header>
  <div class="bar">
    <a href="#top" class="name hero">{SITE.brand}</a>
    <nav bind:this={navEl} class="label" aria-label="Primary">
      <span
        class="nav-pill"
        class:visible={pillVisible}
        style:transform="translateX({pillLeft}px)"
        style:width="{pillWidth}px"
        aria-hidden="true"
      ></span>
      {#each NAV_ITEMS as item (item.href)}
        <a
          href={item.href}
          data-section={item.sectionId}
          class:on={activeSection === item.sectionId}
        >
          {item.label}
        </a>
      {/each}
    </nav>
    <Button
      variant="tonal"
      iconOnly
      ariaLabel="Toggle theme"
      onclick={handleThemeToggle}
    >
      {#snippet icon()}
        <span class="theme-glyph" style:transform="rotate({themeSpin}deg)">
          <ContrastIcon />
        </span>
      {/snippet}
    </Button>
  </div>
</header>

<style>
  header {
    position: fixed;
    top: calc(env(safe-area-inset-top, 0px) + 12px);
    left: 0;
    right: 0;
    z-index: 20;
    pointer-events: none;
  }

  .bar {
    pointer-events: auto;
    max-width: 1100px;
    margin: 0 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: color-mix(in srgb, var(--sf2) 86%, transparent);
    backdrop-filter: blur(20px) saturate(1.4);
    padding: 8px 8px 8px 20px;
    border-radius: var(--r-xl-inc);
    border: 1px solid color-mix(in srgb, var(--ol-v) 45%, transparent);
  }

  @media (min-width: 1140px) {
    .bar {
      margin: 0 auto;
    }
  }

  .name {
    flex: 1;
    font-size: 18px;
    color: inherit;
    text-decoration: none;
  }

  nav {
    position: relative;
    display: flex;
    gap: 2px;
  }

  .nav-pill {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    background: var(--sc);
    border-radius: var(--r-lg-inc);
    opacity: 0;
    pointer-events: none;
    transition:
      transform var(--dur-spring) var(--spring),
      width var(--dur-spring) var(--spring),
      opacity var(--dur-short4) var(--ease-emphasized),
      border-radius var(--dur-spring-fast) var(--spring-fast);
  }

  .nav-pill.visible {
    opacity: 1;
  }

  nav a {
    position: relative;
    z-index: 1;
    padding: 10px 16px;
    border-radius: var(--r-lg-inc);
    color: var(--onv);
    text-decoration: none;
    transition:
      border-radius var(--dur-spring-fast) var(--spring-fast),
      background-color var(--dur-short4) var(--ease-emphasized),
      color var(--dur-short4) var(--ease-emphasized);
  }

  nav a:hover {
    background: color-mix(in srgb, var(--sc) 45%, transparent);
    color: var(--onsc);
    border-radius: var(--r-md);
  }

  nav a:active {
    border-radius: var(--r-sm);
  }

  nav a.on {
    color: var(--onsc);
  }

  .theme-glyph {
    display: inline-flex;
    transition: transform var(--dur-spring) var(--spring);
  }

  @media (max-width: 700px) {
    nav {
      display: none;
    }
  }
</style>
