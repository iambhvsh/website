<script lang="ts">
  import { Section, Shape, Split } from '$lib/components/ui';
  import type { SplitMenuItem } from '$lib/components/ui/Split.svelte';
  import { SITE } from '$lib/data/site';
  import EditNoteIcon from '~icons/material-symbols/edit-note-rounded';
  import RssFeedIcon from '~icons/material-symbols/rss-feed-rounded';
  import { fetchWritingPosts, type WritingPost } from '$lib/services/feed';
  import { LOADING_SHAPES } from '$lib/shapes';
  import Post from './Post.svelte';

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
    fetchWritingPosts(3)
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

<Section id="writing" title="Writing">
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
    <div class="posts">
      {#each posts as post (post.link)}
        <Post {post} />
      {/each}
    </div>
  {:else if error}
    <p class="bm fallback">Couldn’t load writing right now.</p>
  {/if}

  <div class="more">
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
</Section>

<style>
  .posts {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
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
</style>
