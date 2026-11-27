<script lang="ts">
  import { untrack } from "svelte";
  import { Badge, Button } from "$lib/components/ui";
  import { NAV_ITEMS, SITE } from "$lib/data/site";
  import { BADGE_REST_SHAPES } from "$lib/shapes";
  import ArrowOutwardIcon from "~icons/material-symbols/arrow-outward-rounded";
  import CloseIcon from "~icons/material-symbols/close-rounded";
  import ContrastIcon from "~icons/material-symbols/contrast";
  import EditNoteIcon from "~icons/material-symbols/edit-note-rounded";
  import GridViewIcon from "~icons/material-symbols/grid-view-rounded";
  import HomeIcon from "~icons/material-symbols/home-rounded";
  import LaptopMacIcon from "~icons/material-symbols/laptop-mac-outline";
  import MenuIcon from "~icons/material-symbols/menu-rounded";
  import MusicNoteIcon from "~icons/material-symbols/music-note-rounded";
  import PersonIcon from "~icons/material-symbols/person-rounded";
  import SmartphoneIcon from "~icons/material-symbols/smartphone-outline";
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
  let mobileMenuOpen = $state(false);

  const MOBILE_ICONS: Record<string, typeof HomeIcon> = {
    "": HomeIcon,
    about: PersonIcon,
    work: GridViewIcon,
    writing: EditNoteIcon,
    music: MusicNoteIcon,
    mac: LaptopMacIcon,
    phone: SmartphoneIcon,
  };

  const MOBILE_ITEMS = [
    { label: "Home", href: "/", sectionId: "" },
    ...NAV_ITEMS,
  ];

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

  function closeMobileMenu() {
    mobileMenuOpen = false;
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape" && mobileMenuOpen) {
      mobileMenuOpen = false;
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

{#if mobileMenuOpen}
  <button
    type="button"
    class="menu-scrim"
    aria-label="Close navigation menu"
    onclick={closeMobileMenu}
  ></button>
{/if}

<header>
  <div class="bar">
    <a href="/" class="name hero" onclick={closeMobileMenu}>{SITE.brand}</a>
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
          aria-current={activeSection === item.sectionId ? "page" : undefined}
        >
          {item.label}
        </a>
      {/each}
    </nav>
    <div class="actions">
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
      <Button
        variant={mobileMenuOpen ? "filled" : "tonal"}
        iconOnly
        class={mobileMenuOpen ? "menu-btn open" : "menu-btn"}
        ariaLabel={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
        ariaPressed={mobileMenuOpen}
        onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
      >
        {#snippet icon()}
          <span class="menu-glyph" class:open={mobileMenuOpen}>
            {#if mobileMenuOpen}
              <CloseIcon />
            {:else}
              <MenuIcon />
            {/if}
          </span>
        {/snippet}
      </Button>
    </div>
  </div>

  <div
    class="mobile-drawer"
    class:open={mobileMenuOpen}
    inert={!mobileMenuOpen}
    aria-hidden={!mobileMenuOpen}
  >
    <div class="mobile-drawer-inner">
      <nav class="mobile-nav" aria-label="Mobile navigation">
        <div class="mobile-nav-head">
          <span class="label mobile-eyebrow">Navigate</span>
          <span class="bs mobile-handle">@{SITE.handle}</span>
        </div>
        <div class="mobile-list">
          {#each MOBILE_ITEMS as item, i (item.href)}
            {@const ItemIcon = MOBILE_ICONS[item.sectionId] ?? HomeIcon}
            {@const isActive = activeSection === item.sectionId}
            <a
              href={item.href}
              class="mobile-item"
              class:on={isActive}
              style:--item-delay="{i * 28}ms"
              aria-current={isActive ? "page" : undefined}
              onclick={closeMobileMenu}
            >
              <Badge
                shape={BADGE_REST_SHAPES[i % BADGE_REST_SHAPES.length]}
                tone={isActive ? "primary" : "secondary"}
                spring="fast"
              >
                <ItemIcon />
              </Badge>
              <span class="tm flex600 mobile-label">{item.label}</span>
              {#if isActive}
                <span class="active-dot" aria-hidden="true"></span>
              {:else}
                <ArrowOutwardIcon class="mobile-arrow" aria-hidden="true" />
              {/if}
            </a>
          {/each}
        </div>
      </nav>
    </div>
  </div>
</header>

<style>
  .menu-scrim {
    display: none;
  }

  header {
    position: fixed;
    top: calc(env(safe-area-inset-top, 0px) + 12px);
    left: 0;
    right: 0;
    z-index: 20;
    pointer-events: none;
    view-transition-name: site-header;
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

  .bar nav {
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

  .bar nav a {
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

  .bar nav a:hover {
    background: color-mix(in srgb, var(--sc) 45%, transparent);
    color: var(--onsc);
    border-radius: var(--r-md);
  }

  .bar nav a:active {
    border-radius: var(--r-sm);
  }

  .bar nav a.on {
    color: var(--onsc);
  }

  .theme-glyph {
    display: inline-flex;
    transition: transform var(--dur-spring) var(--spring);
  }

  .menu-glyph {
    display: inline-flex;
    transition: transform var(--dur-spring-fast) var(--spring-fast);
  }

  .menu-glyph.open {
    transform: rotate(90deg);
  }

  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .actions :global(.menu-btn) {
    display: none;
  }

  .mobile-drawer {
    display: none;
  }

  @media (max-width: 700px) {
    .menu-scrim {
      display: block;
      position: fixed;
      inset: 0;
      z-index: 19;
      border: 0;
      padding: 0;
      background: color-mix(in srgb, var(--bg) 52%, transparent);
      backdrop-filter: blur(6px);
      cursor: pointer;
    }

    .bar nav {
      display: none;
    }

    .actions :global(.menu-btn) {
      display: inline-flex;
    }

    .mobile-drawer {
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      transform: translateY(-10px);
      transform-origin: top center;
      pointer-events: none;
      margin: 8px 20px 0;
      transition:
        grid-template-rows 220ms var(--ease-emphasized-accel),
        opacity 180ms var(--ease-emphasized-accel),
        transform 220ms var(--ease-emphasized-accel);
    }

    .mobile-drawer.open {
      grid-template-rows: 1fr;
      opacity: 1;
      transform: translateY(0);
      pointer-events: auto;
      transition:
        grid-template-rows 420ms var(--ease-emphasized-decel),
        opacity 260ms var(--ease-emphasized-decel),
        transform 420ms var(--spring-fast);
    }

    .mobile-drawer-inner {
      overflow: hidden;
      border-radius: var(--r-xl-inc);
    }

    .mobile-nav {
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 14px;
      background: color-mix(in srgb, var(--sf2) 94%, transparent);
      backdrop-filter: blur(22px) saturate(1.4);
      border-radius: var(--r-xl-inc);
    }

    .mobile-nav-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 8px;
    }

    .mobile-eyebrow {
      color: var(--p);
    }

    .mobile-handle {
      color: var(--onv);
    }

    .mobile-list {
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .mobile-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 8px 14px 8px 8px;
      border-radius: var(--r-lg);
      background: var(--sf);
      color: var(--on);
      text-decoration: none;
      opacity: 0;
      transform: translateY(-6px);
      transition:
        opacity 180ms var(--ease-emphasized-accel),
        transform 180ms var(--ease-emphasized-accel),
        border-radius var(--dur-spring-fast) var(--spring-fast),
        background-color var(--dur-short4) var(--ease-emphasized),
        color var(--dur-short4) var(--ease-emphasized);
    }

    .mobile-drawer.open .mobile-item {
      opacity: 1;
      transform: translateY(0);
      transition:
        opacity 280ms var(--ease-emphasized-decel) var(--item-delay, 0ms),
        transform 340ms var(--ease-emphasized-decel) var(--item-delay, 0ms),
        border-radius var(--dur-spring-fast) var(--spring-fast),
        background-color var(--dur-short4) var(--ease-emphasized),
        color var(--dur-short4) var(--ease-emphasized);
    }

    .mobile-item :global(.badge.morph-shape) {
      width: 38px;
      height: 38px;
      flex: none;
    }

    .mobile-item :global(.badge.morph-shape .ms-icon) {
      font-size: 19px;
    }

    .mobile-label {
      flex: 1;
    }

    .active-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: currentColor;
      flex: none;
    }

    .mobile-item :global(.mobile-arrow) {
      font-size: 18px;
      color: var(--onv);
      flex: none;
      transition: color var(--dur-short4) var(--ease-emphasized);
    }

    .mobile-item:hover {
      background: var(--sc);
      color: var(--onsc);
      border-radius: var(--r-xl);
    }

    .mobile-item:hover :global(.mobile-arrow) {
      color: var(--onsc);
    }

    .mobile-item:active {
      border-radius: var(--r-md);
    }

    .mobile-item.on {
      background: var(--pc);
      color: var(--onpc);
      border-radius: var(--r-xl);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .mobile-drawer,
    .mobile-drawer.open,
    .mobile-item,
    .mobile-drawer.open .mobile-item {
      transition: none;
    }
  }
</style>
