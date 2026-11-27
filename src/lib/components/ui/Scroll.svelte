<script lang="ts">
  import ArrowDownwardIcon from '~icons/material-symbols/arrow-downward-rounded';

  interface Props {
    href: string;
    label?: string;
  }

  let { href, label = 'Scroll for more' }: Props = $props();
</script>

<div class="scroll-wrap">
  <a class="scroll-cue label" {href}>
    <span>{label}</span>
    <ArrowDownwardIcon aria-hidden="true" />
  </a>
</div>

<style>
  .scroll-wrap {
    display: flex;
    justify-content: center;
  }

  .scroll-cue {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 8px 18px;
    border-radius: 24px;
    background: var(--sf);
    color: var(--onv);
    text-decoration: none;
    transition:
      border-radius var(--dur-spring-fast) var(--spring-fast),
      background-color var(--dur-short4) var(--ease-emphasized),
      color var(--dur-short4) var(--ease-emphasized);
  }

  .scroll-cue:hover {
    background: var(--sc);
    color: var(--onsc);
    border-radius: var(--r-lg);
  }

  .scroll-cue:active {
    border-radius: var(--r-md);
  }

  .scroll-cue :global(.ms-icon) {
    font-size: 16px;
  }
</style>
