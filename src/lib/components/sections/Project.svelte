<script lang="ts">
  import { Badge, Card, Item } from "$lib/components/ui";
  import type { Project } from "$lib/data/projects";
  import ArrowOutwardIcon from "~icons/material-symbols/arrow-outward-rounded";
  import {
    BADGE_HOVER_SHAPES,
    BADGE_REST_SHAPES,
    type ShapeName,
  } from "$lib/shapes";

  interface Props {
    project: Project;
    index: number;
    variant?: "card" | "list";
  }

  let { project, index, variant = "card" }: Props = $props();

  const restShape = $derived(
    BADGE_REST_SHAPES[index % BADGE_REST_SHAPES.length],
  );
  const tone = $derived<"primary" | "secondary" | "tertiary">(
    index % 3 === 1 ? "secondary" : index % 3 === 2 ? "tertiary" : "primary",
  );
  const stageTone = $derived(
    index % 3 === 1
      ? "stage-secondary"
      : index % 3 === 2
        ? "stage-tertiary"
        : "stage-primary",
  );
  const initial = $derived(project.name.replace("@iambhvsh/", "")[0]);

  let hoverCount = $state(0);
  let activeShape = $state<ShapeName | null>(null);

  const displayedShape = $derived(activeShape ?? restShape);

  function handlePointerEnter() {
    const nextIdx = (index + hoverCount) % BADGE_HOVER_SHAPES.length;
    hoverCount += 1;
    activeShape = BADGE_HOVER_SHAPES[nextIdx];
  }

  function handlePointerLeave() {
    activeShape = restShape;
  }
</script>

{#if variant === "list"}
  <Item
    href={project.url}
    external
    overline={project.tag}
    headline={project.name}
    supporting={project.description}
    meta={project.stack}
    onpointerenter={handlePointerEnter}
    onpointerleave={handlePointerLeave}
  >
    {#snippet leading()}
      <Badge shape={displayedShape} {tone} spring="fast">
        {initial}
      </Badge>
    {/snippet}
    {#snippet trailing()}
      <ArrowOutwardIcon />
    {/snippet}
  </Item>
{:else}
  <Card
    compact
    href={project.url}
    external
    class="setup-card"
  >
    <div class="project-stage {stageTone}">
      <span class="project-mark hero" aria-hidden="true">{initial}</span>
    </div>

    <div class="project-meta">
      <div class="project-top">
        <span class="label project-cat">{project.tag}</span>
        <ArrowOutwardIcon class="ext-icon" aria-hidden="true" />
      </div>
      <h3 class="tl flex600">{project.name}</h3>
      <p class="bm project-desc">{project.description}</p>
      <span class="label project-stack">{project.stack}</span>
    </div>
  </Card>
{/if}

<style>
  :global(.card.setup-card) {
    padding: 12px;
    gap: 14px;
  }

  .project-stage {
    width: 100%;
    height: 124px;
    border-radius: var(--r-lg);
    display: grid;
    place-items: center;
    overflow: hidden;
  }

  .project-stage.stage-primary {
    background: var(--pc);
    color: var(--onpc);
  }

  .project-stage.stage-secondary {
    background: var(--sc);
    color: var(--onsc);
  }

  .project-stage.stage-tertiary {
    background: var(--tc);
    color: var(--ontc);
  }

  .project-mark {
    font-size: 40px;
    line-height: 1;
    text-transform: uppercase;
  }

  .project-meta {
    display: flex;
    flex-direction: column;
    gap: 6px;
    padding: 0 8px 8px;
  }

  .project-top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .project-cat {
    display: inline-flex;
    align-items: center;
    padding: 3px 10px;
    border-radius: 9999px;
    background: var(--sf2);
    color: var(--onv);
  }

  :global(.card.setup-card .ext-icon) {
    color: var(--onv);
    font-size: 18px;
    flex: none;
    transition: color var(--dur-short4) var(--ease-emphasized);
  }

  :global(.card.setup-card:hover .ext-icon) {
    color: var(--p);
  }

  .project-desc {
    color: var(--onv);
  }

  .project-stack {
    color: var(--p);
    margin-top: 2px;
  }

  @media (max-width: 640px) {
    .project-stage {
      height: 96px;
    }
  }
</style>
