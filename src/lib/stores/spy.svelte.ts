export interface ScrollSpyOptions {
  sectionIds: readonly string[];
  aliases?: Record<string, string>;
  triggerRatio?: number;
}

export function createScrollSpy(options: ScrollSpyOptions) {
  const {
    sectionIds,
    aliases = {},
    triggerRatio = 0.25,
  } = options;

  let activeId = $state<string>('');
  let isScrolled = $state(false);

  function resolveId(id: string): string {
    return Object.hasOwn(aliases, id) ? aliases[id] : id;
  }

  function updateScrolledState(y: number) {
    if (!isScrolled && y > 440) {
      isScrolled = true;
    } else if (isScrolled && y < 320) {
      isScrolled = false;
    }
  }

  function findLastPresentSection(): string {
    for (let i = sectionIds.length - 1; i >= 0; i -= 1) {
      if (document.getElementById(sectionIds[i])) {
        return resolveId(sectionIds[i]);
      }
    }
    return '';
  }

  function findActiveSection(triggerY: number): string {
    let current = '';
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top <= triggerY) {
        current = resolveId(id);
      }
    }
    return current;
  }

  function update() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return;

    const y = window.scrollY;
    updateScrolledState(y);

    const atBottom =
      window.innerHeight + y >= document.documentElement.scrollHeight - 8;
    if (atBottom) {
      activeId = findLastPresentSection();
      return;
    }

    const triggerY = Math.max(
      120,
      Math.min(220, Math.round(window.innerHeight * triggerRatio))
    );
    activeId = findActiveSection(triggerY);
  }

  function observe(): () => void {
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return () => {};
    }

    let rafId = 0;
    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(() => {
        rafId = 0;
        update();
      });
    };

    update();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    const resizeObserver =
      typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleUpdate) : null;
    resizeObserver?.observe(document.body);

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      resizeObserver?.disconnect();
    };
  }

  return {
    get activeId() {
      return activeId;
    },
    get isScrolled() {
      return isScrolled;
    },
    observe,
  };
}
