<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    variant?: 'filled' | 'tonal';
    tone?: 'default' | 'on-tertiary';
    iconOnly?: boolean;
    spinning?: boolean;
    href?: string;
    external?: boolean;
    ariaLabel?: string;
    ariaPressed?: boolean;
    type?: 'button' | 'submit' | 'reset';
    class?: string;
    onclick?: (event: MouseEvent) => void;
    icon?: Snippet;
    children?: Snippet;
  }

  let {
    variant = 'filled',
    tone = 'default',
    iconOnly = false,
    spinning = false,
    href,
    external = false,
    ariaLabel,
    ariaPressed,
    type = 'button',
    class: className = '',
    onclick,
    icon,
    children,
  }: Props = $props();
</script>

{#if href}
  <a
    class="btn bl {variant} {tone} {className}"
    class:icon-btn={iconOnly}
    class:spin={spinning}
    {href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
    aria-label={ariaLabel}
    {onclick}
  >
    {#if icon}
      <span class="btn-icon" aria-hidden="true">{@render icon()}</span>
    {/if}
    {@render children?.()}
  </a>
{:else}
  <button
    class="btn bl {variant} {tone} {className}"
    class:icon-btn={iconOnly}
    class:spin={spinning}
    {type}
    aria-label={ariaLabel}
    aria-pressed={ariaPressed}
    {onclick}
  >
    {#if icon}
      <span class="btn-icon" aria-hidden="true">{@render icon()}</span>
    {/if}
    {@render children?.()}
  </button>
{/if}

<style>
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 48px;
    padding: 0 24px;
    border: 0;
    cursor: pointer;
    background: var(--p);
    color: var(--onp);
    border-radius: 24px;
    text-decoration: none;
    font-family: inherit;
    transition:
      border-radius var(--dur-spring-fast) var(--spring-fast),
      background-color var(--dur-short4) var(--ease-emphasized);
  }

  .btn:hover {
    border-radius: var(--r-lg);
  }

  .btn:active {
    border-radius: var(--r-md);
  }

  .btn.tonal {
    background: var(--sc);
    color: var(--onsc);
  }

  .btn.on-tertiary {
    background: var(--ontc);
    color: var(--tc);
  }

  .btn.tonal.on-tertiary {
    background: color-mix(in srgb, var(--ontc) 14%, transparent);
    color: var(--ontc);
  }

  .btn:focus-visible {
    outline: 3px solid var(--p);
    outline-offset: 3px;
  }

  .icon-btn {
    width: 48px;
    padding: 0;
    justify-content: center;
  }

  .icon-btn:hover {
    border-radius: var(--r-lg);
  }

  .icon-btn:active {
    border-radius: var(--r-md);
  }

  .btn-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .spin .btn-icon {
    animation: rot 0.8s linear infinite;
  }

  @keyframes rot {
    to {
      transform: rotate(360deg);
    }
  }
</style>
