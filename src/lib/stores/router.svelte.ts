export type RouteId =
  | 'home'
  | 'about'
  | 'work'
  | 'writing'
  | 'music'
  | 'mac'
  | 'phone'
  | 'not-found';

export interface RouteMatch {
  id: RouteId;
  path: string;
  navId: string;
  title: string;
}

const ROUTES: Record<string, Omit<RouteMatch, 'path'>> = {
  '/': {
    id: 'home',
    navId: '',
    title: 'Bhavesh Patil',
  },
  '/about': {
    id: 'about',
    navId: 'about',
    title: 'About Bhavesh',
  },
  '/work': {
    id: 'work',
    navId: 'work',
    title: "Bhavesh's Projects",
  },
  '/writing': {
    id: 'writing',
    navId: 'writing',
    title: "Bhavesh's Writings",
  },
  '/music': {
    id: 'music',
    navId: 'music',
    title: "Bhavesh's Music",
  },
  '/playing': {
    id: 'music',
    navId: 'music',
    title: "Bhavesh's Music",
  },
  '/now': {
    id: 'music',
    navId: 'music',
    title: "Bhavesh's Music",
  },
  '/mac': {
    id: 'mac',
    navId: 'mac',
    title: "Bhavesh's Mac",
  },
  '/phone': {
    id: 'phone',
    navId: 'phone',
    title: "Bhavesh's Phone",
  },
};

const NOT_FOUND_ROUTE: Omit<RouteMatch, 'path'> = {
  id: 'not-found',
  navId: '',
  title: 'Page not found',
};

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  let trimmed = pathname;
  while (trimmed.length > 1 && trimmed.endsWith('/')) {
    trimmed = trimmed.slice(0, -1);
  }
  return trimmed || '/';
}

function resolveRoute(pathname: string): RouteMatch {
  const path = normalizePath(pathname);
  const matched = ROUTES[path] ?? NOT_FOUND_ROUTE;
  return { ...matched, path };
}

function scrollAfterNavigation(hash: string) {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (hash) {
    const targetId = hash.slice(1);
    window.requestAnimationFrame(() => {
      const target = document.getElementById(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
    return;
  }

  window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
}

class RouterStore {
  current = $state<RouteMatch>(
    typeof window !== 'undefined'
      ? resolveRoute(window.location.pathname)
      : { ...ROUTES['/'], path: '/' }
  );

  navigate(to: string, options: { replace?: boolean } = {}) {
    if (typeof window === 'undefined') return;

    const url = new URL(to, window.location.origin);
    const nextPath = normalizePath(url.pathname);
    const nextFull = `${nextPath}${url.search}${url.hash}`;
    const currentFull = `${normalizePath(window.location.pathname)}${window.location.search}${window.location.hash}`;

    if (nextFull !== currentFull) {
      if (options.replace) {
        window.history.replaceState({}, '', nextFull);
      } else {
        window.history.pushState({}, '', nextFull);
      }
    }

    this.current = resolveRoute(nextPath);
    scrollAfterNavigation(url.hash);
  }

  listen(): () => void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return () => {};
    }

    const onPopState = () => {
      this.current = resolveRoute(window.location.pathname);
      scrollAfterNavigation(window.location.hash);
    };

    const onDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest('a[href]');
      if (!(anchor instanceof HTMLAnchorElement)) return;
      if (anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      const url = new URL(anchor.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      if (url.pathname === '/resume' || url.pathname.startsWith('/assets/')) return;

      event.preventDefault();
      this.navigate(`${url.pathname}${url.search}${url.hash}`);
    };

    window.addEventListener('popstate', onPopState);
    document.addEventListener('click', onDocumentClick);

    return () => {
      window.removeEventListener('popstate', onPopState);
      document.removeEventListener('click', onDocumentClick);
    };
  }
}

export const router = new RouterStore();
