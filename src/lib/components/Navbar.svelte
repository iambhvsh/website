<script lang="ts">
  // Navigation component
</script>

<nav role="navigation" aria-label="Main navigation">
  <!-- Logo -->
  <a href="/" aria-label="Homepage - Bhavesh Patil">
    <div class="logo">://BP</div>
  </a>
  <!-- Contact CTA button -->
  <a href="#connect" class="menu-btn" data-magnet aria-label="Contact section">Let's Talk</a>
</nav>

<style>
  /* Fixed navigation bar at top of page */
  nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    padding: 30px 5vw; /* Responsive horizontal padding */
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 1000; /* Above content */
    mix-blend-mode: difference; /* Invert colors underneath */
  }

  /* Logo/brand text */
  .logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 24px;
    letter-spacing: -0.02em;
  }

  /* Navigation button (e.g., "Let's Talk") */
  .menu-btn {
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
    padding: 10px 20px;
    border: 1px solid var(--text);
    border-radius: 50px; /* Pill-shaped button */
    transition: all 0.3s;
    text-decoration: none;
    color: var(--text);
  }

  /* Menu button hover effect - invert colors */
  .menu-btn:hover {
    background: var(--text);
    color: var(--bg);
  }

  @media (max-width: 768px) {
    nav {
      padding: 20px;
    }
  }
</style>
