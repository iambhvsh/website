import type { Component } from 'svelte';
import Github from '$lib/components/ui/Github.svelte';
import DescriptionIcon from '~icons/material-symbols/description-outline-rounded';
import EditNoteIcon from '~icons/material-symbols/edit-note-rounded';
import GridViewIcon from '~icons/material-symbols/grid-view-outline-rounded';
import LinkIcon from '~icons/material-symbols/link-rounded';
import MailIcon from '~icons/material-symbols/mail-outline-rounded';

export interface ExternalLinkItem {
  label: string;
  subtitle: string;
  href: string;
  icon: Component;
  external?: boolean;
}

export const EXTERNAL_LINKS: readonly ExternalLinkItem[] = [
  {
    label: 'Email',
    subtitle: 'iambhvsh@proton.me',
    href: 'mailto:iambhvsh@proton.me',
    icon: MailIcon,
  },
  {
    label: 'GitHub',
    subtitle: '@iambhvsh',
    href: 'https://github.com/iambhvsh',
    icon: Github,
    external: true,
  },
  {
    label: 'Links',
    subtitle: 'Everything in one place',
    href: 'https://links.iambhvsh.in',
    icon: LinkIcon,
  },
  {
    label: 'Résumé',
    subtitle: 'Background and experience',
    href: 'https://iambhvsh.in/resume',
    icon: DescriptionIcon,
  },
  {
    label: 'Work',
    subtitle: 'Selected projects',
    href: 'https://work.iambhvsh.in',
    icon: GridViewIcon,
  },
  {
    label: 'Writing',
    subtitle: 'Essays and notes',
    href: 'https://writing.iambhvsh.in',
    icon: EditNoteIcon,
  },
];
