<script lang="ts">
  import { Card } from '$lib/components/ui';
  import ArrowOutwardIcon from '~icons/material-symbols/arrow-outward-rounded';
  import EditNoteIcon from '~icons/material-symbols/edit-note-rounded';
  import type { WritingPost } from '$lib/services/feed';

  interface Props {
    post: WritingPost;
    index?: number;
  }

  let { post, index = 0 }: Props = $props();

  const stageTone = $derived(
    index % 3 === 1
      ? 'stage-secondary'
      : index % 3 === 2
        ? 'stage-tertiary'
        : 'stage-primary'
  );
</script>

<Card href={post.link} external compact class="setup-card">
  {#if post.image}
    <div class="post-banner">
      <img
        src={post.image}
        alt={post.title}
        loading="lazy"
        referrerpolicy="no-referrer"
      />
    </div>
  {:else}
    <div class="post-icon-stage {stageTone}">
      <span class="post-icon" aria-hidden="true">
        <EditNoteIcon />
      </span>
    </div>
  {/if}

  <div class="post-meta">
    <div class="post-top">
      {#if post.formattedDate}
        <span class="label post-cat">{post.formattedDate}</span>
      {/if}
      <ArrowOutwardIcon class="ext-icon" aria-hidden="true" />
    </div>

    <h3 class="tl flex600 title">{post.title}</h3>

    {#if post.description}
      <p class="bm post-desc">{post.description}</p>
    {/if}

    {#if post.categories.length}
      <div class="cats label">
        {#each post.categories as cat (cat)}
          <span>{cat}</span>
        {/each}
      </div>
    {/if}
  </div>
</Card>

<style>
  :global(.card.setup-card) {
    padding: 12px;
    gap: 14px;
  }

  .post-banner {
    width: 100%;
    border-radius: var(--r-lg);
    overflow: hidden;
    background: var(--sf2);
  }

  .post-banner img {
    width: 100%;
    height: auto;
    max-height: 210px;
    object-fit: cover;
    display: block;
  }

  .post-icon-stage {
    width: 100%;
    height: 124px;
    border-radius: var(--r-lg);
    display: grid;
    place-items: center;
    overflow: hidden;
  }

  .post-icon-stage.stage-primary {
    background: var(--pc);
    color: var(--onpc);
  }

  .post-icon-stage.stage-secondary {
    background: var(--sc);
    color: var(--onsc);
  }

  .post-icon-stage.stage-tertiary {
    background: var(--tc);
    color: var(--ontc);
  }

  .post-icon {
    display: grid;
    place-items: center;
  }

  .post-icon :global(.ms-icon) {
    font-size: 40px;
  }

  .post-meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 8px 8px;
  }

  .post-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .post-cat {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 9999px;
    background: var(--sf2);
    color: var(--onv);
  }

  :global(.card.setup-card .ext-icon) {
    color: var(--onv);
    font-size: 18px;
    flex: none;
    transition: color var(--dur-short4) var(--ease-emphasized);
  }

  :global(.card.setup-card:hover .ext-icon) {
    color: var(--p);
  }

  .title {
    overflow-wrap: anywhere;
  }

  .post-desc {
    color: var(--onv);
  }

  .cats {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding-top: 2px;
  }

  .cats span {
    padding: 3px 10px;
    background: var(--sf2);
    color: var(--onv);
    border-radius: 9999px;
  }

  @media (max-width: 640px) {
    .post-banner img {
      max-height: 180px;
    }

    .post-icon-stage {
      height: 96px;
    }
  }
</style>
