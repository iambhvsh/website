export type ProjectCategory = 'All' | 'Web' | 'Android';

export interface Project {
  name: string;
  tag: string;
  category: Exclude<ProjectCategory, 'All'>;
  description: string;
  stack: string;
  url: string;
}

export const PROJECT_CATEGORIES: readonly ProjectCategory[] = ['All', 'Web', 'Android'];

export const PROJECTS: readonly Project[] = [
  {
    name: 'Tide',
    tag: 'Web',
    category: 'Web',
    description: 'A calm, text-first social network built mobile-first, with Svelte.',
    stack: 'Svelte',
    url: 'https://tide.iambhvsh.in/',
  },
  {
    name: 'Writing',
    tag: 'Web',
    category: 'Web',
    description:
      'My writing on design, code and craft. Built with SvelteKit, with search, RSS and generated social images.',
    stack: 'SvelteKit',
    url: 'https://writings.iambhvsh.in/',
  },
  {
    name: 'Atlas',
    tag: 'Web',
    category: 'Web',
    description: 'A stateless, privacy-focused search engine API written in Python.',
    stack: 'Python',
    url: 'https://github.com/iambhvsh/atlas',
  },
  {
    name: 'Walleee',
    tag: 'Web',
    category: 'Web',
    description:
      'A curated wallpaper app featuring work from artists and designers around the world.',
    stack: 'Wallpapers',
    url: 'https://github.com/iambhvsh/walleee',
  },
  {
    name: 'Shelf',
    tag: 'Android',
    category: 'Android',
    description:
      'A fast, offline-first bookmark manager with link previews, collections, tags, reminders and biometric lock.',
    stack: 'Android',
    url: 'https://github.com/iambhvsh/shelf',
  },
  {
    name: 'Theia',
    tag: 'Android',
    category: 'Android',
    description:
      'A voice assistant that registers as the Android default assistant, with on-device speech transcription and spoken replies.',
    stack: 'Android',
    url: 'https://github.com/iambhvsh/theia',
  },
  {
    name: 'Outflow',
    tag: 'Android',
    category: 'Android',
    description:
      'A minimalist personal finance tracker in Material 3 Expressive. Fully offline, with a spending dashboard and no analytics.',
    stack: 'Material 3 Expressive',
    url: 'https://github.com/iambhvsh/outflow',
  },
];
