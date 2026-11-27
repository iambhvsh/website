<script lang="ts">
  import type { Component } from "svelte";
  import { Badge, Scroll, Section, Shape, Split } from "$lib/components/ui";
  import type { SplitMenuItem } from "$lib/components/ui/Split.svelte";
  import {
    PROJECT_CATEGORIES,
    PROJECTS,
    type ProjectCategory,
  } from "$lib/data/projects";
  import { SITE } from "$lib/data/site";
  import Github from "$lib/components/ui/Github.svelte";
  import {
    BADGE_HOVER_SHAPES,
    BADGE_REST_SHAPES,
    HERO_SHAPE_CYCLE,
    type ShapeName,
  } from "$lib/shapes";
  import AndroidIcon from "~icons/material-symbols/android";
  import AppsIcon from "~icons/material-symbols/apps";
  import GridViewIcon from "~icons/material-symbols/grid-view-outline-rounded";
  import LanguageIcon from "~icons/material-symbols/language";
  import Project from "./Project.svelte";

  const CATEGORY_ICONS: Record<ProjectCategory, Component> = {
    All: AppsIcon,
    Web: LanguageIcon,
    Android: AndroidIcon,
  };

  let activeCategory = $state<ProjectCategory>("All");
  let hoveredChip = $state<number | null>(null);
  let chipHoverCount = $state(0);
  let heroShapeIdx = $state(1);

  const filteredProjects = $derived(
    activeCategory === "All"
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === activeCategory),
  );

  function countFor(category: ProjectCategory): number {
    return category === "All"
      ? PROJECTS.length
      : PROJECTS.filter((p) => p.category === category).length;
  }

  function getChipShape(index: number): ShapeName {
    if (hoveredChip === index) {
      return BADGE_HOVER_SHAPES[(index + chipHoverCount) % BADGE_HOVER_SHAPES.length];
    }
    return BADGE_REST_SHAPES[index % BADGE_REST_SHAPES.length];
  }

  function jumpToCategory(category: ProjectCategory) {
    activeCategory = category;
    document.getElementById("projects-list")?.scrollIntoView({ behavior: "smooth" });
  }

  const projectActionItems: readonly SplitMenuItem[] = [
    {
      label: "Full archive",
      subtitle: "work.iambhvsh.in",
      icon: GridViewIcon,
      href: SITE.workUrl,
      external: true,
    },
  ];
</script>

<Section id="work">
  <div class="work-hero">
    <div class="hero-left">
      <div class="work-head">
        <span class="label eyebrow">Work</span>
        <h1 class="hero work-title">Projects</h1>
        <p class="bm work-sub">
          Web interfaces, Android apps and small tools built with care.
        </p>
      </div>

      <div class="chips-row">
        {#each PROJECT_CATEGORIES as category, i (category)}
          {@const IconComponent = CATEGORY_ICONS[category]}
          <button
            type="button"
            class="info-chip"
            onpointerenter={() => {
              hoveredChip = i;
              chipHoverCount += 1;
            }}
            onpointerleave={() => {
              hoveredChip = null;
            }}
            onclick={() => jumpToCategory(category)}
          >
            <Badge shape={getChipShape(i)} tone="primary" spring="fast">
              <IconComponent />
            </Badge>
            <div class="chip-meta">
              <span class="label chip-label">{category}</span>
              <span class="tm flex600">{countFor(category)} projects</span>
            </div>
          </button>
        {/each}
      </div>
    </div>

    <div
      class="hero-visual"
      role="presentation"
      onpointerenter={() => (heroShapeIdx = (heroShapeIdx + 1) % HERO_SHAPE_CYCLE.length)}
      onclick={() => (heroShapeIdx = (heroShapeIdx + 1) % HERO_SHAPE_CYCLE.length)}
    >
      <Shape
        shape={HERO_SHAPE_CYCLE[heroShapeIdx]}
        spring="default"
        class="visual-shape"
      >
        <span class="visual-icon" aria-hidden="true">
          <GridViewIcon />
        </span>
      </Shape>
    </div>

    <div class="hero-scroll">
      <Scroll href="#projects-list" label="Browse projects" />
    </div>
  </div>

  <div id="projects-list" class="projects-body">
    <div class="projects-toolbar">
      <h2 class="tl flex600">Projects</h2>
      <Split
        label="More on GitHub"
        variant="tonal"
        href={SITE.githubUrl}
        external
        menuLabel="More project links"
        items={projectActionItems}
      >
        {#snippet leadingIcon()}
          <Github />
        {/snippet}
      </Split>
    </div>

    <div class="masonry">
      {#each filteredProjects as project, i (project.name)}
        <div class="masonry-item">
          <Project {project} index={i} />
        </div>
      {/each}
    </div>
  </div>
</Section>

<style>
  :global(#work.page-section) {
    padding-top: 48px !important;
  }

  .work-hero {
    position: relative;
    min-height: calc(100svh - 88px);
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    align-items: center;
    align-content: center;
    gap: 48px;
    padding: 20px 0 80px;
  }

  .hero-left {
    display: flex;
    flex-direction: column;
    gap: 24px;
    min-width: 0;
  }

  .work-head {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .eyebrow {
    color: var(--p);
  }

  .work-title {
    font-size: clamp(40px, 6.5vw, 72px);
    line-height: 0.96;
    letter-spacing: -0.02em;
  }

  .work-sub {
    font-size: clamp(16px, 1.8vw, 19px);
    color: var(--onv);
    max-width: 42ch;
  }

  .chips-row {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }

  .info-chip {
    border: 0;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 14px;
    width: fit-content;
    max-width: 100%;
    padding: 8px 20px 8px 8px;
    border-radius: 9999px;
    background: var(--sf);
    color: var(--on);
    text-align: left;
    transition: background-color var(--dur-med2) var(--ease-emphasized);
  }

  .info-chip:hover {
    background: var(--sf2);
  }

  .chip-meta {
    display: flex;
    flex-direction: column;
    gap: 1px;
    min-width: 0;
  }

  .chip-label {
    color: var(--p);
  }

  .hero-visual {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }

  .hero-visual :global(.visual-shape) {
    width: 280px;
    height: 280px;
    --shape-fill: var(--sc);
    color: var(--onsc);
  }

  .hero-scroll {
    position: absolute;
    left: 50%;
    bottom: 20px;
    transform: translateX(-50%);
  }

  .visual-icon {
    display: grid;
    place-items: center;
  }

  .visual-icon :global(.ms-icon) {
    font-size: 96px;
  }

  .projects-body {
    padding-top: 32px;
  }

  .projects-toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 24px;
  }

  .masonry {
    columns: 3 260px;
    column-gap: 16px;
  }

  .masonry-item {
    break-inside: avoid;
    margin-bottom: 16px;
  }

  @media (max-width: 860px) {
    .work-hero {
      grid-template-columns: 1fr;
      gap: 24px;
      align-content: center;
      padding: 16px 0 24px;
    }

    .hero-visual {
      order: -1;
      justify-content: center;
      min-height: 220px;
      padding: 28px 20px;
      background: var(--sf);
      border-radius: var(--r-card);
    }

    .hero-visual :global(.visual-shape) {
      width: 164px;
      height: 164px;
    }

    .visual-icon :global(.ms-icon) {
      font-size: 64px;
    }
  }

  @media (max-width: 640px) {
    :global(#work.page-section) {
      padding-top: 20px !important;
    }

    .work-hero {
      min-height: calc(100svh - 56px);
      align-content: center;
      gap: 20px;
      padding: 16px 0 68px;
    }

    .hero-left {
      gap: 14px;
    }

    .chips-row {
      gap: 8px;
    }

    .info-chip {
      padding: 5px 12px 5px 5px;
      gap: 8px;
    }

    .info-chip :global(.badge.morph-shape) {
      width: 38px;
      height: 38px;
    }

    .info-chip :global(.badge.morph-shape .ms-icon) {
      font-size: 19px;
    }
  }
</style>
