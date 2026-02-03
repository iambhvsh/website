<script lang="ts">
  import { onMount } from 'svelte';

  let timeEl: HTMLElement;

  onMount(() => {
    const updateTime = () => {
      const now = new Date();
      if (timeEl) {
        timeEl.textContent = now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit'
        });
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);
  });
</script>

<footer id="connect" role="contentinfo" aria-label="Contact and footer information">
  <!-- Call-to-action area -->
  <div class="footer-content">
    <div class="footer-cta">Have an Idea?</div>
    <a href="mailto:iam.bhvsh@gmail.com" class="btn-large" data-magnet>Start a Project</a>
  </div>

  <!-- Footer bottom -->
  <div class="footer-bottom">
    <!-- Copyright -->
    <div>©2026 Bhavesh Patil</div>

    <!-- Social media links -->
    <div>
      <a href="https://github.com/iambhvsh" target="_blank" rel="noopener noreferrer" style="margin: 0 10px;">GitHub</a>
      <a href="https://instagram.com/iambhvsh" target="_blank" rel="noopener noreferrer" style="margin: 0 10px;">Instagram</a>
      <a href="https://twitter.com/iambhvsh" target="_blank" rel="noopener noreferrer" style="margin: 0 10px;">Twitter</a>
      <a href="https://linkedin.com/in/iambhvsh" target="_blank" rel="noopener noreferrer" style="margin: 0 10px;">LinkedIn</a>
    </div>

    <!-- Live time display -->
    <div>
      <span bind:this={timeEl} id="time">00:00</span>
    </div>
  </div>
</footer>

<style>
  /* Footer section with inverted colors */
  footer {
    padding: 100px 5vw 40px 5vw;
    background: #e1e1e1; /* Light background (inverted) */
    color: #050505; /* Dark text (inverted) */
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  /* Main footer content area */
  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    justify-content: center;
    flex-grow: 1;
  }

  /* Large call-to-action text */
  .footer-cta {
    font-family: 'Syne', sans-serif;
    font-size: clamp(40px, 12vw, 150px); /* Responsive: 40px to 150px */
    font-weight: 800;
    line-height: 0.9;
    text-transform: uppercase;
    margin-bottom: 60px;
  }

  /* Large CTA button in footer */
  .btn-large {
    padding: 20px 40px;
    background: #050505; /* Dark button on light bg */
    color: #fff;
    border-radius: 50px;
    text-decoration: none;
    text-transform: uppercase;
    font-weight: 600;
    transition: transform 0.3s;
    display: inline-block;
  }

  /* Scale up on hover */
  .btn-large:hover {
    transform: scale(1.05);
  }

  /* Footer bottom section with links */
  .footer-bottom {
    margin-top: 0;
    padding-top: 20px;
    border-top: 1px solid rgba(0, 0, 0, 0.1);
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    text-transform: uppercase;
    font-weight: 600;
  }

  @media (max-width: 768px) {
    .footer-bottom {
      flex-direction: column;
      gap: 20px;
      text-align: center;
    }
  }
</style>
