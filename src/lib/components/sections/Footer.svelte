<script lang="ts">
  import { FOOTER_LINKS, SITE } from '$lib/data/site';
</script>

<footer>
  <div class="wrap bm">
    <div class="fl label">
      {#each FOOTER_LINKS as link (link.href)}
        <a
          href={link.href}
          target={link.external ? '_blank' : undefined}
          rel={link.external ? 'noopener noreferrer' : undefined}
        >
          {link.label}
        </a>
      {/each}
    </div>
    {SITE.copyright}
  </div>
</footer>

<style>
  footer {
    padding: 64px 0 48px;
    color: var(--onv);
  }

  .fl {
    display: flex;
    flex-wrap: wrap;
    gap: 8px 20px;
    margin-bottom: 12px;
  }

  footer a {
    color: var(--onv);
    text-decoration: none;
    border-radius: var(--r-sm);
    transition: color var(--dur-short4) var(--ease-emphasized);
  }

  footer a:hover {
    color: var(--p);
  }
</style>
