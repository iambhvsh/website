<script lang="ts">
  import { Section, Pill } from '$lib/components/ui';
  import { INTERESTS } from '$lib/data/interests';
</script>

<Section id="interests" title="Interests">
  <div class="int">
    {#each INTERESTS as interest (interest.label)}
      <Pill label={interest.label} icon={interest.icon} />
    {/each}
  </div>
</Section>

<style>
  .int {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
  }
</style>
