<script lang="ts">
  import { Card } from '$lib/components/ui';
  import ArrowOutwardIcon from '~icons/material-symbols/arrow-outward-rounded';
  import type { WritingPost } from '$lib/services/feed';

  interface Props {
    post: WritingPost;
  }

  let { post }: Props = $props();
</script>

<Card href={post.link} external class="post">
  {#if post.formattedDate}
    <div class="label date">{post.formattedDate}</div>
  {/if}
  <h3 class="tl flex600 title">{post.title}</h3>
  <p class="bm desc">{post.description}</p>
  {#if post.categories.length}
    <div class="cats bs">
      {#each post.categories as cat (cat)}
        <span>{cat}</span>
      {/each}
    </div>
  {/if}
  <span class="go" aria-hidden="true">
    <ArrowOutwardIcon />
  </span>
</Card>

<style>
  :global(.card.post) {
    min-height: 240px;
  }

  .date {
    color: var(--p);
  }

  .title {
    overflow-wrap: anywhere;
  }

  .desc {
    color: var(--onv);
    flex: 1;
  }

  .cats {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .cats span {
    padding: 2px 10px;
    background: var(--sc);
    color: var(--onsc);
    border-radius: 8px;
  }

  .go {
    align-self: flex-end;
    display: inline-flex;
    transition: transform 0.4s var(--spring);
  }
</style>
