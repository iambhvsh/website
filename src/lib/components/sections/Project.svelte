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
    href={project.url}
    external
    onpointerenter={handlePointerEnter}
    onpointerleave={handlePointerLeave}
  >
    <Badge shape={displayedShape} {tone} spring="fast">
      {initial}
    </Badge>

    <div>
      <div class="label tag">{project.tag}</div>
      <h3 class="tl flex600">{project.name}</h3>
    </div>

    <p class="bm desc">{project.description}</p>
    <div class="bs stack">{project.stack}</div>

    <span class="go" aria-hidden="true">
      <ArrowOutwardIcon />
    </span>
  </Card>
{/if}

<style>
  .tag {
    color: var(--p);
  }

  .desc {
    color: var(--onv);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    overflow: hidden;
  }

  .stack {
    color: var(--onv);
    opacity: 0.8;
    margin-top: auto;
  }

  .go {
    align-self: flex-end;
    display: inline-flex;
    transition: transform 0.4s var(--spring);
  }
</style>
