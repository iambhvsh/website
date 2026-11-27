<script lang="ts">
  import { Section, Stat, Panel } from '$lib/components/ui';
  import { ABOUT_STATS } from '$lib/data/site';
</script>

<Section id="about" title="About">
  <div class="about">
    <Panel class="bio">
      <p class="bl inline">
        Pursuing a <b>Bachelor of Science in Information Technology</b> while independently
        building web interfaces, developer tools and small systems.
      </p>
      <p class="bl inline">
        The interest in technology started early and mostly self-directed. Over time it
        became more focused: building things with care, and paying attention to the
        difference between software that <b>works</b> and software that <b>feels right</b>.
      </p>
      <p class="bl inline">
        Most projects are frontend. Transition timing, state, layout density, behaviour
        under edge conditions. Small decisions that compound. The preference throughout:
        do less, but do it carefully.
      </p>
    </Panel>

    <div class="stats">
      {#each ABOUT_STATS as stat (stat.label)}
        <Stat
          value={stat.value}
          label={stat.label}
          tone={stat.tone}
          href={stat.href}
        />
      {/each}
    </div>
  </div>
</Section>

<style>
  .about {
    display: grid;
    gap: 16px;
    grid-template-columns: 2fr 1fr;
  }

  @media (max-width: 820px) {
    .about {
      grid-template-columns: 1fr;
    }
  }

  :global(.bio) p {
    color: var(--onv);
  }

  :global(.bio) p + p {
    margin-top: 16px;
  }

  .stats {
    display: grid;
    gap: 16px;
    grid-template-rows: repeat(3, 1fr);
  }
</style>
