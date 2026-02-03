<script lang="ts">
  import type { Capability } from '$lib/data/capabilities';
  export let capability: Capability;
  export let onSelect: (c: Capability) => void;

  function handleClick() {
    onSelect(capability);
  }
</script>

<div class="capability-item" data-magnet on:click={handleClick} on:keydown={(e) => e.key === 'Enter' && handleClick()} role="button" tabindex="0">
  <div class="capability-num">{capability.num}</div>
  <div class="capability-name">{capability.name}</div>
  <div class="capability-desc">{@html capability.description}</div>
  <div class="mobile-chevron" aria-hidden="true">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
  </div>
</div>

<style>
  /* Individual capability item */
  .capability-item {
    position: relative;
    padding: 40px 20px;
    margin: 0 -20px; /* Negative margin for full-width hover */
    border-bottom: 1px solid var(--border);
    display: grid;
    grid-template-columns: 0.5fr 1.5fr 2fr; /* Number, Title, Description */
    align-items: flex-start;
    transition: all 0.4s var(--ease);
    border-radius: 0;
  }

  /* Mobile chevron indicator (hidden on desktop) */
  .mobile-chevron {
    display: none;
    position: absolute;
    top: 50%;
    right: 20px;
    transform: translateY(-50%);
    opacity: 0.7;
    pointer-events: none;
    transition: transform 0.3s ease;
  }

  /* Rotate chevron on tap (mobile) */
  .capability-item:active .mobile-chevron {
    transform: translateY(-50%) rotate(90deg);
  }

  /* Hover effect - subtle background */
  .capability-item:hover {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 20px;
  }

  /* Capability number (01/, 02/, etc.) */
  .capability-num {
    font-family: 'Syne', sans-serif;
    color: var(--gray);
    margin-top: 5px;
  }

  /* Capability name/title */
  .capability-name {
    font-size: 32px;
    font-weight: 500;
    margin-bottom: 15px;
  }

  /* Capability description */
  .capability-desc {
    font-size: 16px;
    color: var(--gray);
    line-height: 1.6;
    max-width: 600px;
  }

  @media (max-width: 1024px) {
    .capability-item {
      grid-template-columns: 1fr;
      gap: 15px;
      padding-right: 50px;
    }

    .mobile-chevron {
      display: block;
    }

    .capability-num,
    .capability-desc {
      display: none;
    }
  }
</style>
