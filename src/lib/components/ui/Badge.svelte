<script lang="ts">
  import type { Snippet } from 'svelte';
  import Shape from './Shape.svelte';
  import type { ShapeName, SpringPreset } from '$lib/shapes';

  interface Props {
    shape: ShapeName;
    tone?: 'primary' | 'secondary' | 'tertiary';
    spring?: SpringPreset;
    children?: Snippet;
  }

  let {
    shape,
    tone = 'primary',
    spring = 'fast',
    children,
  }: Props = $props();
</script>

<Shape {shape} {spring} ariaHidden class="badge flex600 {tone}">
  {@render children?.()}
</Shape>
