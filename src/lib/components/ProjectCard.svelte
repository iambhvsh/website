<script lang="ts">
  import type { Project } from '$lib/data/projects';
  export let project: Project;
</script>

<a href={project.url} target="_blank" rel="noopener noreferrer" class="project-card" data-magnet-card>
  <div class="project-info">
    <div>
      <div class="project-title">{project.title}</div>
      <div class="project-desc">{project.description}</div>
    </div>
  </div>
  <div class="project-tags">
    {#each project.tags as tag}
      <div class="tag">{tag}</div>
    {/each}
  </div>
</a>

<style>
  /* Individual project card */
  .project-card {
    display: flex;
    flex-direction: column;
    gap: 20px;
    cursor: pointer;
    text-decoration: none;
    color: inherit;
  }

  /* Keep even cards aligned (no staggering) */
  .project-card:nth-child(even) {
    margin-top: 0;
  }

  /* Project information container */
  .project-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  /* Project title */
  .project-title {
    font-family: 'Syne', sans-serif;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 5px;
  }

  /* Project description */
  .project-desc {
    font-size: 16px;
    color: var(--gray);
    max-width: 300px;
    line-height: 1.4;
  }

  /* Technology tags container */
  .project-tags {
    display: flex;
    gap: 10px;
    margin-top: 15px;
  }

  /* Individual technology tag */
  .tag {
    font-size: 11px;
    text-transform: uppercase;
    padding: 5px 12px;
    border: 1px solid var(--border);
    border-radius: 20px; /* Pill-shaped */
    color: var(--light-gray);
  }

  @media (max-width: 768px) {
    .project-card {
        padding-left: 5vw;
        padding-right: 5vw;
    }

    .project-desc {
        max-width: 100%;
    }
  }
</style>
