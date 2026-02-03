<script lang="ts">
  import { onMount } from 'svelte';
  import Lenis from '@studio-freight/lenis';

  // We need to access the lenis instance, assuming it's passed or globally available,
  // but for simplicity we'll just use window.scrollTo if lenis isn't available,
  // or rely on a global lenis instance if one exists.
  // In a clean SvelteKit way, we might want to use a store or context.
  // For now, let's assume standard smooth scroll or try to access the lenis instance from window if exposed.

  let btn: HTMLButtonElement;
  let isVisible = false;

  onMount(() => {
    const handleScroll = () => {
       // Simple check: show if scrolled past 500px
       if (window.scrollY > 500) {
         isVisible = true;
       } else {
         isVisible = false;
       }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // initial check

    return () => window.removeEventListener('scroll', handleScroll);
  });

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
</script>

<button
  class="back-to-top {isVisible ? 'visible' : ''}"
  on:click={scrollToTop}
  aria-label="Scroll back to top"
  title="Back to top"
  data-magnet
  bind:this={btn}
>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M12 19V5M5 12l7-7 7 7" />
  </svg>
</button>

<style>
  /* Floating back to top button */
  .back-to-top {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: var(--text);
    color: var(--bg);
    border-radius: 50%; /* Circular button */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 20002; /* Above most elements */
    opacity: 0; /* Hidden by default */
    pointer-events: none; /* Non-interactive when hidden */
    transition: opacity 0.4s var(--ease), transform 0.4s var(--ease);
    border: none;
    transform: translateY(20px); /* Start slightly below final position */
    cursor: pointer;
    mix-blend-mode: difference; /* Invert colors underneath */
  }

  /* Visible state - shown after scrolling down */
  .back-to-top.visible {
    opacity: 1;
    pointer-events: all; /* Enable interactions */
    transform: translateY(0); /* Slide into final position */
  }

  /* Hover effect - slight scale up */
  .back-to-top:hover {
    transform: translateY(0) scale(1.1);
  }
</style>
