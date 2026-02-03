<script lang="ts">
  import { onMount } from 'svelte';

  export let active = false;
  export let num = '';
  export let title = '';
  export let description = '';
  export let onClose: () => void;

  let bottomSheet: HTMLElement;
  let overlay: HTMLElement;

  function handleClose() {
    onClose();
  }
</script>

<!-- Bottom sheet overlay (for mobile) -->
<div
  class="bottom-sheet-overlay {active ? 'active' : ''}"
  on:click={handleClose}
  on:keydown={(e) => e.key === 'Enter' && handleClose()}
  role="button"
  tabindex="0"
  aria-label="Close bottom sheet"
></div>

<!-- Bottom sheet panel (mobile) -->
<div class="bottom-sheet {active ? 'active' : ''}" bind:this={bottomSheet}>
  <div class="bottom-sheet-header">
    <div class="bottom-sheet-drag-handle"></div>
    <button class="bottom-sheet-close" on:click={handleClose}>&times;</button>
  </div>
  <div class="bottom-sheet-content">
    <div class="bs-num">{num}</div>
    <h3 class="bs-title">{title}</h3>
    <div class="bs-desc">{@html description}</div>
  </div>
</div>

<style>
  /* Overlay that dims background when bottom sheet is open */
  .bottom-sheet-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.6); /* Semi-transparent black */
    z-index: 9998;
    opacity: 0; /* Hidden by default */
    pointer-events: none; /* Non-interactive when hidden */
    transition: opacity 0.3s;
    backdrop-filter: blur(5px); /* Blur effect on background */
  }

  /* Active state - visible overlay */
  .bottom-sheet-overlay.active {
    opacity: 1;
    pointer-events: all; /* Enable click to close */
  }

  /* Sliding panel from bottom (mobile only) */
  .bottom-sheet {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background: #111;
    border-top-left-radius: 30px;
    border-top-right-radius: 30px;
    padding: 30px;
    z-index: 9999;
    transform: translateY(100%); /* Hidden below viewport */
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    border-top: 1px solid var(--border);
  }

  /* Active state - sheet slides up */
  .bottom-sheet.active {
    transform: translateY(0); /* Slide into view */
  }

  /* Bottom sheet header with drag handle */
  .bottom-sheet-header {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    position: relative;
  }

  /* Drag handle indicator */
  .bottom-sheet-drag-handle {
    width: 50px;
    height: 5px;
    background: var(--border);
    border-radius: 5px;
  }

  /* Close button for bottom sheet */
  .bottom-sheet-close {
    position: absolute;
    right: 0;
    top: -10px;
    background: none;
    border: none;
    color: var(--text);
    font-size: 24px;
    cursor: pointer;
    padding: 10px;
  }

  /* Bottom sheet content - capability number */
  .bs-num {
    font-family: 'Syne', sans-serif;
    color: var(--gray);
    margin-bottom: 10px;
  }

  /* Bottom sheet content - title */
  .bs-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 600;
    margin-bottom: 15px;
    color: var(--text);
  }

  /* Bottom sheet content - description */
  .bs-desc {
    color: var(--light-gray);
    line-height: 1.6;
    font-size: 16px;
  }
</style>
