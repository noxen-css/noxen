# NOXEN CSS Framework v2.0

> **"No other framework can do what Noxen does."**

The world's first **intent-based** CSS framework. Describe what your elements **ARE**, not what they look like.

[![npm](https://img.shields.io/npm/v/noxen-css)](https://www.npmjs.com/package/noxen-css)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Bundle size](https://img.shields.io/badge/bundle-64KB-blue)](https://cdn.jsdelivr.net/npm/noxen-css@2/dist/)

---

## Quick Start

**CDN (zero install):**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/noxen-css@2/dist/noxen.min.css">
<script src="https://cdn.jsdelivr.net/npm/noxen-css@2/dist/noxen.min.js"></script>
```

**NPM:**
```bash
npm install noxen-css
```
```js
import 'noxen-css/dist/noxen.min.css'
import 'noxen-css/dist/noxen.min.js'
```

---

## The Big Difference

| Framework | You write | What it does |
|-----------|-----------|--------------|
| Bootstrap | `class="card shadow rounded p-3 bg-white border"` | Appearance only |
| Tailwind | `class="bg-white rounded-xl shadow-md p-6 flex flex-col..."` | 100+ utility classes |
| **Noxen** | `nx="card" variant="raised"` | **Intent → full design system** |

---

## 12 World-First Features

| # | Feature | Description |
|---|---------|-------------|
| 01 | **Intent API** | `nx=""` — describe purpose, not appearance |
| 02 | **Living Token Engine** | Theme switch in <1ms, zero rebuild |
| 03 | **Antigravity Engine** | World's first CSS physics layout system |
| 04 | **Auto-ARIA** | WCAG 2.1 AA injected automatically |
| 05 | **AI Palette Engine** | Full design system from one hex color |
| 06 | **Fluid Scale** | True `clamp()` responsive, no breakpoint snapping |
| 07 | **Smart Grid** | Intent layouts: `sidebar-main`, `masonry`, `holy-grail` |
| 08 | **Motion System** | Scroll reveals, stagger groups, 8 entrance animations |
| 09 | **Print + Email Mode** | Dark→light auto, Outlook-safe email mode |
| 10 | **Token Export** | CSS → JSON → Figma → iOS Swift → Android Kotlin |
| 11 | **7 Built-in Themes** | void · neon · carbon · bio · gold · paper · aurora |
| 12 | **A11y Audit** | `Noxen.a11y.audit()` — full WCAG report |

---

## Core Components

```html
<!-- Card -->
<div nx="card" variant="raised">Content</div>

<!-- Button -->
<button nx="btn" variant="outline" size="lg">Click Me</button>

<!-- Grid -->
<div nx="grid" cols="3" gap="md">
  <div nx="card">1</div>
  <div nx="card">2</div>
  <div nx="card">3</div>
</div>

<!-- Smart Grid layouts -->
<div nx="grid" layout="sidebar-main">
  <div>Sidebar</div>
  <div>Main</div>
</div>

<!-- Alert -->
<div nx="alert" tone="ok">Operation successful!</div>

<!-- Badge -->
<span nx="badge" tone="warn">Pending</span>

<!-- Progress (set via CSS var) -->
<div nx="progress" style="--nx-progress: 72"></div>

<!-- Toggle -->
<div nx="toggle" class="on"></div>

<!-- Stack / Row layout -->
<div nx="stack" gap="md">...</div>
<div nx="row" justify="between">...</div>

<!-- Navbar -->
<div nx="navbar" sticky glass>
  <span>Logo</span>
  <div nx="spacer"></div>
  <button nx="btn" size="sm">Sign In</button>
</div>
```

---

## Antigravity Engine

```html
<!-- Product reflection (ghost below element) -->
<div nx-ag="reflect">
  <div nx="card">Product Card</div>
</div>

<!-- Chat UI — newest message at bottom, zero JS -->
<div nx-ag="floor">
  <div nx="card">Message 1</div>
  <div nx="card">Message 2</div>
</div>

<!-- Mirror sections meeting at a seam -->
<div nx-ag="pair">
  <section>Top half</section>
  <div nx-ag-seam></div>
  <section nx-ag="reflect">Bottom half (reflected)</section>
</div>

<!-- Entry animations -->
<div nx-ag-enter="fall" nx-ag-stagger>
  <div>Falls in 1</div>
  <div>Falls in 2</div>
  <div>Falls in 3</div>
</div>
```

---

## Themes

```html
<!-- Apply theme via HTML -->
<html data-nx-theme="carbon">

<!-- Available themes -->
void | neon | carbon | bio | gold | paper | aurora
```

```js
// Switch theme in 1ms
Noxen.theme.set('neon')

// Create custom brand theme
Noxen.theme.create('mybrand', {
  '--nx-color-accent':    '#FF3366',
  '--nx-color-accent-lo': 'rgba(255,51,102,0.08)',
  '--nx-color-bg':        '#0a0005',
})
Noxen.theme.set('mybrand')

// AI-generated palette from one hex
Noxen.palette.apply('#FF3366', 'my-palette')
```

---

## Motion System

```html
<!-- Entrance animation on load -->
<div nx-enter="rise">Animates on load</div>
<div nx-enter="fade" nx-speed="fast">Fast fade</div>

<!-- Scroll reveal -->
<div nx-scroll-reveal="rise">Reveals when scrolled into view</div>

<!-- Stagger group — children reveal sequentially -->
<div nx-stagger>
  <div nx-enter="rise">1st</div>
  <div nx-enter="rise">2nd</div>
  <div nx-enter="rise">3rd</div>
</div>

<!-- Continuous animations -->
<div nx-animate="float">Floating element</div>
<div nx-animate="pulse">Pulsing element</div>
<div nx-animate="glow">Glowing element</div>
```

---

## JavaScript API

```js
// Theme
Noxen.theme.set('carbon')
Noxen.theme.get()           // → 'carbon'
Noxen.theme.list()          // → ['void', 'neon', ...]
Noxen.theme.create('name', tokens)

// Tokens
Noxen.tokens.set('--nx-color-accent', '#FF3366')
Noxen.tokens.get('--nx-color-accent') // → '#FF3366'
Noxen.tokens.export('css')   // CSS, JSON, SCSS, Figma, Swift, Kotlin

// AI Palette
Noxen.palette.apply('#FF3366', 'brand')  // Apply instantly
Noxen.palette.fromHex('#FF3366')         // Get token map

// Accessibility
Noxen.a11y.audit()     // Full WCAG audit in console
Noxen.a11y.init()      // Re-run auto-ARIA injection

// Antigravity
Noxen.ag.mirror(el)
Noxen.ag.reflect(el)
Noxen.ag.restore(el)
Noxen.ag.enter(el, 'rise')

// Toast
Noxen.toast.success('Saved!')
Noxen.toast.error('Something failed')
Noxen.toast.info('Update available')
Noxen.toast.warn('Check input')

// Print
Noxen.print.enable()   // Preview in print mode
Noxen.print.open()     // Trigger print dialog

// Events
Noxen.on('ready', ({ version }) => console.log('Noxen', version))
Noxen.on('theme', ({ theme }) => console.log('Theme:', theme))
Noxen.on('token', ({ key, value }) => console.log(key, '=', value))
```

---

## Token System

All tokens follow: `--nx-[category]-[role]-[modifier]`

```css
/* Override any token globally */
:root {
  --nx-color-accent: #FF3366;
  --nx-radius-lg: 4px;        /* sharper corners */
  --nx-font-display: 'Your Font', sans-serif;
}

/* Or scope to a component */
[nx="card"] {
  --nx-radius-lg: 0;           /* square cards only */
}
```

---

## Bundle Size

| File | Size |
|------|------|
| `noxen.css` | 74.9 KB |
| `noxen.min.css` | 45.7 KB |
| `noxen.js` | 29.2 KB |
| `noxen.min.js` | 18.3 KB |
| **Total minified** | **64.0 KB** |

vs. Bootstrap 5: **156 KB** · Tailwind typical build: **20–80 KB** (no JS API)

---

## File Structure

```
noxen-css/
├── dist/
│   ├── noxen.css          # Full CSS source
│   ├── noxen.min.css      # Minified CSS (45.7 KB)
│   ├── noxen.js           # Full JS source
│   ├── noxen.min.js       # Minified JS (18.3 KB)
│   └── build-manifest.json
├── src/
│   ├── tokens/            # L1: Design token system
│   ├── themes/            # L2: 7 themes
│   ├── components/        # L3: Base reset + 25+ components
│   ├── layout/            # L4: Smart Grid + Flex
│   ├── motion/            # L5: Animation system
│   ├── antigravity/       # L6: Physics layout engine
│   └── intelligence/      # L7: JS API + Auto-ARIA + AI Palette
├── docs/                  # Full documentation site
├── starter.html           # Copy-paste starter template
├── build.py               # Build script
└── package.json
```

---

## License

MIT © 2025 Noxen Contributors

---

> *"Bootstrap dominated by being first. Tailwind dominated by being different. Noxen will dominate by being impossible to replicate."*
