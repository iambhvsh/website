<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';

  let cursor: HTMLElement;
  let cursorText: HTMLElement;

  onMount(() => {
    // Mouse move effect
    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: "power2.out"
      });
    };

    window.addEventListener('mousemove', moveCursor);

    // Magnetic elements hover effect
    const magnets = document.querySelectorAll('[data-magnet]');
    magnets.forEach((magnet) => {
      magnet.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
          scale: 3,
          backgroundColor: '#e1e1e1',
          mixBlendMode: 'difference',
          duration: 0.3
        });
        cursor.classList.add('hovered');
      });

      magnet.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
          scale: 1,
          backgroundColor: '#e1e1e1',
          mixBlendMode: 'difference',
          duration: 0.3
        });
        cursor.classList.remove('hovered');
      });
    });

    // Project cards hover effect
    const projectCards = document.querySelectorAll('[data-magnet-card]');
    projectCards.forEach((card) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
          scale: 3,
          mixBlendMode: 'normal',
          backgroundColor: 'rgba(0,0,0,0.2)',
          backdropFilter: 'blur(5px)',
          duration: 0.3
        });
        cursor.classList.add('hovered');
        cursorText.textContent = "View";
        cursorText.style.color = "#ffffff";
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
          scale: 1,
          mixBlendMode: 'difference',
          backgroundColor: '#e1e1e1',
          backdropFilter: 'blur(0px)',
          duration: 0.3
        });
        cursor.classList.remove('hovered');
        cursorText.textContent = "";
        cursorText.style.color = "";
      });
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
    };
  });
</script>

<div class="cursor" bind:this={cursor}>
  <span class="cursor-text" bind:this={cursorText}></span>
</div>

<style>
  /* Custom cursor element */
  .cursor {
    position: fixed;
    top: 0;
    left: 0;
    width: 12px;
    height: 12px;
    background-color: var(--text);
    border-radius: 50%; /* Circular cursor */
    pointer-events: none; /* Don't interfere with clicks */
    z-index: 10000; /* Always on top */
    transform: translate(-50%, -50%); /* Center cursor on mouse position */
    mix-blend-mode: difference; /* Invert colors underneath */
    display: flex;
    justify-content: center;
    align-items: center;
    will-change: transform; /* Optimize for animation */
  }

  /* Text inside cursor (e.g., "View") */
  .cursor-text {
    font-size: 10px;
    text-transform: uppercase;
    color: var(--bg);
    opacity: 0; /* Hidden by default */
    transition: opacity 0.2s;
    font-weight: 700;
    letter-spacing: 1px;
  }

  /* Show cursor text when hovered */
  :global(.cursor.hovered .cursor-text) {
    opacity: 1;
  }

  @media (max-width: 1024px) {
    .cursor {
      display: none !important;
    }
  }
</style>
