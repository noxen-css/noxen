# NOXEN CSS Framework v2.1.2

> **"No other framework can do what Noxen does."**

The world's first **intent-based** CSS framework. Describe what your elements **ARE**, not what they look like.

[![npm](https://img.shields.io/npm/v/noxen-css)](https://www.npmjs.com/package/noxen-css)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Bundle size](https://img.shields.io/badge/bundle-163KB-blue)](https://cdn.jsdelivr.net/npm/noxen-css@2.1.2/dist/)

---

## Quick Start

**CDN (zero install):**
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/noxen-css@2.1.2/dist/noxen.min.css">
<script src="https://cdn.jsdelivr.net/npm/noxen-css@2.1.2/dist/noxen.min.js"></script>
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

## What's New in v2.1.2 — Bootstrap Killer 🚀

**49 total components.** Every Bootstrap gap closed, plus 13 brand-new components that Bootstrap doesn't have.

### 13 New Components

| Component | Usage | Description |
|-----------|-------|-------------|
| **Drawer** | `nx="drawer"` | Slide-in panel, 4 sides |
| **Command Palette** | `nx="command"` | Cmd+K spotlight search |
| **Carousel** | `nx="carousel"` | Touch/drag, autoplay |
| **Data Grid** | `nx="data-grid"` | Sort, search, paginate |
| **Tooltip** | `nx-tip=""` | Pure CSS, 4 directions |
| **Rating** | `nx="rating"` | Star rating, hover + click |
| **Timeline** | `nx="timeline"` | Tone dots, pulse animation |
| **Stepper** | `nx="stepper"` | Multi-step wizard |
| **Date Picker** | `nx="date-picker"` | Custom calendar, no deps |
| **File Upload** | `nx="file-upload"` | Drag & drop zone |
| **Color Picker** | `nx="color-picker"` | 20 swatches + hex input |
| **Kanban** | `nx="kanban"` | Drag & drop board |
| **Container Queries** | `nx-container` | True container-aware layouts |

### Bootstrap Parity (all gaps closed)

| Category | Components Added |
|----------|-----------------|
| Forms | `nx="form"` · `nx="field"` · `nx="input-group"` · `nx="checkbox"` · `nx="radio"` · `nx="range"` |
| Navigation | `nx="breadcrumb"` · `nx="pagination"` · `nx="tabs" variant="pills"` · `nx="navbar-toggler"` · `nx="scrollspy-nav"` |
| Content | `nx="blockquote"` · `nx="list-group"` · `nx="figure"` · `nx="display-1"` → `nx="display-6"` · `nx="lead"` · `nx="mark"` · `nx="kbd"` · `nx="code"` · `nx="dl"` |
| Feedback | `nx="spinner"` (3 variants, 5 sizes, 3 tones) · `nx="popover-wrap"` |

---

## Core Components

```html
<!-- Card -->
<div nx="card" variant="raised">Content</div>

<!-- Button — all variants -->
<button nx="btn">Default</button>
<button nx="btn" variant="outline" size="lg">Outline</button>
<button nx="btn" variant="danger">Danger</button>

<!-- Grid -->
<div nx="grid" cols="3" gap="md">
  <div nx="card">1</div>
  <div nx="card">2</div>
  <div nx="card">3</div>
</div>

<!-- Smart Grid layouts -->
<div nx="grid" layout="sidebar-main">
  <aside>Sidebar</aside>
  <main>Content</main>
</div>

<!-- Alert -->
<div nx="alert" tone="ok">Operation successful!</div>
<div nx="alert" tone="err">Something went wrong</div>

<!-- Badge -->
<span nx="badge" tone="warn">Pending</span>

<!-- Progress -->
<div nx="progress" style="--nx-progress: 72"></div>

<!-- Stack / Row -->
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

## v2.1.2 Components

### Drawer
```html
<!-- Trigger -->
<button data-drawer-open="my-drawer">Open Drawer</button>

<!-- Drawer -->
<div nx="drawer" id="my-drawer" side="right">
  <div nx="drawer-header">
    <span>Title</span>
    <button data-drawer-close="my-drawer">✕</button>
  </div>
  <div nx="drawer-body">Content here</div>
  <div nx="drawer-footer">
    <button nx="btn">Save</button>
  </div>
</div>
```
```js
Noxen.drawer.open('my-drawer')
Noxen.drawer.close('my-drawer')
Noxen.drawer.toggle('my-drawer')
```

### Command Palette
```html
<!-- Opens on Cmd+K automatically -->
<div nx="command-backdrop" data-command-close="cmd">
  <div nx="command" id="cmd">
    <div nx="command-input-wrap">
      <input nx="command-input" placeholder="Search…">
    </div>
    <div nx="command-list">
      <div nx="command-group">
        <div nx="command-group-label">Actions</div>
        <div nx="command-item">New Document</div>
        <div nx="command-item">Open Settings</div>
      </div>
    </div>
  </div>
</div>
```
```js
Noxen.command.open('cmd')
Noxen.command.close('cmd')
```

### Carousel
```html
<div nx="carousel" per-view="3" autoplay="3000">
  <div nx="carousel-track">
    <div nx="carousel-slide"><div nx="card">Slide 1</div></div>
    <div nx="carousel-slide"><div nx="card">Slide 2</div></div>
    <div nx="carousel-slide"><div nx="card">Slide 3</div></div>
  </div>
  <button nx="carousel-prev">‹</button>
  <button nx="carousel-next">›</button>
  <div nx="carousel-dots"></div>
</div>
```

### Data Grid
```html
<div nx="data-grid" page-size="10" selectable>
  <div nx="data-grid-toolbar">
    <div nx="data-grid-search"><input placeholder="Search…"></div>
  </div>
  <div nx="data-grid-wrap">
    <table nx="table">
      <thead><tr>
        <th data-col="0">Name</th>
        <th data-col="1">Status</th>
      </tr></thead>
      <tbody>
        <tr><td>Item A</td><td>Active</td></tr>
        <tr><td>Item B</td><td>Pending</td></tr>
      </tbody>
    </table>
  </div>
  <div nx="data-grid-pagination">
    <span nx="data-grid-info"></span>
    <div nx="data-grid-pages"></div>
  </div>
</div>
```

### Tooltip
```html
<!-- Pure CSS, no JS needed -->
<button nx-tip="Saves your work">Save</button>
<button nx-tip="Opens below" tip-side="bottom">Bottom</button>
<span nx-tip="Error occurred" tip-tone="err">Hover me</span>
```

### Rating
```html
<div nx="rating" value="4">
  <div nx="rating-star"></div>
  <div nx="rating-star"></div>
  <div nx="rating-star"></div>
  <div nx="rating-star"></div>
  <div nx="rating-star"></div>
  <span nx="rating-value"></span>
</div>
```

### Stepper
```html
<div data-stepper>
  <div nx="stepper">
    <div nx="step" current>
      <div nx="step-dot">1</div>
      <div nx="step-label">Details</div>
      <div nx="step-line"></div>
    </div>
    <div nx="step">
      <div nx="step-dot">2</div>
      <div nx="step-label">Payment</div>
      <div nx="step-line"></div>
    </div>
    <div nx="step">
      <div nx="step-dot">3</div>
      <div nx="step-label">Confirm</div>
    </div>
  </div>
  <div nx="step-panel" active>Step 1 content</div>
  <div nx="step-panel">Step 2 content</div>
  <div nx="step-panel">Step 3 content</div>
  <div nx="step-nav">
    <button data-step-prev disabled>Back</button>
    <button data-step-next>Next</button>
  </div>
</div>
```
```js
Noxen.stepper.next(stepperEl)
Noxen.stepper.prev(stepperEl)
Noxen.stepper.goTo(stepperEl, 2)
```

### Date Picker
```html
<div nx="date-picker">
  <div nx="date-input" tabindex="0">
    <span class="nx-date-text">Select a date…</span>
  </div>
  <div nx="date-calendar">
    <div nx="date-nav">
      <button>‹</button>
      <span nx="date-month-label"></span>
      <button>›</button>
    </div>
    <div nx="date-weekdays">
      <span>Su</span><span>Mo</span><span>Tu</span><span>We</span>
      <span>Th</span><span>Fr</span><span>Sa</span>
    </div>
    <div nx="date-grid"></div>
  </div>
</div>
```
```js
Noxen.on('datepicker:change', ({ el, date, formatted }) => {
  console.log('Selected:', formatted)
})
```

### File Upload
```html
<div nx="file-upload">
  <input type="file" multiple>
  <div nx="file-upload-icon">📂</div>
  <div nx="file-upload-label">Drop files here or click to browse</div>
  <div nx="file-upload-hint">PNG, PDF, ZIP — max 10MB</div>
</div>
```
```js
Noxen.on('fileupload:change', ({ el, files }) => {
  console.log('Files:', files)
})
```

### Color Picker
```html
<div nx="color-picker" value="#00e5ff">
  <div nx="color-trigger" tabindex="0">
    <div nx="color-swatch-preview"></div>
    <span class="nx-cp-text">#00E5FF</span>
  </div>
  <div nx="color-panel">
    <div nx="color-swatches"></div>
    <div nx="color-hex-input"><input maxlength="6" placeholder="00E5FF"></div>
    <input nx="color-native" type="color" value="#00e5ff">
  </div>
</div>
```
```js
Noxen.on('colorpicker:change', ({ el, color }) => {
  console.log('Color:', color) // '#ff3366'
})
Noxen.colorPicker.get(el)       // → '#00e5ff'
Noxen.colorPicker.set(el, '#ff3366')
```

### Kanban
```html
<div nx="kanban">
  <div nx="kanban-col">
    <div nx="kanban-col-header">
      <span nx="kanban-col-title">Backlog</span>
      <span nx="kanban-col-count"></span>
    </div>
    <div nx="kanban-cards">
      <div nx="kanban-card">
        <div nx="kanban-card-title">Design new dashboard</div>
        <div nx="kanban-card-desc">Update the analytics page</div>
        <div nx="kanban-card-meta">
          <span nx="badge">UI</span>
        </div>
      </div>
    </div>
    <button nx="kanban-add">+ Add card</button>
  </div>
  <div nx="kanban-col" tone="warn">...</div>
  <div nx="kanban-col" tone="ok">...</div>
</div>
```
```js
Noxen.kanban.addCard(boardEl, 0, {
  title: 'New task',
  desc: 'Description',
  tags: ['Feature']
})
Noxen.on('kanban:drop', ({ card, fromCol, toCol }) => {
  console.log('Moved card to column', toCol)
})
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
  <section nx-ag="reflect">Bottom half</section>
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
<!-- Apply via HTML attribute -->
<html data-nx-theme="carbon">

<!-- Available: void | neon | carbon | bio | gold | paper | aurora -->
```

```js
Noxen.theme.set('neon')
Noxen.theme.get()        // → 'neon'
Noxen.theme.list()       // → ['void', 'neon', 'carbon', 'bio', 'gold', 'paper', 'aurora']

// Custom brand theme
Noxen.theme.create('mybrand', {
  '--nx-color-accent':    '#FF3366',
  '--nx-color-accent-lo': 'rgba(255,51,102,0.08)',
  '--nx-color-bg':        '#0a0005',
})
Noxen.theme.set('mybrand')

// AI-generated palette from one hex
Noxen.palette.apply('#FF3366', 'brand')
```

---

## Motion System

```html
<!-- Entrance animations -->
<div nx-enter="rise">Animates on load</div>
<div nx-enter="fade" nx-speed="fast">Fast fade</div>
<div nx-enter="bounce">Bouncy entrance</div>

<!-- Scroll reveal -->
<div nx-scroll-reveal="rise">Reveals when scrolled into view</div>

<!-- Stagger group — children reveal sequentially -->
<div nx-stagger>
  <div nx-enter="rise">1st</div>
  <div nx-enter="rise">2nd</div>
  <div nx-enter="rise">3rd</div>
</div>

<!-- Continuous animations -->
<div nx-animate="float">Floating</div>
<div nx-animate="pulse">Pulsing</div>
<div nx-animate="glow">Glowing</div>
```

---

## JavaScript API

```js
// Theme
Noxen.theme.set('carbon')
Noxen.theme.get()
Noxen.theme.list()
Noxen.theme.create('name', tokens)

// Tokens
Noxen.tokens.set('--nx-color-accent', '#FF3366')
Noxen.tokens.get('--nx-color-accent')
Noxen.tokens.export('css')   // css | json | scss | figma | swift | kotlin

// AI Palette
Noxen.palette.apply('#FF3366', 'brand')
Noxen.palette.fromHex('#FF3366')

// Accessibility
Noxen.a11y.audit()
Noxen.a11y.init()

// Antigravity
Noxen.ag.mirror(el)
Noxen.ag.reflect(el)
Noxen.ag.restore(el)
Noxen.ag.enter(el, 'rise')

// Toast
Noxen.toast.success('Saved!')
Noxen.toast.error('Failed')
Noxen.toast.warn('Check input')
Noxen.toast.info('Update available')

// Drawer
Noxen.drawer.open('drawer-id')
Noxen.drawer.close('drawer-id')
Noxen.drawer.toggle('drawer-id')

// Command Palette
Noxen.command.open('cmd-id')
Noxen.command.close('cmd-id')

// Carousel
Noxen.carousel.init(el)

// Data Grid
Noxen.dataGrid.init(el)

// Rating
Noxen.rating.init(el)

// Stepper
Noxen.stepper.next(el)
Noxen.stepper.prev(el)
Noxen.stepper.goTo(el, stepIndex)

// Date Picker
Noxen.datePicker.init(el)

// File Upload
Noxen.fileUpload.init(el)

// Color Picker
Noxen.colorPicker.init(el)
Noxen.colorPicker.get(el)       // → '#00e5ff'
Noxen.colorPicker.set(el, hex)

// Kanban
Noxen.kanban.init(el)
Noxen.kanban.addCard(boardEl, colIndex, { title, desc, tags })

// Form
Noxen.form.validate(formEl)
Noxen.form.reset(formEl)
Noxen.form.setError(fieldEl, message)
Noxen.form.setValid(fieldEl)

// Popover
Noxen.popover.open(el)
Noxen.popover.close(el)

// Pagination
Noxen.pagination.create(containerEl, { total, page, pageSize, onChange })

// Print
Noxen.print.enable()
Noxen.print.disable()
Noxen.print.open()

// Events
Noxen.on('ready',              ({ version }) => {})
Noxen.on('theme',              ({ theme }) => {})
Noxen.on('token',              ({ key, value }) => {})
Noxen.on('rating:change',      ({ el, value }) => {})
Noxen.on('kanban:drop',        ({ card, fromCol, toCol }) => {})
Noxen.on('fileupload:change',  ({ el, files }) => {})
Noxen.on('colorpicker:change', ({ el, color }) => {})
Noxen.on('datepicker:change',  ({ el, date, formatted }) => {})
Noxen.on('form:submit',        ({ el, data }) => {})
Noxen.on('form:validate',      ({ el, valid }) => {})
Noxen.on('range:change',       ({ el, value }) => {})
```

---

## Token System

All tokens: `--nx-[category]-[role]-[modifier]`

```css
/* Override globally */
:root {
  --nx-color-accent:   #FF3366;
  --nx-radius-lg:      4px;
  --nx-font-display:   'Your Font', sans-serif;
}

/* Scope to a component */
[nx="card"] {
  --nx-radius-lg: 0;
}
```

---

## Utility Layer

```html
<!-- Display -->
<div nx-d="flex">...</div>
<div nx-d="grid">...</div>

<!-- Flex shortcuts -->
<div nx-flex="between">...</div>   <!-- space-between -->
<div nx-flex="center">...</div>    <!-- centered -->
<div nx-flex="col">...</div>       <!-- column -->

<!-- Spacing -->
<div nx-p="md">...</div>
<div nx-px="lg">...</div>
<div nx-mb="sm">...</div>

<!-- Typography -->
<p nx-text="accent">Accented text</p>
<p nx-text="bold">Bold</p>
<p nx-text="mono">Monospace</p>
<p nx-text="upper">Uppercase</p>

<!-- Background + Border -->
<div nx-bg="accent-lo" nx-border="accent">...</div>

<!-- Shadow + Radius -->
<div nx-shadow="glow" nx-radius="xl">...</div>

<!-- Visibility (responsive) -->
<div nx-hide="sm">Hidden on mobile</div>
<div nx-show="sm">Visible on mobile only</div>

<!-- Hover effects -->
<div nx-hover="lift">Lifts on hover</div>
<div nx-hover="glow">Glows on hover</div>
```

---

## Bundle Size

| File | Size |
|------|------|
| `noxen.css` | 152 KB |
| `noxen.min.css` | 103 KB |
| `noxen.js` | 73 KB |
| `noxen.min.js` | 60 KB |
| **Total minified** | **163 KB** |

> Bootstrap 5: 156 KB CSS + 79 KB JS = **235 KB** — no drag & drop, no command palette, no AI palette, no date picker.

---

## File Structure

```
noxen-css/
├── dist/
│   ├── noxen.css          # Full CSS
│   ├── noxen.min.css      # Minified CSS (103 KB)
│   ├── noxen.js           # Full JS
│   └── noxen.min.js       # Minified JS (60 KB)
├── src/
│   ├── tokens/            # Design token system
│   ├── themes/            # 7 built-in themes
│   ├── components/        # 49 components
│   ├── layout/            # Smart Grid + Flex
│   ├── motion/            # Animation system
│   ├── antigravity/       # Physics layout engine
│   └── intelligence/      # JS API layer
├── docs/                  # Documentation site (GitHub Pages)
└── package.json
```

---

## License

MIT © 2025 Noxen Contributors

---

> *"Bootstrap dominated by being first. Tailwind dominated by being different. Noxen will dominate by being impossible to replicate."*
