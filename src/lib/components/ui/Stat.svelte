<script lang="ts">
  interface Props {
    value: string;
    label: string;
    tone?: 'primary' | 'secondary' | 'tertiary';
    href?: string;
    external?: boolean;
  }

  let {
    value,
    label,
    tone = 'primary',
    href,
    external = true,
  }: Props = $props();
</script>

{#if href}
  <a
    class="stat surface-morph interactive {tone}"
    {href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noopener noreferrer' : undefined}
  >
    <span class="headline">{value}</span>
    <span class="label">{label}</span>
  </a>
{:else}
  <div class="stat surface-morph {tone}">
    <span class="headline">{value}</span>
    <span class="label">{label}</span>
  </div>
{/if}

<style>
  .stat {
    padding: 24px 28px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-decoration: none;
  }

  .stat.primary {
    background: var(--pc);
    color: var(--onpc);
  }

  .stat.secondary {
    background: var(--sc);
    color: var(--onsc);
  }

  .stat.tertiary {
    background: var(--tc);
    color: var(--ontc);
  }

  .stat .headline {
    font-size: 32px;
  }

  .stat:focus-visible {
    outline: 3px solid var(--p);
    outline-offset: 3px;
  }
</style>
