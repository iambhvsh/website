<script lang="ts">
  const items = [
    "HTML", "CSS", "JAVASCRIPT", "REACTJS", "NEXT.JS", "TAILWINDCSS",
    "HTML", "CSS", "JAVASCRIPT", "REACTJS", "NEXT.JS", "TAILWINDCSS"
  ];
</script>

<section class="marquee-section" aria-hidden="true" style="opacity: 0.6;">
  <div class="marquee">
    <!-- First marquee track -->
    <div class="marquee-inner">
      {#each items as item}
        <div class="marquee-item">{item}</div>
      {/each}
    </div>
    <!-- Second marquee track (for seamless loop) -->
    <div class="marquee-inner">
      {#each items as item}
        <div class="marquee-item">{item}</div>
      {/each}
    </div>
  </div>
</section>

<style>
  /* Scrolling technology/skills marquee */
  .marquee-section {
    padding: 80px 0;
    overflow: hidden; /* Hide overflowing text */
    width: 100%;
    background: #0a0a0a; /* Slightly lighter than main bg */
  }

  /* Container for marquee tracks */
  .marquee {
    display: flex;
    width: fit-content;
  }

  /* Individual marquee track (2 tracks for seamless loop) */
  .marquee-inner {
    display: flex;
    gap: 6vw; /* Spacing between items */
    animation: marquee 20s linear infinite; /* Continuous scroll */
    padding-right: 6vw;
    will-change: transform; /* Optimize animation */
  }

  /* Individual technology name */
  .marquee-item {
    font-family: 'Syne', sans-serif;
    font-size: 8vw; /* Large, responsive text */
    font-weight: 700;
    color: transparent; /* Outlined text effect */
    -webkit-text-stroke: 1px #333;
    transition: all 0.3s;
    white-space: nowrap; /* No text wrapping */
  }

  /* Fill text on hover */
  .marquee-item:hover {
    color: var(--text);
    -webkit-text-stroke: 0;
  }

  /* Marquee animation - continuous leftward scroll */
  @keyframes marquee {
    0% {
      transform: translateX(0);
    }

    100% {
      transform: translateX(-100%); /* Move one full width */
    }
  }
</style>
