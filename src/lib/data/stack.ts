export interface StackGroup {
  title: string;
  items: readonly string[];
}

export const STACK_GROUPS: readonly StackGroup[] = [
  {
    title: 'Web',
    items: [
      'Next.js',
      'React',
      'Svelte',
      'Tailwind CSS',
      'GSAP',
      'TypeScript',
      'JavaScript',
    ],
  },
  {
    title: 'Android',
    items: ['Kotlin', 'Jetpack Compose', 'Material 3 Expressive'],
  },
  {
    title: 'Backend',
    items: ['Python', 'Firebase'],
  },
];
