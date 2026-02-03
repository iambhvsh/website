<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';

  let counterElement: HTMLElement;

  onMount(() => {
    const loadProgress = { val: 0 };
    const tlLoader = gsap.timeline();

    tlLoader.to(loadProgress, {
      val: 100,
      duration: 2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (counterElement) {
          counterElement.textContent = Math.floor(loadProgress.val) + "%";
        }
      }
    })
    .to(".preloader", {
      yPercent: -100,
      duration: 1,
      ease: "power4.inOut",
      delay: 0.2
    });
  });
</script>

<div class="preloader">
  <div class="counter" bind:this={counterElement}>0%</div>
</div>

<style>
  /* Full-screen loading animation */
  .preloader {
    position: fixed;
    inset: 0; /* Cover entire viewport */
    background: var(--text); /* Light background (inverted) */
    z-index: 20000; /* Highest layer */
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--bg); /* Dark text (inverted) */
    font-family: 'Syne', sans-serif; /* Bold display font */
    font-size: clamp(40px, 8vw, 100px); /* Responsive font size */
    font-weight: 800;
    will-change: opacity; /* Optimize for fade out */
  }
</style>
