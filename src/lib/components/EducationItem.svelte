<script lang="ts">
  import type { Education } from '$lib/data/education';
  export let education: Education;
</script>

<div class="education-item" data-magnet>
  <div class="education-year">{education.year}</div>
  <div class="education-degree">{education.degree}<br>
    <span style="font-size: 16px; color: var(--gray);">{education.description}</span>
  </div>
  <div class="education-institution">{education.institution}</div>
</div>

<style>
  /* Individual education entry */
  .education-item {
    padding: 40px 20px;
    margin: 0 -20px; /* Negative margin for full-width hover */
    border-bottom: 1px solid var(--border);
    display: grid;
    grid-template-columns: 0.5fr 1.5fr 1fr; /* Year, Degree, Institution */
    align-items: center;
    transition: all 0.4s var(--ease);
  }

  /* Hover effect - subtle background */
  .education-item:hover {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 20px;
  }

  /* Education year range */
  .education-year {
    font-family: 'Syne', sans-serif;
    color: var(--gray);
  }

  /* Degree name and description */
  .education-degree {
    font-size: 24px;
    font-weight: 500;
  }

  /* Institution name */
  .education-institution {
    font-size: 16px;
    color: var(--light-gray);
    text-align: right;
  }

  @media (max-width: 768px) {
    .education-item {
      grid-template-columns: 1fr;
      gap: 10px;
      text-align: left;
    }

    .education-institution {
      text-align: left;
    }
  }
</style>
