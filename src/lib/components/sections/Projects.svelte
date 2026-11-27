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
  import ViewListIcon from "~icons/material-symbols/view-list-outline-rounded";
  import Project from "./Project.svelte";

  type ViewMode = "grid" | "list";

  const CATEGORY_ICONS: Record<ProjectCategory, Component> = {
    All: AppsIcon,
    Web: LanguageIcon,
    Android: AndroidIcon,
  };

  let activeCategory = $state<ProjectCategory>("All");
  let viewMode = $state<ViewMode>("grid");
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
    <div class="toolbar">
      <div class="filter-group" role="tablist" aria-label="Filter projects by category">
        {#each PROJECT_CATEGORIES as category (category)}
          {@const IconComponent = CATEGORY_ICONS[category]}
          {@const isActive = activeCategory === category}
          <button
            type="button"
            role="tab"
            aria-selected={isActive}
            class="filter-pill label"
            class:active={isActive}
            onclick={() => (activeCategory = category)}
          >
            <IconComponent aria-hidden="true" />
            <span>{category}</span>
            <span class="count">{countFor(category)}</span>
          </button>
        {/each}
      </div>

      <div class="toolbar-right">
        <div class="view-group" role="group" aria-label="Switch project layout">
          <button
            type="button"
            class="view-btn label"
            class:active={viewMode === "grid"}
            aria-pressed={viewMode === "grid"}
            aria-label="Grid cards"
            onclick={() => (viewMode = "grid")}
          >
            <GridViewIcon aria-hidden="true" />
            <span>Grid</span>
          </button>
          <button
            type="button"
            class="view-btn label"
            class:active={viewMode === "list"}
            aria-pressed={viewMode === "list"}
            aria-label="Expressive list"
            onclick={() => (viewMode = "list")}
          >
            <ViewListIcon aria-hidden="true" />
            <span>List</span>
          </button>
        </div>

        <Split
          label="More on GitHub"
          href={SITE.githubUrl}
          external
          size="sm"
          align="end"
          menuLabel="More project links"
          items={projectActionItems}
        >
          {#snippet leadingIcon()}
            <Github />
          {/snippet}
        </Split>
      </div>
    </div>

    {#if viewMode === "grid"}
      <div class="masonry">
        {#each filteredProjects as project, i (project.name)}
          <div class="masonry-item">
            <Project {project} index={i} />
          </div>
        {/each}
      </div>
    {:else}
      <div class="proj-list">
        {#each filteredProjects as project, i (project.name)}
          <Project {project} index={i} variant="list" />
        {/each}
      </div>
    {/if}
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

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 24px;
  }

  .filter-group {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .filter-pill {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 14px 0 12px;
    border: 0;
    border-radius: 9999px;
    cursor: pointer;
    background: var(--sf);
    color: var(--onv);
    transition:
      border-radius var(--dur-spring-fast) var(--spring-fast),
      background-color var(--dur-short4) var(--ease-emphasized),
      color var(--dur-short4) var(--ease-emphasized);
  }

  .filter-pill:hover {
    background: var(--sf2);
    color: var(--on);
    border-radius: var(--r-lg);
  }

  .filter-pill.active {
    background: var(--pc);
    color: var(--onpc);
    border-radius: var(--r-lg);
  }

  .filter-pill:active {
    border-radius: var(--r-md);
  }

  .filter-pill :global(.ms-icon) {
    font-size: 18px;
  }

  .count {
    padding: 2px 7px;
    border-radius: 9999px;
    background: color-mix(in srgb, currentColor 12%, transparent);
    font-size: 11px;
  }

  .view-group {
    display: inline-flex;
    padding: 4px;
    gap: 4px;
    border-radius: 9999px;
    background: var(--sf);
  }

  .view-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 34px;
    padding: 0 12px;
    border: 0;
    border-radius: 9999px;
    cursor: pointer;
    background: transparent;
    color: var(--onv);
    transition:
      border-radius var(--dur-spring-fast) var(--spring-fast),
      background-color var(--dur-short4) var(--ease-emphasized),
      color var(--dur-short4) var(--ease-emphasized);
  }

  .view-btn:hover {
    color: var(--on);
  }

  .view-btn.active {
    background: var(--sc);
    color: var(--onsc);
  }

  .view-btn :global(.ms-icon) {
    font-size: 18px;
  }

  .toolbar-right {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
  }

  .masonry {
    columns: 3 260px;
    column-gap: 16px;
  }

  .masonry-item {
    break-inside: avoid;
    margin-bottom: 16px;
  }

  .proj-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
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
      padding-top: 28px !important;
    }

    .work-hero {
      min-height: calc(100svh - 64px);
      gap: 20px;
      padding: 8px 0 72px;
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
