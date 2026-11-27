type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

const THEME_COLORS: Record<Theme, string> = {
  light: '#fdf7ff',
  dark: '#141218',
};

function readStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
  } catch {
    return null;
  }
}

function writeStoredTheme(theme: Theme) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Ignore storage failures (e.g. private browsing or disabled storage)
  }
}

function syncThemeMeta(theme: Theme) {
  if (typeof document === 'undefined') return;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute('content', THEME_COLORS[theme]);
  }
}

function detectInitialTheme(): Theme {
  if (typeof document === 'undefined') return 'light';
  const attr = document.documentElement.dataset.theme;
  if (attr === 'light' || attr === 'dark') return attr;
  const stored = readStoredTheme();
  if (stored) {
    document.documentElement.dataset.theme = stored;
    return stored;
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function createThemeStore() {
  const initial = detectInitialTheme();
  let current = $state<Theme>(initial);
  syncThemeMeta(initial);

  function set(theme: Theme) {
    current = theme;
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = theme;
      syncThemeMeta(theme);
    }
    writeStoredTheme(theme);
  }

  function toggle() {
    const isDark =
      typeof document !== 'undefined' && document.documentElement.dataset.theme
        ? document.documentElement.dataset.theme === 'dark'
        : typeof window !== 'undefined' &&
          window.matchMedia('(prefers-color-scheme: dark)').matches;
    set(isDark ? 'light' : 'dark');
  }

  return {
    get current() {
      return current;
    },
    set,
    toggle,
  };
}

export const themeStore = createThemeStore();
