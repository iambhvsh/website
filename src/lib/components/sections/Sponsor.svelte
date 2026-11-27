<script lang="ts">
  import { Panel, Section, Split } from '$lib/components/ui';
  import type { SplitMenuItem } from '$lib/components/ui/Split.svelte';
  import { SITE } from '$lib/data/site';
  import FavoriteIcon from '~icons/material-symbols/favorite-outline-rounded';
  import LocalCafeIcon from '~icons/material-symbols/local-cafe-outline-rounded';

  const sponsorMenuItems: readonly SplitMenuItem[] = [
    {
      label: 'Buy me a coffee',
      subtitle: 'One-time support',
      icon: LocalCafeIcon,
      href: SITE.buyMeACoffeeUrl,
      external: true,
    },
  ];
</script>

<Section id="sponsor" title="Sponsor">
  <Panel tone="tertiary" class="sponsor">
    <div>
      <h3 class="tl flex600">Support what I build</h3>
      <p class="bl copy">
        If my open-source work or writing is useful to you, you can sponsor it.
      </p>
    </div>

    <Split
      label="GitHub Sponsors"
      tone="on-tertiary"
      align="end"
      href={SITE.githubSponsorsUrl}
      external
      menuLabel="More sponsorship options"
      items={sponsorMenuItems}
    >
      {#snippet leadingIcon()}
        <FavoriteIcon />
      {/snippet}
    </Split>
  </Panel>
</Section>

<style>
  :global(.panel.sponsor) {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    align-items: center;
    justify-content: space-between;
  }

  .copy {
    color: inherit;
    opacity: 0.85;
    margin-top: 4px;
  }
</style>
