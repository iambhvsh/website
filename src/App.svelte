<script lang="ts">
  import {
    About,
    Devices,
    Footer,
    Header,
    Hero,
    Interests,
    Links,
    Listening,
    Projects,
    Sponsor,
    Stack,
    Writing,
  } from '$lib/components/sections';
  import { Fab } from '$lib/components/ui';
  import { SCROLL_SPY_ALIASES, SCROLL_SPY_SECTIONS } from '$lib/data/site';
  import { createScrollSpy } from '$lib/stores/spy.svelte';

  const scrollSpy = createScrollSpy({
    sectionIds: SCROLL_SPY_SECTIONS,
    aliases: SCROLL_SPY_ALIASES,
  });

  $effect(() => {
    const stopSpy = scrollSpy.observe();
    const blockSelect = (event: Event) => event.preventDefault();
    document.addEventListener('selectstart', blockSelect);

    return () => {
      stopSpy();
      document.removeEventListener('selectstart', blockSelect);
    };
  });
</script>

<Header activeSection={scrollSpy.activeId} />

<main class="wrap">
  <Hero />
  <About />
  <Stack />
  <Projects />
  <Writing />
  <Listening />
  <Devices />
  <Interests />
  <Sponsor />
  <Links />
</main>

<Footer />
<Fab visible={scrollSpy.isScrolled} />
