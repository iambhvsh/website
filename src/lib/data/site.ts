export interface NavItem {
  label: string;
  href: string;
  sectionId: string;
}

export interface StatItem {
  value: string;
  label: string;
  tone: 'primary' | 'secondary' | 'tertiary';
  href?: string;
}

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export const SITE = {
  brand: 'Bhavesh',
  fullName: 'Bhavesh Patil',
  initials: 'BP',
  handle: 'iambhvsh',
  email: 'iambhvsh@proton.me',
  location: 'Maharashtra, India',
  githubUrl: 'https://github.com/iambhvsh',
  workUrl: 'https://work.iambhvsh.in',
  writingUrl: 'https://writing.iambhvsh.in',
  lastfmUrl: 'https://www.last.fm/user/iambhvsh',
  githubSponsorsUrl: 'https://github.com/sponsors/iambhvsh',
  buyMeACoffeeUrl: 'https://www.buymeacoffee.com/iambhvsh',
  copyright: '© Bhavesh Patil (iambhvsh)',
} as const;

export const NAV_ITEMS: readonly NavItem[] = [
  { label: 'About', href: '#about', sectionId: 'about' },
  { label: 'Work', href: '#work', sectionId: 'work' },
  { label: 'Writing', href: '#writing', sectionId: 'writing' },
  { label: 'Playing', href: '#now', sectionId: 'now' },
  { label: 'Links', href: '#links', sectionId: 'links' },
];

export const SCROLL_SPY_SECTIONS = [
  'top',
  'about',
  'stack',
  'work',
  'writing',
  'now',
  'devices',
  'interests',
  'sponsor',
  'links',
] as const;

export const SCROLL_SPY_ALIASES: Record<string, string> = {
  top: '',
  stack: 'about',
  devices: 'now',
  interests: 'now',
  sponsor: 'now',
};

export const ABOUT_STATS: readonly StatItem[] = [
  {
    value: '8',
    label: 'Projects in the archive',
    tone: 'primary',
  },
  {
    value: 'Late nights',
    label: 'When the focused work happens',
    tone: 'secondary',
  },
  {
    value: 'Learning Swift',
    label: '100 Days of SwiftUI, written in public',
    tone: 'tertiary',
    href: 'https://writing.iambhvsh.in',
  },
];

export const FOOTER_LINKS: readonly FooterLink[] = [
  { label: 'GitHub', href: 'https://github.com/iambhvsh', external: true },
  { label: 'Sponsor', href: '#sponsor' },
  { label: 'Email', href: 'mailto:iambhvsh@proton.me' },
  { label: 'Résumé', href: 'https://iambhvsh.in/resume' },
  { label: 'Writing', href: 'https://writing.iambhvsh.in', external: true },
];
