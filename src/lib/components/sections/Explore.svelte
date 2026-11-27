<script lang="ts">
  import type { Component } from 'svelte';
  import { Badge, Section } from '$lib/components/ui';
  import { BADGE_HOVER_SHAPES, BADGE_REST_SHAPES, type ShapeName } from '$lib/shapes';
  import ArrowForwardIcon from '~icons/material-symbols/arrow-forward-rounded';
  import EditNoteIcon from '~icons/material-symbols/edit-note-rounded';
  import GridViewIcon from '~icons/material-symbols/grid-view-outline-rounded';
  import LaptopMacIcon from '~icons/material-symbols/laptop-mac-outline-rounded';
  import MusicNoteIcon from '~icons/material-symbols/music-note-rounded';
  import PersonIcon from '~icons/material-symbols/person-outline-rounded';
  import SmartphoneIcon from '~icons/material-symbols/smartphone-outline';

  interface ExploreItem {
    title: string;
    href: string;
    summary: string;
    cta: string;
    icon: Component;
    span: 'wide' | 'narrow' | 'half';
    surface: 'primary' | 'secondary' | 'tertiary' | 'surface';
    preview?: string;
  }

  const ITEMS: readonly ExploreItem[] = [
    {
      title: 'About',
      href: '/about',
      summary: 'Who I am, the stack I build with, devices I carry and the things I care about.',
      cta: 'About me',
      icon: PersonIcon,
      span: 'wide',
      surface: 'primary',
    },
    {
      title: 'Work',
      href: '/work',
      summary: 'Selected web and Android projects I have built, from interfaces to offline-first apps.',
      cta: 'See projects',
      icon: GridViewIcon,
      span: 'narrow',
      surface: 'secondary',
    },
    {
      title: 'Writing',
      href: '/writing',
      summary: 'Essays and notes on design, software, interfaces and building thoughtful systems.',
      cta: 'Read writing',
      icon: EditNoteIcon,
      span: 'narrow',
      surface: 'surface',
    },
    {
      title: 'Music',
      href: '/music',
      summary: 'What is playing right now alongside my favorite tracks and previews.',
      cta: 'Open music',
      icon: MusicNoteIcon,
      span: 'wide',
      surface: 'tertiary',
    },
    {
      title: 'Mac',
      href: '/mac',
      summary: 'My primary MacBook Air workstation and the macOS apps I rely on every day.',
      cta: 'Mac setup',
      icon: LaptopMacIcon,
      span: 'half',
      surface: 'surface',
      preview: '/assets/macbook.png',
    },
    {
      title: 'Phone',
      href: '/phone',
      summary: 'My daily Android driver and the mobile apps I use and build for.',
      cta: 'Phone setup',
      icon: SmartphoneIcon,
      span: 'half',
      surface: 'surface',
      preview: '/assets/phone.png',
    },
  ];

  let hoveredIndex = $state<number | null>(null);
  let hoverCount = $state(0);

  function getShape(index: number): ShapeName {
    if (hoveredIndex === index) {
      return BADGE_HOVER_SHAPES[(index + hoverCount) % BADGE_HOVER_SHAPES.length];
    }
    return BADGE_REST_SHAPES[index % BADGE_REST_SHAPES.length];
  }

  function getBadgeTone(surface: ExploreItem['surface']): 'primary' | 'secondary' | 'tertiary' {
    if (surface === 'primary') return 'tertiary';
    if (surface === 'secondary') return 'primary';
    if (surface === 'tertiary') return 'primary';
    return 'primary';
  }
</script>

<Section id="explore" title="Explore">
  <div class="bento">
    {#each ITEMS as item, i (item.href)}
      {@const IconComponent = item.icon}
      <a
        href={item.href}
        class="tile surface-morph interactive {item.span} {item.surface}"
        class:has-preview={Boolean(item.preview)}
        onpointerenter={() => {
          hoveredIndex = i;
          hoverCount += 1;
        }}
        onpointerleave={() => {
          hoveredIndex = null;
        }}
      >
        <div class="tile-top">
          <Badge shape={getShape(i)} tone={getBadgeTone(item.surface)} spring="fast">
            <IconComponent />
          </Badge>
          <span class="cta-pill label">
            {item.cta}
            <ArrowForwardIcon aria-hidden="true" />
          </span>
        </div>

        <div class="tile-content">
          <div class="tile-body">
            <h3 class="headline tile-title">{item.title}</h3>
            <p class="bm tile-summary">{item.summary}</p>
          </div>

          {#if item.preview}
            <div class="tile-preview" aria-hidden="true">
              <img src={item.preview} alt="" loading="lazy" />
            </div>
          {/if}
        </div>
      </a>
    {/each}
  </div>
</Section>

<style>
  .bento {
    display: grid;
    grid-template-columns: repeat(12, minmax(0, 1fr));
    gap: 16px;
  }

  .tile {
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 16px;
    padding: 24px;
    min-height: 220px;
    text-decoration: none;
    overflow: hidden;
    background: var(--sf);
    color: var(--on);
  }

  .tile:hover {
    background: var(--sf2);
  }

  .tile.primary {
    background: var(--pc);
    color: var(--onpc);
  }

  .tile.primary:hover {
    background: color-mix(in srgb, var(--pc) 88%, var(--p));
  }

  .tile.secondary {
    background: var(--sc);
    color: var(--onsc);
  }

  .tile.secondary:hover {
    background: color-mix(in srgb, var(--sc) 88%, var(--s));
  }

  .tile.tertiary {
    background: var(--tc);
    color: var(--ontc);
  }

  .tile.tertiary:hover {
    background: color-mix(in srgb, var(--tc) 88%, var(--t));
  }

  .tile:focus-visible {
    outline: 3px solid var(--p);
    outline-offset: 3px;
  }

  .tile.wide {
    grid-column: span 7;
  }

  .tile.narrow {
    grid-column: span 5;
  }

  .tile.half {
    grid-column: span 6;
  }

  .tile-content {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    margin-top: auto;
  }

  .tile-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .tile-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .cta-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 14px;
    border-radius: 24px;
    background: color-mix(in srgb, currentColor 10%, transparent);
    color: inherit;
    transition:
      border-radius var(--dur-spring-fast) var(--spring-fast),
      background-color var(--dur-short4) var(--ease-emphasized);
  }

  .tile:hover .cta-pill {
    border-radius: var(--r-lg);
    background: color-mix(in srgb, currentColor 16%, transparent);
  }

  .tile:active .cta-pill {
    border-radius: var(--r-md);
  }

  .cta-pill :global(.ms-icon) {
    font-size: 16px;
  }

  .tile-title {
    margin-top: auto;
  }

  .tile-summary {
    opacity: 0.84;
    max-width: 42ch;
  }

  .tile-preview {
    width: 132px;
    flex: none;
    display: grid;
    place-items: center;
    align-self: center;
  }

  .tile-preview img {
    width: 100%;
    max-height: 140px;
    object-fit: contain;
    display: block;
    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.22));
  }

  @media (max-width: 900px) {
    .bento {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .tile.wide,
    .tile.narrow,
    .tile.half {
      grid-column: span 1;
    }

    .tile-preview {
      width: 96px;
    }

    .tile-preview img {
      max-height: 110px;
    }
  }

  @media (max-width: 600px) {
    .bento {
      grid-template-columns: 1fr;
      gap: 12px;
    }

    .tile {
      min-height: 0;
      padding: 18px;
      gap: 14px;
    }

    .tile :global(.badge.morph-shape) {
      width: 44px;
      height: 44px;
    }

    .tile :global(.badge.morph-shape .ms-icon) {
      font-size: 22px;
    }

    .tile-preview {
      width: 84px;
    }

    .tile-preview img {
      max-height: 96px;
    }
  }
</style>
