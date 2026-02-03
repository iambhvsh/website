<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
  import Lenis from '@studio-freight/lenis';

  import Navbar from '$lib/components/Navbar.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import BottomSheet from '$lib/components/BottomSheet.svelte';
  import Cursor from '$lib/components/Cursor.svelte';
  import Preloader from '$lib/components/Preloader.svelte';
  import BackToTop from '$lib/components/BackToTop.svelte';
  import Marquee from '$lib/components/Marquee.svelte';
  import ProjectCard from '$lib/components/ProjectCard.svelte';
  import CapabilityItem from '$lib/components/CapabilityItem.svelte';
  import EducationItem from '$lib/components/EducationItem.svelte';

  import { projects } from '$lib/data/projects';
  import { capabilities, type Capability } from '$lib/data/capabilities';
  import { education } from '$lib/data/education';

  let lenis: Lenis;
  let isBottomSheetActive = false;
  let activeCapability: Capability = { num: '', name: '', description: '' };

  // SEO JSON-LD
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Bhavesh Patil",
    "url": "https://iambhvsh.in/",
    "image": "https://iambhvsh.in/profile.webp",
    "sameAs": [
      "https://github.com/iambhvsh",
      "https://twitter.com/iambhvsh",
      "https://instagram.com/iambhvsh",
      "https://linkedin.com/in/iambhvsh"
    ],
    "jobTitle": "Creative Developer",
    "worksFor": {
      "@type": "Organization",
      "name": "Freelance"
    },
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Dr. G. Y. Pathrikar College of CS & IT"
    },
    "knowsAbout": [
      "Web Development",
      "React",
      "Next.js",
      "JavaScript",
      "Python",
      "UI/UX Design",
      "Full Stack Development"
    ],
    "email": "iam.bhvsh@gmail.com",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Chhatrapati Sambhajinagar",
      "addressRegion": "Maharashtra",
      "addressCountry": "IN"
    }
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Bhavesh Patil Portfolio",
    "url": "https://iambhvsh.in/",
    "description": "Portfolio website showcasing web development projects and skills",
    "author": {
      "@type": "Person",
      "name": "Bhavesh Patil"
    },
    "inLanguage": "en-US"
  };

  onMount(() => {
    // Register GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Initialize Lenis
    lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    } as any);

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function (this: Element, e) {
        e.preventDefault();
        const href = this.getAttribute('href');
        if (href) lenis.scrollTo(href);
      });
    });

    // Hero parallax effect
    gsap.to(".hero-title", {
      yPercent: 30,
      opacity: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: true
      }
    });

    // Animate project cards
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((project) => {
      gsap.from(project, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: project,
          start: "top 85%",
        }
      });
    });

    // Animate about section
    gsap.from(".about-content", {
      y: 50,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: ".about-me",
        start: "top 75%",
      }
    });

    // Animate education items
    const educationItems = document.querySelectorAll('.education-item');
    educationItems.forEach((item) => {
      gsap.from(item, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
        }
      });
    });

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  });

  function openBottomSheet(capability: Capability) {
    if (window.innerWidth > 1024) return;
    activeCapability = capability;
    isBottomSheetActive = true;
  }

  function closeBottomSheet() {
    isBottomSheetActive = false;
  }
</script>

<svelte:head>
  <title>://BP - Creative Developer & Full Stack Engineer</title>
  <meta name="description" content="Bhavesh Patil is a Creative Developer specializing in modern web development with React, Next.js, and Python. View my portfolio of innovative web projects and tools." />
  <meta name="keywords" content="Bhavesh Patil, Creative Developer, Web Developer, Frontend Engineer, React, Next.js, Portfolio, UI/UX, GSAP, Full Stack Developer" />
  <meta name="author" content="Bhavesh Patil" />
  <meta name="theme-color" content="#050505" />
  <meta name="color-scheme" content="dark" />
  <link rel="canonical" href="https://iambhvsh.in/" />

  <!-- Open Graph / Facebook Meta Tags -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://iambhvsh.in/">
  <meta property="og:title" content="Bhavesh Patil | Creative Developer & Full Stack Engineer">
  <meta property="og:description" content="Portfolio of Bhavesh Patil - Where design, motion, and code converge to create meaningful web experiences.">
  <meta property="og:site_name" content="Bhavesh Patil Portfolio">
  <meta property="og:locale" content="en_US">

  <!-- Twitter / X Card Meta Tags -->
  <meta property="twitter:card" content="summary_large_image">
  <meta property="twitter:url" content="https://iambhvsh.in/">
  <meta property="twitter:title" content="Bhavesh Patil | Creative Developer & Full Stack Engineer">
  <meta property="twitter:description" content="Portfolio of Bhavesh Patil - Where design, motion, and code converge to create meaningful web experiences.">
  <meta property="twitter:creator" content="@iambhvsh">

  <script type="application/ld+json">
    {@html JSON.stringify(personSchema)}
  </script>
  <script type="application/ld+json">
    {@html JSON.stringify(websiteSchema)}
  </script>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous">
  <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;600&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
</svelte:head>

<!-- Visual overlay effects -->
<div class="noise"></div>

<Cursor />
<Preloader />
<Navbar />

<main role="main" id="main-content">
  <!-- HERO SECTION -->
  <section class="hero">
    <h1 class="hero-title display-text">
      <div class="hero-row"><span>BHAVESH</span></div>
      <div class="hero-row"><span>PATIL</span></div>
    </h1>
    <p class="hero-subtitle">
      Where design, motion, <br>
      and code converge to create meaningful web experiences.
    </p>
    <div class="hero-cta">
      <a href="#work" class="hero-btn" data-magnet>
        View My Work
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 10H16M16 10L10 4M16 10L10 16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </a>
    </div>
  </section>

  <Marquee />

  <!-- PROJECTS SECTION -->
  <section class="projects" id="work" aria-labelledby="projects-heading">
    <div class="section-header">
      <h2 id="projects-heading">Projects</h2>
      <div class="section-number">(01)</div>
    </div>
    <div class="projects-grid">
      {#each projects as project}
        <ProjectCard {project} />
      {/each}
    </div>
  </section>

  <!-- CAPABILITIES SECTION -->
  <section class="capabilities" aria-labelledby="capabilities-heading">
    <div class="section-header">
      <h2 id="capabilities-heading">What I Do</h2>
      <div class="section-number">(02)</div>
    </div>
    <div class="capabilities-list">
      {#each capabilities as capability}
        <CapabilityItem {capability} onSelect={openBottomSheet} />
      {/each}
    </div>
  </section>

  <!-- ABOUT SECTION -->
  <section class="about-me" id="about" aria-labelledby="about-heading">
    <div class="section-header">
      <h2 id="about-heading">About Me</h2>
      <div class="section-number">(03)</div>
    </div>
    <div class="about-content">
      <div class="about-text">
        <p>
          Hello! I'm Bhavesh Patil, a creative developer with a passion for building digital experiences that merge
          clean code with thoughtful design. I thrive on the challenge of turning complex problems into simple,
          beautiful solutions.
        </p>
        <p>
          My journey began with a curiosity for how things work on the web, which quickly evolved into a full-fledged
          career. I love exploring new technologies, experimenting with motion graphics, and constantly refining my
          craft.
        </p>
        <p>
          When I'm not coding, you can find me exploring the latest design trends, contributing to open-source
          projects, or sharing my knowledge with the developer community.
        </p>
        <div class="music-player">
          <h3>What's playing</h3>
          <iframe title="Apple Music Player - End of Beginning"
            allow="autoplay *; encrypted-media *; fullscreen *; clipboard-write" frameborder="0" width="450"
            height="150" style="width:100%;max-width:450px;overflow:hidden;border-radius:10px;background:#050505;"
            sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation-by-user-activation"
            src="https://embed.music.apple.com/in/song/end-of-beginning/1632448108?theme=dark"
            loading="lazy"></iframe>
        </div>
      </div>
      <div class="about-image" data-magnet-card>
        <a href="/profile.webp" target="_blank" rel="noopener noreferrer">
          <img src="/profile.webp" alt="Bhavesh Patil - Creative Developer Portfolio Photo" width="358" height="358"
            fetchpriority="high" loading="eager" decoding="async">
        </a>
      </div>
    </div>
  </section>

  <!-- EDUCATION SECTION -->
  <section class="education" id="education" aria-labelledby="education-heading">
    <div class="section-header">
      <h2 id="education-heading">Education</h2>
      <div class="section-number">(04)</div>
    </div>
    <div class="education-list">
      {#each education as edu}
        <EducationItem education={edu} />
      {/each}
    </div>
  </section>

  <Footer />
</main>

<BackToTop />

<BottomSheet
  active={isBottomSheetActive}
  num={activeCapability.num}
  title={activeCapability.name}
  description={activeCapability.description}
  onClose={closeBottomSheet}
/>
