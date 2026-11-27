<script lang="ts">
  import type { ExternalLinkItem } from "$lib/data/links";
  import ArrowOutwardIcon from "~icons/material-symbols/arrow-outward-rounded";

  interface Props {
    item: ExternalLinkItem;
  }

  let { item }: Props = $props();
  const IconComponent = $derived(item.icon);
</script>

<a
  class="link surface-morph interactive"
  href={item.href}
  target={item.external ? "_blank" : undefined}
  rel={item.external ? "noopener noreferrer" : undefined}
>
  <span class="ic" aria-hidden="true">
    <IconComponent />
  </span>
  <span>
    <span class="tm">{item.label}</span>
    <small class="bs">{item.subtitle}</small>
  </span>
  <span class="trailing" aria-hidden="true">
    <ArrowOutwardIcon />
  </span>
</a>

<style>
  .link {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: var(--sf);
    color: inherit;
    text-decoration: none;
  }

  .link:hover {
    background: var(--sf3);
  }

  .link:focus-visible {
    outline: 3px solid var(--p);
    outline-offset: 3px;
  }

  .ic {
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    background: var(--pc);
    color: var(--onpc);
    border-radius: 22px;
    flex: none;
    transition: border-radius 0.5s var(--spring);
  }

  .link:hover .ic {
    border-radius: 14px;
  }

  small {
    display: block;
    color: var(--onv);
  }

  .trailing {
    margin-left: auto;
    color: var(--onv);
    display: inline-flex;
  }
</style>
