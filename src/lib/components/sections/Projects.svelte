<script lang="ts">
  import type { Component } from "svelte";
  import { Section, Split } from "$lib/components/ui";
  import type { SplitMenuItem } from "$lib/components/ui/Split.svelte";
  import {
    PROJECT_CATEGORIES,
    PROJECTS,
    type ProjectCategory,
  } from "$lib/data/projects";
  import { SITE } from "$lib/data/site";
  import Github from "$lib/components/ui/Github.svelte";
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
  const ActiveCategoryIcon = $derived(CATEGORY_ICONS[activeCategory]);

  const filteredProjects = $derived(
    activeCategory === "All"
      ? PROJECTS
      : PROJECTS.filter((project) => project.category === activeCategory),
  );

  const categoryMenuItems: readonly SplitMenuItem[] = $derived(
    PROJECT_CATEGORIES.map((category) => ({
      label: `${category} (${
        category === "All"
          ? PROJECTS.length
          : PROJECTS.filter((p) => p.category === category).length
      })`,
      icon: CATEGORY_ICONS[category],
      selected: activeCategory === category,
      onclick: () => (activeCategory = category),
    })),
  );

  const viewMenuItems: readonly SplitMenuItem[] = $derived([
    {
      label: "Grid cards",
      icon: GridViewIcon,
      selected: viewMode === "grid",
      onclick: () => (viewMode = "grid"),
    },
    {
      label: "Expressive list",
      icon: ViewListIcon,
      selected: viewMode === "list",
      onclick: () => (viewMode = "list"),
    },
  ]);

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

<Section id="work" title="Projects">
  <div class="toolbar">
    <Split
      label="{activeCategory} ({filteredProjects.length})"
      variant="tonal"
      size="sm"
      menuLabel="Filter projects by category"
      items={categoryMenuItems}
      onclick={() => {
        const nextIdx =
          (PROJECT_CATEGORIES.indexOf(activeCategory) + 1) %
          PROJECT_CATEGORIES.length;
        activeCategory = PROJECT_CATEGORIES[nextIdx];
      }}
    >
      {#snippet leadingIcon()}
        <ActiveCategoryIcon />
      {/snippet}
    </Split>

    <Split
      label={viewMode === "grid" ? "Grid" : "List"}
      variant="tonal"
      size="sm"
      align="end"
      menuLabel="Switch project layout"
      items={viewMenuItems}
      onclick={() => (viewMode = viewMode === "grid" ? "list" : "grid")}
    >
      {#snippet leadingIcon()}
        {#if viewMode === "grid"}
          <GridViewIcon />
        {:else}
          <ViewListIcon />
        {/if}
      {/snippet}
    </Split>
  </div>

  {#if viewMode === "grid"}
    <div class="grid">
      {#each filteredProjects as project, i (project.name)}
        <Project {project} index={i} />
      {/each}
    </div>
  {:else}
    <div class="proj-list">
      {#each filteredProjects as project, i (project.name)}
        <Project {project} index={i} variant="list" />
      {/each}
    </div>
  {/if}

  <div class="more">
    <Split
      label="More on GitHub"
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
</Section>

<style>
  .toolbar {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 24px;
  }

  .grid {
    display: grid;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(290px, 1fr));
  }

  .proj-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
</style>
