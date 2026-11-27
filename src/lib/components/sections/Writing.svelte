<script lang="ts">
  import { Badge, Scroll, Section, Shape, Split } from '$lib/components/ui';
  import type { SplitMenuItem } from '$lib/components/ui/Split.svelte';
  import { SITE } from '$lib/data/site';
  import {
    BADGE_HOVER_SHAPES,
    BADGE_REST_SHAPES,
    HERO_SHAPE_CYCLE,
    LOADING_SHAPES,
    type ShapeName,
  } from '$lib/shapes';
  import EditNoteIcon from '~icons/material-symbols/edit-note-rounded';
  import RssFeedIcon from '~icons/material-symbols/rss-feed-rounded';
  import { fetchWritingPosts, type WritingPost } from '$lib/services/feed';
  import Post from './Post.svelte';

  const WRITING_CHIPS = [
    { label: 'Topics', value: 'Design & Code', icon: EditNoteIcon },
    { label: 'Feed', value: 'RSS available', icon: RssFeedIcon },
  ] as const;

  const writingMenuItems: readonly SplitMenuItem[] = [
    {
      label: 'RSS feed',
      subtitle: 'writing.iambhvsh.in/rss.xml',
      icon: RssFeedIcon,
      href: `${SITE.writingUrl}/rss.xml`,
      external: true,
    },
  ];

  let posts = $state<WritingPost[]>([]);
  let error = $state(false);
  let loading = $state(true);
  let loadShapeIndex = $state(0);
  let hoveredChip = $state<number | null>(null);
  let chipHoverCount = $state(0);
  let heroShapeIdx = $state(2);

  function getChipShape(index: number): ShapeName {
    if (hoveredChip === index) {
      return BADGE_HOVER_SHAPES[(index + chipHoverCount) % BADGE_HOVER_SHAPES.length];
    }
    return BADGE_REST_SHAPES[index % BADGE_REST_SHAPES.length];
  }

  $effect(() => {
    if (!loading) return;
    const timer = setInterval(() => {
      loadShapeIndex = (loadShapeIndex + 1) % LOADING_SHAPES.length;
    }, 650);
    return () => clearInterval(timer);
  });

  $effect(() => {
    let cancelled = false;
    loading = true;
    fetchWritingPosts()
      .then((items) => {
        if (!cancelled) {
          posts = items;
          error = items.length === 0;
        }
      })
      .catch(() => {
        if (!cancelled && posts.length === 0) {
          error = true;
        }
      })
      .finally(() => {
        if (!cancelled) {
          loading = false;
        }
      });

    return () => {
      cancelled = true;
    };
  });
</script>

<Section id="writing">
  <div class="writing-hero">
    <div class="hero-left">
      <div class="writing-head">
        <span class="label eyebrow">Writing</span>
        <h1 class="hero writing-title">Writing</h1>
        <p class="bm writing-sub">
          Notes, essays and thoughts on software, interfaces and craft.
        </p>
      </div>

      <div class="chips-row">
        {#each WRITING_CHIPS as chip, i (chip.label)}
          {@const IconComponent = chip.icon}
          <div
            class="info-chip"
            role="presentation"
            onpointerenter={() => {
              hoveredChip = i;
              chipHoverCount += 1;
            }}
            onpointerleave={() => {
              hoveredChip = null;
            }}
          >
            <Badge shape={getChipShape(i)} tone="primary" spring="fast">
              <IconComponent />
            </Badge>
            <div class="chip-meta">
              <span class="label chip-label">{chip.label}</span>
              <span class="tm flex600">{chip.value}</span>
            </div>
          </div>
        {/each}
      </div>
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
          <EditNoteIcon />
        </span>
      </Shape>
    </div>

    <div class="hero-scroll">
      <Scroll href="#posts-list" label="All posts" />
    </div>
  </div>

  <div id="posts-list" class="posts-body">
    <div class="posts-toolbar">
      <h2 class="tl flex600">Posts</h2>
      <Split
        label="All writing"
        variant="tonal"
        href={SITE.writingUrl}
        external
        menuLabel="More writing options"
        items={writingMenuItems}
      >
        {#snippet leadingIcon()}
          <EditNoteIcon />
        {/snippet}
      </Split>
    </div>

    {#if loading && posts.length === 0}
      <div class="loading-row" role="status" aria-live="polite">
        <Shape
          shape={LOADING_SHAPES[loadShapeIndex]}
          spring="fast"
          spin
          ariaHidden
          class="writing-loader"
        />
        <span class="bm fallback">Loading latest writing…</span>
      </div>
    {:else if posts.length > 0}
      <div class="masonry">
        {#each posts as post, i (post.link)}
          <div class="masonry-item">
            <Post {post} index={i} />
          </div>
        {/each}
      </div>
    {:else if error}
      <p class="bm fallback">Couldn’t load writing right now.</p>
    {/if}
  </div>
</Section>

<style>
  :global(#writing.page-section) {
    padding-top: 48px !important;
  }

  .writing-hero {
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

  .writing-head {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .eyebrow {
    color: var(--p);
  }

  .writing-title {
    font-size: clamp(40px, 6.5vw, 72px);
    line-height: 0.96;
    letter-spacing: -0.02em;
  }

  .writing-sub {
    font-size: clamp(16px, 1.8vw, 19px);
    color: var(--onv);
    max-width: 42ch;
  }

  .chips-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .posts-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 24px;
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
    --shape-fill: var(--tc);
    color: var(--ontc);
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

  .posts-body {
    padding-top: 32px;
  }

  .masonry {
    columns: 3 260px;
    column-gap: 16px;
  }

  .masonry-item {
    break-inside: avoid;
    margin-bottom: 16px;
  }

  .loading-row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 16px 0;
  }

  .loading-row :global(.writing-loader) {
    width: 44px;
    height: 44px;
    flex: none;
    --shape-fill: var(--pc);
  }

  .fallback {
    color: var(--onv);
  }

  @media (max-width: 860px) {
    .writing-hero {
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

    .hero-visual :global(.visual-shape) {
      width: 164px;
      height: 164px;
    }

    .visual-icon :global(.ms-icon) {
      font-size: 64px;
    }
  }

  @media (max-width: 640px) {
    :global(#writing.page-section) {
      padding-top: 28px !important;
    }

    .writing-hero {
      min-height: calc(100svh - 64px);
      gap: 20px;
      padding: 8px 0 72px;
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
  }
</style>
