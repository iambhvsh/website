import type { Component } from 'svelte';
import CropSquareIcon from '~icons/material-symbols/crop-square-outline-rounded';
import DarkModeIcon from '~icons/material-symbols/dark-mode-outline-rounded';
import FlightIcon from '~icons/material-symbols/flight-rounded';
import MovieIcon from '~icons/material-symbols/movie-outline-rounded';
import MusicNoteIcon from '~icons/material-symbols/music-note-rounded';
import SkullIcon from '~icons/material-symbols/skull-outline';

export interface InterestItem {
  label: string;
  icon: Component;
}

export const INTERESTS: readonly InterestItem[] = [
  { label: 'Aviation', icon: FlightIcon },
  { label: 'Horror', icon: SkullIcon },
  { label: 'Ambient & melancholic music', icon: MusicNoteIcon },
  { label: 'Visual cinema', icon: MovieIcon },
  { label: 'Minimal design', icon: CropSquareIcon },
  { label: 'Late nights', icon: DarkModeIcon },
];
