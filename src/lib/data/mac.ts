import type { Component } from 'svelte';
import ArchiveIcon from '~icons/material-symbols/folder-zip-outline-rounded';
import CleaningIcon from '~icons/material-symbols/cleaning-services-outline-rounded';
import CodeIcon from '~icons/material-symbols/code-rounded';
import HardDriveIcon from '~icons/material-symbols/hard-drive-outline-rounded';
import LaptopMacIcon from '~icons/material-symbols/laptop-mac-outline-rounded';
import MemoryIcon from '~icons/material-symbols/memory-rounded';
import MouseIcon from '~icons/material-symbols/mouse-outline-rounded';
import MusicNoteIcon from '~icons/material-symbols/music-note-rounded';
import PlayCircleIcon from '~icons/material-symbols/play-circle-outline-rounded';
import SendIcon from '~icons/material-symbols/send-outline-rounded';
import SettingsIcon from '~icons/material-symbols/settings-outline-rounded';
import WebIcon from '~icons/material-symbols/web-asset-rounded';

export interface SpecItem {
  label: string;
  value: string;
  icon: Component;
}

export interface SetupApp {
  name: string;
  category: string;
  description: string;
  icon: Component;
  image?: string;
  imageKind?: 'banner' | 'icon';
  stageColor?: string;
  url?: string;
}

export const MAC_SPECS: readonly SpecItem[] = [
  { label: 'Model', value: 'MacBook Air M5', icon: LaptopMacIcon },
  { label: 'Memory', value: '16GB Unified', icon: MemoryIcon },
  { label: 'Storage', value: '512GB SSD', icon: HardDriveIcon },
  { label: 'OS', value: 'macOS Golden Gate 27.2.1', icon: SettingsIcon },
];

export const MAC_APPS: readonly SetupApp[] = [
  {
    name: 'Xcode',
    category: 'Development',
    description: 'Building and learning Swift & SwiftUI apps.',
    icon: CodeIcon,
    image: '/assets/thumbs/xcode.jpg',
    imageKind: 'banner',
    url: 'https://developer.apple.com/xcode/',
  },
  {
    name: 'Antigravity IDE',
    category: 'Editor',
    description: 'Primary IDE for web, TypeScript, Svelte and agentic workflows.',
    icon: CodeIcon,
    image: '/assets/thumbs/antigravity.png',
    imageKind: 'banner',
    url: 'https://antigravity.google',
  },
  {
    name: 'Safari',
    category: 'Browser',
    description: 'Default daily browser: fast, quiet and easy on battery.',
    icon: WebIcon,
    image: '/assets/thumbs/safari.png',
    imageKind: 'icon',
    stageColor: '#0388fe',
    url: 'https://www.apple.com/safari/',
  },
  {
    name: 'Helium',
    category: 'Browser',
    description: 'Minimal, privacy-focused browser for clean, distraction-free browsing.',
    icon: WebIcon,
    image: '/assets/thumbs/helium.png',
    imageKind: 'banner',
    url: 'https://helium.computer',
  },
  {
    name: 'Purge',
    category: 'Utilities',
    description: 'Open-source cache and Xcode derived-data cleaner.',
    icon: CleaningIcon,
    image: '/assets/thumbs/purge.png',
    imageKind: 'banner',
    url: 'https://purgemac.com',
  },
  {
    name: 'Koda',
    category: 'Music',
    description: 'Native SwiftUI Liquid Glass client for YouTube Music.',
    icon: MusicNoteIcon,
    image: '/assets/thumbs/koda.png',
    imageKind: 'banner',
    url: 'https://github.com/Ivorisnoob/iKoda',
  },
  {
    name: 'IINA',
    category: 'Media',
    description: 'Modern, native macOS media player built on mpv.',
    icon: PlayCircleIcon,
    image: '/assets/thumbs/icon.png',
    imageKind: 'icon',
    stageColor: '#25272b',
    url: 'https://iina.io',
  },
  {
    name: 'Blip',
    category: 'Transfer',
    description: 'Instant cross-device file transfers between Mac and Android.',
    icon: SendIcon,
    image: '/assets/thumbs/blip.jpg',
    imageKind: 'banner',
    url: 'https://blip.net',
  },
  {
    name: 'The Unarchiver',
    category: 'Utilities',
    description: 'Handles every archive format cleanly without getting in the way.',
    icon: ArchiveIcon,
    image: '/assets/thumbs/the-unarchiver.jpeg',
    imageKind: 'banner',
    url: 'https://theunarchiver.com',
  },
  {
    name: 'Mos',
    category: 'Mouse',
    description: 'Smooth scrolling and separate scroll direction for external mice.',
    icon: MouseIcon,
    image: '/assets/thumbs/mos.png',
    imageKind: 'icon',
    stageColor: '#161927',
    url: 'https://mos.caldis.me',
  },
];
