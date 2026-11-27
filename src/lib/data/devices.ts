import type { Component } from 'svelte';
import EarbudsIcon from '~icons/material-symbols/earbuds-outline-rounded';
import LaptopMacIcon from '~icons/material-symbols/laptop-mac-outline-rounded';
import SmartphoneIcon from '~icons/material-symbols/smartphone-outline';

export interface DeviceItem {
  name: string;
  description: string;
  icon: Component;
  href?: string;
}

export const DEVICES: readonly DeviceItem[] = [
  {
    name: 'MacBook Air M5',
    description:
      'My main machine for writing code, building interfaces and running everything day to day.',
    icon: LaptopMacIcon,
    href: '/mac',
  },
  {
    name: 'Motorola Edge 50 Fusion',
    description:
      'My daily phone, and the Android device I carry while building and using my own apps.',
    icon: SmartphoneIcon,
    href: '/phone',
  },
  {
    name: 'CMF Buds 2 Plus',
    description: 'My earbuds for music, calls and focus while I work.',
    icon: EarbudsIcon,
  },
];
