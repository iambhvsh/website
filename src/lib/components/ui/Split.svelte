<script lang="ts" module>
  import type { Component } from 'svelte';

  export interface SplitMenuItem {
    label: string;
    subtitle?: string;
    icon?: Component;
    href?: string;
    external?: boolean;
    selected?: boolean;
    onclick?: () => void;
  }
</script>

<script lang="ts">
  import type { Snippet } from 'svelte';
  import CheckIcon from '~icons/material-symbols/check-rounded';
  import KeyboardArrowDownIcon from '~icons/material-symbols/keyboard-arrow-down-rounded';

  interface Props {
    label: string;
    href?: string;
    external?: boolean;
    onclick?: () => void;
    leadingIcon?: Snippet;
    items: readonly SplitMenuItem[];
    variant?: 'filled' | 'tonal';
    tone?: 'default' | 'on-tertiary';
    size?: 'sm' | 'md';
    align?: 'start' | 'end';
    menuLabel?: string;
  }

  let {
    label,
    href,
    external = false,
    onclick,
    leadingIcon,
    items,
    variant = 'filled',
    tone = 'default',
    size = 'md',
    align = 'start',
    menuLabel = 'More options',
  }: Props = $props();

  let open = $state(false);
  let wrapEl = $state<HTMLDivElement | undefined>(undefined);

  function closeMenu() {
    open = false;
  }

  function handleItemSelect(item: SplitMenuItem) {
    item.onclick?.();
    closeMenu();
  }

  $effect(() => {
    if (!open || typeof document === 'undefined') return;

    const onPointerDown = (event: PointerEvent) => {
      if (wrapEl && !wrapEl.contains(event.target as Node)) {
        closeMenu();
      }
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  });
</script>

<div class="split-wrap {size} {variant} {tone}" bind:this={wrapEl}>
  <div class="split-row" role="group" aria-label={label}>
    {#if href}
      <a
        class="split-part split-lead bl"
        {href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {onclick}
      >
        {#if leadingIcon}
          <span class="split-ic" aria-hidden="true">{@render leadingIcon()}</span>
        {/if}
        <span>{label}</span>
      </a>
    {:else}
      <button type="button" class="split-part split-lead bl" {onclick}>
        {#if leadingIcon}
          <span class="split-ic" aria-hidden="true">{@render leadingIcon()}</span>
        {/if}
        <span>{label}</span>
      </button>
    {/if}

    <button
      type="button"
      class="split-part split-trail"
      class:open
      aria-haspopup="menu"
      aria-expanded={open}
      aria-label={menuLabel}
      onclick={() => (open = !open)}
    >
      <span class="split-chevron" class:open aria-hidden="true">
        <KeyboardArrowDownIcon />
      </span>
    </button>
  </div>

  {#if open}
    <div
      class="split-menu"
      class:align-end={align === 'end'}
      role="menu"
      aria-label={menuLabel}
    >
      {#each items as item (item.label)}
        {#snippet itemBody()}
          {@const ItemIcon = item.icon}
          {#if ItemIcon}
            <span class="menu-ic" aria-hidden="true">
              <ItemIcon />
            </span>
          {/if}
          <span class="menu-text">
            <span>{item.label}</span>
            {#if item.subtitle}
              <small class="bs menu-sub">{item.subtitle}</small>
            {/if}
          </span>
          {#if item.selected}
            <span class="menu-ic menu-check" aria-hidden="true">
              <CheckIcon />
            </span>
          {/if}
        {/snippet}

        {#if item.href}
          <a
            class="menu-item label"
            class:selected={item.selected}
            href={item.href}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            role="menuitem"
            onclick={() => closeMenu()}
          >
            {@render itemBody()}
          </a>
        {:else}
          <button
            type="button"
            class="menu-item label"
            class:selected={item.selected}
            role="menuitem"
            onclick={() => handleItemSelect(item)}
          >
            {@render itemBody()}
          </button>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .split-wrap {
    position: relative;
    display: inline-block;
  }

  .split-row {
    display: inline-flex;
    align-items: stretch;
    gap: 2px;
  }

  .split-part {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border: 0;
    cursor: pointer;
    font-family: inherit;
    text-decoration: none;
    background: var(--p);
    color: var(--onp);
    transition:
      border-radius var(--dur-spring-fast) var(--spring-fast),
      background-color var(--dur-short4) var(--ease-emphasized),
      color var(--dur-short4) var(--ease-emphasized);
  }

  .split-wrap.tonal .split-part {
    background: var(--sc);
    color: var(--onsc);
  }

  .split-wrap.on-tertiary .split-part {
    background: var(--ontc);
    color: var(--tc);
  }

  .split-wrap.tonal.on-tertiary .split-part {
    background: color-mix(in srgb, var(--ontc) 14%, transparent);
    color: var(--ontc);
  }

  .split-wrap.md .split-lead {
    height: 48px;
    padding: 0 20px 0 24px;
    border-radius: 24px var(--r-xs) var(--r-xs) 24px;
  }

  .split-wrap.md .split-lead:hover {
    border-radius: 24px var(--r-md) var(--r-md) 24px;
  }

  .split-wrap.md .split-lead:active {
    border-radius: var(--r-md) var(--r-sm) var(--r-sm) var(--r-md);
  }

  .split-wrap.md .split-trail {
    width: 48px;
    height: 48px;
    padding: 0;
    border-radius: var(--r-xs) 24px 24px var(--r-xs);
  }

  .split-wrap.md .split-trail:hover {
    border-radius: var(--r-md) 24px 24px var(--r-md);
  }

  .split-wrap.md .split-trail:active {
    border-radius: var(--r-sm) var(--r-md) var(--r-md) var(--r-sm);
  }

  .split-wrap.md .split-trail.open {
    border-radius: 24px;
  }

  .split-wrap.sm .split-lead {
    height: 40px;
    padding: 0 14px 0 18px;
    font-size: 14px;
    border-radius: 20px var(--r-xs) var(--r-xs) 20px;
  }

  .split-wrap.sm .split-lead:hover {
    border-radius: 20px var(--r-sm) var(--r-sm) 20px;
  }

  .split-wrap.sm .split-lead:active {
    border-radius: var(--r-md) var(--r-xs) var(--r-xs) var(--r-md);
  }

  .split-wrap.sm .split-trail {
    width: 40px;
    height: 40px;
    padding: 0;
    border-radius: var(--r-xs) 20px 20px var(--r-xs);
  }

  .split-wrap.sm .split-trail:hover {
    border-radius: var(--r-sm) 20px 20px var(--r-sm);
  }

  .split-wrap.sm .split-trail.open {
    border-radius: 20px;
  }

  .split-part:focus-visible {
    outline: 3px solid var(--p);
    outline-offset: 3px;
  }

  .split-ic {
    display: inline-flex;
    align-items: center;
  }

  .split-chevron {
    display: inline-flex;
    align-items: center;
    font-size: 20px;
    transition: transform var(--dur-spring-fast) var(--spring-fast);
  }

  .split-chevron.open {
    transform: rotate(180deg);
  }

  .split-menu {
    position: absolute;
    top: calc(100% + 6px);
    left: 0;
    z-index: 30;
    min-width: 210px;
    max-width: calc(100vw - 40px);
    padding: 6px;
    display: flex;
    flex-direction: column;
    gap: 2px;
    background: var(--sf2);
    color: var(--on);
    border-radius: var(--r-lg);
    border: 1px solid color-mix(in srgb, var(--ol-v) 45%, transparent);
    box-shadow:
      0 4px 12px 2px rgba(0, 0, 0, 0.14),
      0 1px 3px rgba(0, 0, 0, 0.2);
    transform-origin: top left;
    animation: menu-enter var(--dur-spring-fast) var(--spring-fast);
  }

  .split-menu.align-end {
    left: auto;
    right: 0;
    transform-origin: top right;
  }

  @keyframes menu-enter {
    from {
      opacity: 0;
      transform: translateY(-6px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    padding: 10px 12px;
    border: 0;
    background: transparent;
    color: var(--on);
    text-align: left;
    text-decoration: none;
    font-family: inherit;
    cursor: pointer;
    border-radius: var(--r-md);
    transition:
      background-color var(--dur-short4) var(--ease-emphasized),
      color var(--dur-short4) var(--ease-emphasized);
  }

  .menu-item:hover {
    background: var(--sf3);
  }

  .menu-item.selected {
    background: var(--sc);
    color: var(--onsc);
  }

  .menu-item:focus-visible {
    outline: 2px solid var(--p);
    outline-offset: -2px;
  }

  .menu-ic {
    width: 18px;
    height: 18px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    font-size: 18px;
  }

  .menu-text {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .menu-check {
    margin-left: auto;
  }

  .menu-sub {
    color: var(--onv);
  }
</style>
