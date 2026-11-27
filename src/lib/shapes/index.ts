import {
  MaterialShapes,
  Morph,
  MutableCubic,
  Path,
  roundedPolygonToPath,
} from 'material-shapes-ts';

export type ShapeName = (typeof MaterialShapes.names)[number];
export type SpringPreset = 'fast' | 'default' | 'slow';

export const HERO_SHAPE_CYCLE: readonly ShapeName[] = [
  'Cookie9Sided',
  'SoftBurst',
  'Flower',
  'Clover4Leaf',
  'Sunny',
  'Heart',
  'Puffy',
  'Cookie12Sided',
  'Ghostish',
  'Pentagon',
  'Bun',
  'Gem',
];

export const LOADING_SHAPES: readonly ShapeName[] = [
  'SoftBurst',
  'Cookie9Sided',
  'Pentagon',
  'Pill',
  'VerySunny',
  'Cookie4Sided',
  'Oval',
];

export const BADGE_REST_SHAPES: readonly ShapeName[] = [
  'Cookie6Sided',
  'Clover4Leaf',
  'Flower',
  'Cookie9Sided',
  'SoftBurst',
];

export const BADGE_HOVER_SHAPES: readonly ShapeName[] = [
  'Sunny',
  'Heart',
  'Puffy',
  'Cookie12Sided',
  'Burst',
  'Gem',
];

export const ARTWORK_SHAPES: readonly ShapeName[] = [
  'Cookie9Sided',
  'SoftBurst',
  'Cookie12Sided',
  'Flower',
];

interface SpringConfig {
  stiffness: number;
  dampingRatio: number;
}

const SPRING_PRESETS: Record<SpringPreset, SpringConfig> = {
  fast: { stiffness: 800, dampingRatio: 0.6 },
  default: { stiffness: 380, dampingRatio: 0.8 },
  slow: { stiffness: 200, dampingRatio: 0.8 },
};

const morphCache = new Map<string, Morph>();
const staticPathCache = new Map<ShapeName, string>();
const sharedCubic = new MutableCubic();
const sharedPath = new Path();

function getMorph(from: ShapeName, to: ShapeName): Morph {
  const key = `${from}->${to}`;
  const cached = morphCache.get(key);
  if (cached) return cached;

  const created = new Morph(MaterialShapes.byName(from), MaterialShapes.byName(to));
  morphCache.set(key, created);
  return created;
}

function morphToSvgPath(morph: Morph, progress: number): string {
  sharedPath.rewind();
  let isFirst = true;

  morph.forEachCubic(progress, sharedCubic, (c) => {
    if (isFirst) {
      sharedPath.moveTo(c.anchor0X, c.anchor0Y);
      isFirst = false;
    }
    sharedPath.cubicTo(
      c.control0X,
      c.control0Y,
      c.control1X,
      c.control1Y,
      c.anchor1X,
      c.anchor1Y
    );
  });

  sharedPath.close();
  return sharedPath.toSvgPathData();
}

export function prewarmMorphCycle(shapes: readonly ShapeName[]): () => void {
  if (typeof window === 'undefined' || shapes.length < 2) return () => {};

  let cancelled = false;
  let index = 0;

  const schedule = (cb: () => void) => {
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(cb, { timeout: 1500 });
      return () => window.cancelIdleCallback(id);
    }
    const id = setTimeout(cb, 60);
    return () => clearTimeout(id);
  };

  let cancelPending = () => {};

  function step() {
    if (cancelled || index >= shapes.length) return;
    const from = shapes[index];
    const to = shapes[(index + 1) % shapes.length];
    getMorph(from, to);
    index += 1;
    if (index < shapes.length) {
      cancelPending = schedule(step);
    }
  }

  cancelPending = schedule(step);
  return () => {
    cancelled = true;
    cancelPending();
  };
}

export function getShapePath(name: ShapeName): string {
  const cached = staticPathCache.get(name);
  if (cached) return cached;

  const data = roundedPolygonToPath(MaterialShapes.byName(name)).toSvgPathData();
  staticPathCache.set(name, data);
  return data;
}

export interface InterruptibleMorphController {
  morphTo: (nextShape: ShapeName, preset?: SpringPreset) => void;
  setVisible: (visible: boolean) => void;
  destroy: () => void;
}

export function createInterruptibleMorph(
  initialShape: ShapeName,
  onFrame: (pathData: string) => void
): InterruptibleMorphController {
  let fromShape: ShapeName = initialShape;
  let toShape: ShapeName = initialShape;
  let activeMorph: Morph | null = null;
  let pos = 1;
  let vel = 0;
  let target = 1;
  let spring: SpringConfig = SPRING_PRESETS.default;
  let rafId = 0;
  let lastTime = 0;
  let visible = true;
  let destroyed = false;

  const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function stopLoop() {
    if (rafId && typeof cancelAnimationFrame === 'function') {
      cancelAnimationFrame(rafId);
    }
    rafId = 0;
    lastTime = 0;
  }

  function settle(shape: ShapeName) {
    stopLoop();
    fromShape = shape;
    toShape = shape;
    activeMorph = null;
    pos = 1;
    vel = 0;
    target = 1;
    onFrame(getShapePath(shape));
  }

  function stepSpring(dtSeconds: number) {
    const { stiffness, dampingRatio } = spring;
    const damping = 2 * dampingRatio * Math.sqrt(stiffness);
    const substeps = Math.max(1, Math.ceil(dtSeconds / 0.002));
    const h = dtSeconds / substeps;

    for (let i = 0; i < substeps; i += 1) {
      const accel = stiffness * (target - pos) - damping * vel;
      vel += accel * h;
      pos += vel * h;
    }
  }

  function tick(now: number) {
    if (destroyed || !activeMorph) return;

    if (!visible || (typeof document !== 'undefined' && document.hidden)) {
      settle(target === 0 ? fromShape : toShape);
      return;
    }

    const dt = Math.min(0.032, Math.max(0.001, (now - lastTime) / 1000));
    lastTime = now;

    stepSpring(dt);
    const clampedPos = Math.max(0, Math.min(1.03, pos));
    onFrame(morphToSvgPath(activeMorph, clampedPos));

    const settled = Math.abs(target - pos) < 0.001 && Math.abs(vel) < 0.003;
    if (settled) {
      settle(target === 0 ? fromShape : toShape);
      return;
    }

    rafId = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (rafId) return;
    lastTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
    rafId = requestAnimationFrame(tick);
  }

  function tryReuseActiveMorph(nextShape: ShapeName): boolean {
    if (!activeMorph) return false;
    if (nextShape !== fromShape && nextShape !== toShape) return false;
    target = nextShape === fromShape ? 0 : 1;
    startLoop();
    return true;
  }

  function morphTo(nextShape: ShapeName, preset: SpringPreset = 'default') {
    if (destroyed) return;
    spring = SPRING_PRESETS[preset];

    if (!visible || prefersReducedMotion()) {
      settle(nextShape);
      return;
    }

    const currentLogicalTarget = target === 0 ? fromShape : toShape;
    if (nextShape === currentLogicalTarget && (!activeMorph || rafId)) {
      if (!activeMorph) onFrame(getShapePath(nextShape));
      return;
    }

    if (tryReuseActiveMorph(nextShape)) return;

    const anchor = activeMorph && pos < 0.5 ? fromShape : toShape;
    if (anchor === nextShape) {
      settle(nextShape);
      return;
    }

    fromShape = anchor;
    toShape = nextShape;
    activeMorph = getMorph(fromShape, toShape);
    pos = 0;
    vel = Math.max(0, Math.min(2.0, Math.abs(vel) * 0.25));
    target = 1;
    startLoop();
  }

  function setVisible(nextVisible: boolean) {
    visible = nextVisible;
    if (!visible && activeMorph) {
      settle(target === 0 ? fromShape : toShape);
    }
  }

  return {
    morphTo,
    setVisible,
    destroy: () => {
      destroyed = true;
      stopLoop();
    },
  };
}
