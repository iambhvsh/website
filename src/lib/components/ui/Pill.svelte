<script lang="ts">
  import type { Component } from 'svelte';

  interface Props {
    label: string;
    icon?: Component;
    compact?: boolean;
  }

  let { label, icon: IconComponent, compact = false }: Props = $props();
</script>

<span class="tag-pill label" class:compact>
  {#if IconComponent}
    <IconComponent aria-hidden="true" />
  {/if}
  {label}
</span>

<style>
  .tag-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    background: var(--sc);
    color: var(--onsc);
    border-radius: var(--r-lg-inc);
    transition:
      border-radius var(--dur-spring-fast) var(--spring-fast),
      background-color var(--dur-short4) var(--ease-emphasized);
    cursor: default;
  }

  .tag-pill.compact {
    padding: 8px 16px;
    border-radius: var(--r-md);
  }

  .tag-pill:hover {
    border-radius: var(--r-md);
  }

  .tag-pill.compact:hover {
    border-radius: var(--r-sm);
  }
</style>
