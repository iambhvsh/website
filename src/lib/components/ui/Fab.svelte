<script lang="ts">
  import ArrowUpwardIcon from '~icons/material-symbols/arrow-upward-rounded';

  interface Props {
    visible?: boolean;
    href?: string;
    ariaLabel?: string;
  }

  let {
    visible = false,
    href = '#top',
    ariaLabel = 'Back to top',
  }: Props = $props();
</script>

<a
  class="fab"
  class:visible
  {href}
  aria-label={ariaLabel}
  tabindex={visible ? 0 : -1}
  aria-hidden={!visible}
>
  <ArrowUpwardIcon />
</a>

<style>
  .fab {
    position: fixed;
    right: 24px;
    bottom: calc(env(safe-area-inset-bottom, 0px) + 24px);
    z-index: 18;
    width: 56px;
    height: 56px;
    display: grid;
    place-items: center;
    background: var(--pc);
    color: var(--onpc);
    border-radius: var(--r-lg);
    text-decoration: none;
    box-shadow:
      0 4px 8px 3px rgba(0, 0, 0, 0.14),
      0 1px 3px rgba(0, 0, 0, 0.24);
    opacity: 0;
    pointer-events: none;
    transform: translate3d(0, 16px, 0);
    will-change: transform, opacity;
    transition:
      opacity var(--dur-short4) var(--ease-emphasized-accel),
      transform var(--dur-short4) var(--ease-emphasized-accel),
      border-radius var(--dur-spring-fast) var(--spring-fast),
      background-color var(--dur-short4) var(--ease-emphasized),
      box-shadow var(--dur-short4) var(--ease-emphasized);
  }

  .fab.visible {
    opacity: 1;
    pointer-events: auto;
    transform: translate3d(0, 0, 0);
    transition:
      opacity var(--dur-short4) var(--ease-emphasized-decel),
      transform var(--dur-spring) var(--spring),
      border-radius var(--dur-spring-fast) var(--spring-fast),
      background-color var(--dur-short4) var(--ease-emphasized),
      box-shadow var(--dur-short4) var(--ease-emphasized);
  }

  .fab:hover {
    border-radius: var(--r-xl);
    box-shadow:
      0 6px 10px 4px rgba(0, 0, 0, 0.16),
      0 2px 3px rgba(0, 0, 0, 0.28);
  }

  .fab:active {
    border-radius: var(--r-md);
  }

  .fab:focus-visible {
    outline: 3px solid var(--p);
    outline-offset: 3px;
  }

  @media (max-width: 700px) {
    .fab {
      right: 16px;
      bottom: calc(env(safe-area-inset-bottom, 0px) + 20px);
    }
  }
</style>
