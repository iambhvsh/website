import AccountBalanceWalletIcon from '~icons/material-symbols/account-balance-wallet-outline-rounded';
import AndroidIcon from '~icons/material-symbols/android';
import BookmarksIcon from '~icons/material-symbols/bookmarks-outline-rounded';
import BuildIcon from '~icons/material-symbols/build-outline-rounded';
import CodeIcon from '~icons/material-symbols/code-rounded';
import HardDriveIcon from '~icons/material-symbols/hard-drive-outline-rounded';
import LockIcon from '~icons/material-symbols/lock-outline';
import MemoryIcon from '~icons/material-symbols/memory-rounded';
import MusicNoteIcon from '~icons/material-symbols/music-note-rounded';
import PlayCircleIcon from '~icons/material-symbols/play-circle-outline-rounded';
import SendIcon from '~icons/material-symbols/send-outline-rounded';
import SmartphoneIcon from '~icons/material-symbols/smartphone-outline';
import StorefrontIcon from '~icons/material-symbols/storefront-outline-rounded';
import type { SpecItem, SetupApp } from './mac';

export const PHONE_SPECS: readonly SpecItem[] = [
  { label: 'Device', value: 'Motorola Edge 50 Fusion', icon: SmartphoneIcon },
  { label: 'Chip', value: 'Snapdragon 7s Gen 2', icon: MemoryIcon },
  { label: 'Memory', value: '12GB RAM', icon: MemoryIcon },
  { label: 'Storage', value: '256GB', icon: HardDriveIcon },
  { label: 'OS', value: 'Android 16 · PixelOS', icon: AndroidIcon },
];

export const PHONE_APPS: readonly SetupApp[] = [
  {
    name: 'Shelf',
    category: 'Bookmarks',
    description:
      'Privacy-first, offline-first Android bookmark manager I built with link previews, collections, tags, reminders and biometric lock.',
    icon: BookmarksIcon,
    image: '/assets/thumbs/shelf.png',
    imageKind: 'banner',
    url: 'https://shelf.iambhvsh.in',
  },
  {
    name: 'Outflow',
    category: 'Finance',
    description:
      'Privacy-first, fully offline expense tracker in Material 3 Expressive with a spending dashboard and zero analytics.',
    icon: AccountBalanceWalletIcon,
    image: '/assets/thumbs/outflow.png',
    imageKind: 'icon',
    stageColor: '#04a6ba',
    url: 'https://github.com/iambhvsh/outflow',
  },
  {
    name: 'Koda',
    category: 'Music',
    description: 'Clean, focused music client for everyday listening.',
    icon: MusicNoteIcon,
    image: '/assets/thumbs/koda.png',
    imageKind: 'banner',
    url: 'https://github.com/Ivorisnoob/Koda',
  },
  {
    name: 'Blip',
    category: 'Transfer',
    description: 'Instant cross-device file transfers between Android and Mac.',
    icon: SendIcon,
    image: '/assets/thumbs/blip.jpg',
    imageKind: 'banner',
    url: 'https://blip.net',
  },
  {
    name: 'YouTube (Morphe)',
    category: 'Video',
    description: 'YouTube patched via Morphe for ad-free playback, SponsorBlock and background play.',
    icon: PlayCircleIcon,
    image: '/assets/thumbs/youtube.png',
    imageKind: 'icon',
    stageColor: '#fe0838',
    url: 'https://morphe.software',
  },
  {
    name: 'Morphe Manager',
    category: 'Patcher',
    description: 'Open-source Android app patcher by the Morphe Team.',
    icon: BuildIcon,
    image: '/assets/thumbs/morphe-manager.png',
    imageKind: 'icon',
    stageColor: '#1e5ba9',
    url: 'https://github.com/MorpheApp/morphe-manager',
  },
  {
    name: 'Orion Store',
    category: 'Apps',
    description: 'Clean, open-source Android app store for discovering and updating apps.',
    icon: StorefrontIcon,
    image: '/assets/thumbs/orion-store.png',
    imageKind: 'icon',
    stageColor: '#666ae2',
    url: 'https://orionstore.pages.dev',
  },
  {
    name: 'Proton Pass',
    category: 'Security',
    description: 'End-to-end encrypted password, alias and passkey manager.',
    icon: LockIcon,
    image: '/assets/thumbs/proton-pass.png',
    imageKind: 'banner',
    url: 'https://proton.me/pass',
  },
  {
    name: 'Spck Code Editor',
    category: 'Development',
    description: 'Lightweight code editor and Git client for quick edits right on Android.',
    icon: CodeIcon,
    image: '/assets/thumbs/spck-editor.png',
    imageKind: 'icon',
    stageColor: '#161c25',
    url: 'https://spck.io',
  },
];
