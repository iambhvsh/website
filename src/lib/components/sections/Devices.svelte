<script lang="ts">
  import { Section } from '$lib/components/ui';
  import { DEVICES } from '$lib/data/devices';
  import Device from './Device.svelte';
</script>

<Section id="devices" title="Devices">
  <div class="devs">
    {#each DEVICES as device, i (device.name)}
      <Device {device} index={i} />
    {/each}
  </div>
</Section>

<style>
  .devs {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
</style>
