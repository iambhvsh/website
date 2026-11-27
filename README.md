# Bhavesh Patil — Svelte 5 Portfolio

Modular Svelte 5 + TypeScript + Vite rewrite of the single-file portfolio using:

- **Shapes & Morphing**: [`material-shapes-ts`](https://github.com/ruanspies/material-shapes-ts) (`MaterialShapes`, `animateMorph`, `roundedPolygonToPath`) wrapped in a reusable `<Shape>` component and `<Badge>` primitive.
- **Variable Font**: [`@fontsource-variable/google-sans-flex`](https://www.npmjs.com/package/@fontsource-variable/google-sans-flex) self-hosted via Vite with full `wght`, `wdth`, and `ROND` variable axis support.
- **Tree-Shakeable Material Icons**: [`unplugin-icons`](https://github.com/unplugin/unplugin-icons) + `@iconify-json/material-symbols` compiling only statically imported icons (`src/lib/icons/index.ts`) into inline Svelte SVG components at build time.

## Quick Start

```bash
npm install
npm run dev
```

Other scripts:

```bash
npm run check   # TypeScript + Svelte type checking
npm run build   # Production build to dist/
npm run preview # Preview production build locally
```

## Project Structure

```text
├── index.html                      # Entry HTML + SEO & JSON-LD metadata
├── package.json
├── svelte.config.js
├── tsconfig.json
├── vite.config.ts                  # Svelte + unplugin-icons + path aliases
└── src/
    ├── main.ts                     # Loads Google Sans Flex + global CSS + mounts App
    ├── App.svelte                  # Root layout + scroll spy
    ├── env.d.ts               # Vite, Svelte & unplugin-icons types
    ├── styles/
    │   ├── tokens.css              # Material 3 Expressive light/dark palette & radii
    │   ├── typography.css          # Google Sans Flex variable font classes
    │   └── base.css                # Global resets, layout helpers, reduced motion
    └── lib/
        ├── shapes/
        │   └── index.ts            # material-shapes-ts wrapper & M3E spring easing
        ├── icons/
        │   └── index.ts            # Tree-shakeable static Material Symbols imports
        ├── stores/
        │   ├── theme.svelte.ts     # Reactive light/dark theme toggle
        │   └── spy.svelte.ts # Reusable IntersectionObserver scroll spy
        ├── services/
        │   ├── music.ts           # Last.fm latest-song + iTunes 600px artwork API
        │   └── feed.ts              # Writing RSS feed parser
        ├── data/                   # Typed content modules (easy to edit)
        │   ├── site.ts
        │   ├── projects.ts
        │   ├── stack.ts
        │   ├── devices.ts
        │   ├── interests.ts
        │   └── links.ts
        └── components/
            ├── ui/                 # Reusable M3E primitives
            │   ├── Button.svelte
            │   ├── Card.svelte
            │   ├── Chip.svelte
            │   ├── Github.svelte
            │   ├── Shape.svelte
            │   ├── Section.svelte
            │   ├── Badge.svelte
            │   ├── Stat.svelte
            │   ├── Panel.svelte
            │   ├── Pill.svelte
            │   └── index.ts
            └── sections/           # Modular page sections & cards
                ├── Header.svelte
                ├── Hero.svelte
                ├── About.svelte
                ├── Stack.svelte
                ├── Project.svelte
                ├── Projects.svelte
                ├── Listening.svelte
                ├── Device.svelte
                ├── Devices.svelte
                ├── Interests.svelte
                ├── Post.svelte
                ├── Writing.svelte
                ├── Sponsor.svelte
                ├── Link.svelte
                ├── Links.svelte
                ├── Footer.svelte
                └── index.ts
```
