<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    href?: string;
    external?: boolean;
    overline?: string;
    headline: string;
    supporting?: string;
    meta?: string;
    onpointerenter?: () => void;
    onpointerleave?: () => void;
    leading?: Snippet;
    trailing?: Snippet;
  }

  let {
    href,
    external = false,
    overline,
    headline,
    supporting,
    meta,
    onpointerenter,
    onpointerleave,
    leading,
    trailing,
  }: Props = $props();
</script>

{#if href}
  <a
    class="list-item"
    {href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    {onpointerenter}
    {onpointerleave}
  >
    {#if leading}
      <div class="li-lead" aria-hidden="true">{@render leading()}</div>
    {/if}
    <div class="li-body">
      {#if overline}
        <span class="label li-over">{overline}</span>
      {/if}
      <h3 class="tm flex600 li-head">{headline}</h3>
      {#if supporting}
        <p class="bm li-supp">{supporting}</p>
      {/if}
      {#if meta}
        <span class="bs li-meta">{meta}</span>
      {/if}
    </div>
    {#if trailing}
      <div class="li-trail" aria-hidden="true">{@render trailing()}</div>
    {/if}
  </a>
{:else}
  <div
    class="list-item"
    role="presentation"
    {onpointerenter}
    {onpointerleave}
  >
    {#if leading}
      <div class="li-lead" aria-hidden="true">{@render leading()}</div>
    {/if}
    <div class="li-body">
      {#if overline}
        <span class="label li-over">{overline}</span>
      {/if}
      <h3 class="tm flex600 li-head">{headline}</h3>
      {#if supporting}
        <p class="bm li-supp">{supporting}</p>
      {/if}
      {#if meta}
        <span class="bs li-meta">{meta}</span>
      {/if}
    </div>
    {#if trailing}
      <div class="li-trail" aria-hidden="true">{@render trailing()}</div>
    {/if}
  </div>
{/if}

<style>
  .list-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: var(--sf);
    color: inherit;
    text-decoration: none;
    border-radius: var(--r-sm);
    transition:
      border-radius var(--dur-spring-fast) var(--spring-fast),
      background-color var(--dur-short4) var(--ease-emphasized);
  }

  .list-item:first-child {
    border-radius: var(--r-xl) var(--r-xl) var(--r-sm) var(--r-sm);
  }

  .list-item:last-child {
    border-radius: var(--r-sm) var(--r-sm) var(--r-xl) var(--r-xl);
  }

  .list-item:only-child {
    border-radius: var(--r-xl);
  }

  @media (hover: hover) {
    .list-item:hover {
      background: var(--sf3);
      border-radius: var(--r-lg-inc);
    }
  }

  .list-item:active {
    background: var(--sf3);
    border-radius: var(--r-lg);
  }

  .list-item:focus-visible {
    outline: 3px solid var(--p);
    outline-offset: 2px;
  }

  .li-lead {
    flex: none;
  }

  .li-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .li-over {
    color: var(--p);
  }

  .li-supp {
    color: var(--onv);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
  }

  .li-meta {
    color: var(--onv);
    opacity: 0.78;
    margin-top: 2px;
  }

  .li-trail {
    flex: none;
    color: var(--onv);
    display: inline-flex;
  }
</style>
