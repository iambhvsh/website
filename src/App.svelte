<script lang="ts">
  import {
    About,
    Devices,
    Explore,
    Footer,
    Header,
    Hero,
    Interests,
    Links,
    Listening,
    Music,
    Projects,
    Setup,
    Sponsor,
    Stack,
    Writing,
  } from '$lib/components/sections';
  import { Button, Fab, Macbook, Phone, Section } from '$lib/components/ui';
  import { MAC_APPS, MAC_SPECS } from '$lib/data/mac';
  import { PHONE_APPS, PHONE_SPECS } from '$lib/data/phone';
  import { router } from '$lib/stores/router.svelte';

  let isScrolled = $state(false);

  $effect(() => {
    document.title = router.current.title;
  });

  $effect(() => {
    const stopRouter = router.listen();
    const blockSelect = (event: Event) => event.preventDefault();
    const onScroll = () => {
      const y = window.scrollY;
      if (!isScrolled && y > 360) {
        isScrolled = true;
      } else if (isScrolled && y < 240) {
        isScrolled = false;
      }
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('selectstart', blockSelect);

    return () => {
      stopRouter();
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('selectstart', blockSelect);
    };
  });
</script>

<div class="page-shell">
  <Header activeSection={router.current.navId} />

  <main id="top" class="wrap" class:subpage={router.current.id !== 'home'}>
    {#if router.current.id === 'home'}
      <Hero />
      <Explore />
      <Sponsor />
      <Links />
    {:else if router.current.id === 'about'}
      <About />
      <Stack />
      <Devices />
      <Interests />
    {:else if router.current.id === 'work'}
      <Projects />
    {:else if router.current.id === 'writing'}
      <Writing />
    {:else if router.current.id === 'music'}
      <Listening />
      <Music />
    {:else if router.current.id === 'mac'}
      <Setup
        id="mac"
        title="Mac"
        subtitle="My primary machine for writing code and building interfaces."
        specs={MAC_SPECS}
        appsTitle="Apps I use"
        apps={MAC_APPS}
      >
        {#snippet illustration()}
          <Macbook />
        {/snippet}
      </Setup>
    {:else if router.current.id === 'phone'}
      <Setup
        id="phone"
        title="Phone"
        subtitle="My daily Android phone and the place where I use my own apps."
        specs={PHONE_SPECS}
        appsTitle="Apps I use"
        apps={PHONE_APPS}
      >
        {#snippet illustration()}
          <Phone />
        {/snippet}
      </Setup>
    {:else}
      <Section id="not-found" title="Page not found">
        <p class="bm not-found-copy">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <Button href="/">Go home</Button>
      </Section>
    {/if}
  </main>

  <Footer />
</div>

<Fab visible={isScrolled} />

<style>
  .page-shell {
    min-height: 100vh;
    min-height: 100svh;
    display: flex;
    flex-direction: column;
  }

  main {
    flex: 1;
    width: 100%;
  }

  main.subpage {
    padding-top: 40px;
  }

  .not-found-copy {
    color: var(--onv);
    margin-bottom: 24px;
    max-width: 44ch;
  }
</style>
