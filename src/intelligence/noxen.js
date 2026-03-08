/**
 * NOXEN CSS FRAMEWORK v2.0
 * Layer 6 — Intelligence Layer
 * Auto-ARIA · Theme Engine · AI Palette · Token Bridge · Scroll Reveal
 * Cross-platform Export · Accessibility Audit · Toast · Modal · Accordion
 */

(function (global) {
  'use strict';

  // ═══════════════════════════════════════════════════════
  //  INTERNAL STATE
  // ═══════════════════════════════════════════════════════
  const state = {
    theme: 'void',
    customThemes: {},
    listeners: { ready: [], theme: [], token: [], a11y: [] },
    scrollObserver: null,
  };

  // ═══════════════════════════════════════════════════════
  //  EVENT BUS
  // ═══════════════════════════════════════════════════════
  function emit(event, data) {
    (state.listeners[event] || []).forEach(fn => fn(data));
  }

  // ═══════════════════════════════════════════════════════
  //  THEME ENGINE
  // ═══════════════════════════════════════════════════════
  const theme = {
    /** Switch to a named theme instantly */
    set(name) {
      const el = document.documentElement;
      el.setAttribute('data-nx-theme', name);
      state.theme = name;
      emit('theme', { theme: name });
    },

    /** Get current theme name */
    get() { return state.theme; },

    /** Create a custom theme from token overrides */
    create(name, tokens = {}) {
      const style = document.createElement('style');
      const rules = Object.entries(tokens)
        .map(([k, v]) => `  ${k}: ${v};`)
        .join('\n');
      style.textContent = `[data-nx-theme="${name}"] {\n${rules}\n}`;
      style.setAttribute('data-nx-theme-id', name);
      document.head.appendChild(style);
      state.customThemes[name] = tokens;
    },

    /** Remove a custom theme */
    remove(name) {
      const el = document.querySelector(`[data-nx-theme-id="${name}"]`);
      if (el) el.remove();
      delete state.customThemes[name];
    },

    /** List all available themes */
    list() {
      return ['void', 'neon', 'carbon', 'bio', 'gold', 'paper', 'aurora', ...Object.keys(state.customThemes)];
    },
  };

  // ═══════════════════════════════════════════════════════
  //  TOKEN ENGINE
  // ═══════════════════════════════════════════════════════
  const tokens = {
    /** Set a single CSS custom property on :root */
    set(key, value, scope = document.documentElement) {
      scope.style.setProperty(key, value);
      emit('token', { key, value });
    },

    /** Set multiple tokens at once */
    setMany(obj, scope = document.documentElement) {
      Object.entries(obj).forEach(([k, v]) => tokens.set(k, v, scope));
    },

    /** Get current value of a token */
    get(key) {
      return getComputedStyle(document.documentElement).getPropertyValue(key).trim();
    },

    /** Reset a token to its default */
    reset(key) {
      document.documentElement.style.removeProperty(key);
    },

    /** Reset all inline token overrides */
    resetAll() {
      document.documentElement.removeAttribute('style');
    },

    /** Export all current tokens as an object */
    export(format = 'css') {
      const root = getComputedStyle(document.documentElement);
      const nxTokens = {};
      // Get all --nx- custom properties
      for (let i = 0; i < document.styleSheets.length; i++) {
        try {
          const rules = document.styleSheets[i].cssRules;
          for (let j = 0; j < rules.length; j++) {
            if (rules[j].selectorText === ':root') {
              const style = rules[j].style;
              for (let k = 0; k < style.length; k++) {
                const prop = style[k];
                if (prop.startsWith('--nx-')) {
                  nxTokens[prop] = root.getPropertyValue(prop).trim();
                }
              }
            }
          }
        } catch (e) { /* cross-origin stylesheets */ }
      }

      switch (format) {
        case 'css':
          return ':root {\n' + Object.entries(nxTokens).map(([k, v]) => `  ${k}: ${v};`).join('\n') + '\n}';
        case 'json':
          return JSON.stringify(nxTokens, null, 2);
        case 'scss':
          return Object.entries(nxTokens).map(([k, v]) => `$${k.slice(2).replace(/-/g, '_')}: #{${k}};`).join('\n');
        case 'swift':
          return Object.entries(nxTokens)
            .filter(([k]) => k.includes('color'))
            .map(([k, v]) => {
              const name = k.replace('--nx-color-', '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
              return `static let ${name} = Color("${name}") // ${v}`;
            }).join('\n');
        case 'kotlin':
          return Object.entries(nxTokens)
            .filter(([k]) => k.includes('color'))
            .map(([k, v]) => {
              const name = k.replace('--nx-color-', '').replace(/-([a-z])/g, (_, c) => c.toUpperCase());
              return `val ${name}Color = Color(0xFF${v.replace('#', '')})`;
            }).join('\n');
        case 'figma':
          const figmaTokens = {};
          Object.entries(nxTokens).forEach(([k, v]) => {
            const parts = k.replace('--nx-', '').split('-');
            let obj = figmaTokens;
            parts.forEach((p, i) => {
              if (i === parts.length - 1) obj[p] = { value: v, type: k.includes('color') ? 'color' : 'other' };
              else { obj[p] = obj[p] || {}; obj = obj[p]; }
            });
          });
          return JSON.stringify(figmaTokens, null, 2);
        default:
          return nxTokens;
      }
    },
  };

  // ═══════════════════════════════════════════════════════
  //  AI PALETTE ENGINE (OKLCH-based color science)
  // ═══════════════════════════════════════════════════════
  const palette = {
    /** Generate a full Noxen design system from one hex color */
    fromHex(hex) {
      // Convert hex to HSL for manipulation
      const rgb = hexToRgb(hex);
      if (!rgb) return null;
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const h = hsl.h, s = hsl.s, l = hsl.l;

      // Derive full palette using the hue
      const isDark = l < 0.5;
      const generated = {
        '--nx-color-accent':    hex,
        '--nx-color-accent-lo': hexToRgba(hex, 0.08),
        '--nx-color-accent-md': hexToRgba(hex, 0.20),
        '--nx-color-accent-hi': hexToRgba(hex, 0.45),
        '--nx-color-accent-2':  hslToHex((h + 180) % 360, Math.min(s * 1.1, 1), Math.max(l - 0.15, 0.2)),

        // Background surfaces derived from hue (very dark)
        '--nx-color-bg':        hslToHex(h, Math.min(s * 0.3, 0.3), isDark ? 0.03 : 0.97),
        '--nx-color-surface':   hslToHex(h, Math.min(s * 0.3, 0.25), isDark ? 0.06 : 0.94),
        '--nx-color-surface-2': hslToHex(h, Math.min(s * 0.25, 0.20), isDark ? 0.10 : 0.90),
        '--nx-color-surface-3': hslToHex(h, Math.min(s * 0.20, 0.18), isDark ? 0.14 : 0.86),

        // Text
        '--nx-color-text':   isDark ? '#eeeef8' : '#111118',
        '--nx-color-text-2': isDark ? hslToHex(h, 0.20, 0.65) : hslToHex(h, 0.15, 0.40),
        '--nx-color-text-3': isDark ? hslToHex(h, 0.25, 0.30) : hslToHex(h, 0.10, 0.65),

        // Border
        '--nx-color-border':   isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.08)',
        '--nx-color-border-2': hexToRgba(hex, 0.18),

        // Seam
        '--nx-ag-seam-color': hex,
        '--nx-shadow-glow': `0 0 24px ${hexToRgba(hex, 0.3)}`,
      };

      return generated;
    },

    /** Apply a generated palette to the document */
    apply(hex, themeName = 'custom') {
      const paletteTokens = palette.fromHex(hex);
      if (!paletteTokens) return;
      theme.create(themeName, paletteTokens);
      theme.set(themeName);
      return paletteTokens;
    },

    /** Preview palette without applying */
    preview(hex) {
      return palette.fromHex(hex);
    },
  };

  // ═══════════════════════════════════════════════════════
  //  AUTO-ARIA ENGINE
  // ═══════════════════════════════════════════════════════
  const a11y = {
    /** Inject ARIA roles and keyboard handlers for all nx components */
    init() {
      // Buttons
      document.querySelectorAll('[nx="btn"]:not([role])').forEach(el => {
        if (el.tagName !== 'BUTTON' && el.tagName !== 'A') {
          el.setAttribute('role', 'button');
          if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
          el.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); el.click(); }
          });
        }
      });

      // Toggles
      document.querySelectorAll('[nx="toggle"]').forEach(el => {
        el.setAttribute('role', 'switch');
        el.setAttribute('aria-checked', el.classList.contains('on') || el.hasAttribute('on') ? 'true' : 'false');
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
        el.addEventListener('click', () => {
          const checked = el.getAttribute('aria-checked') === 'true';
          el.setAttribute('aria-checked', (!checked).toString());
          el.classList.toggle('on', !checked);
        });
        el.addEventListener('keydown', e => {
          if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); el.click(); }
        });
      });

      // Accordion triggers
      document.querySelectorAll('[nx="accordion-trigger"]').forEach(el => {
        el.setAttribute('role', 'button');
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
        const content = el.nextElementSibling;
        if (content) {
          const id = 'nx-acc-' + Math.random().toString(36).slice(2, 8);
          content.setAttribute('id', id);
          el.setAttribute('aria-controls', id);
          el.setAttribute('aria-expanded', el.classList.contains('open') ? 'true' : 'false');
        }
      });

      // Alerts — add role
      document.querySelectorAll('[nx="alert"]').forEach(el => {
        if (!el.getAttribute('role')) {
          const tone = el.getAttribute('tone');
          el.setAttribute('role', tone === 'err' ? 'alert' : 'status');
          el.setAttribute('aria-live', tone === 'err' ? 'assertive' : 'polite');
        }
      });

      // Tabs
      document.querySelectorAll('[nx="tabs"]').forEach(tabList => {
        tabList.setAttribute('role', 'tablist');
        tabList.querySelectorAll('[nx="tab"]').forEach((tab, i) => {
          tab.setAttribute('role', 'tab');
          if (!tab.hasAttribute('tabindex')) tab.setAttribute('tabindex', tab.classList.contains('active') ? '0' : '-1');
          tab.setAttribute('aria-selected', tab.classList.contains('active') ? 'true' : 'false');
        });
      });

      // Images — warn about missing alt
      document.querySelectorAll('img:not([alt])').forEach(img => {
        img.setAttribute('alt', '');
        console.warn('[Noxen a11y] Missing alt attribute on image:', img.src);
      });

      // Skip link — inject if not present
      if (!document.querySelector('.nx-skip-link') && document.querySelector('main, [role="main"]')) {
        const skip = document.createElement('a');
        skip.className = 'nx-skip-link';
        skip.href = '#main-content';
        skip.textContent = 'Skip to main content';
        document.body.prepend(skip);
      }
    },

    /** Full page accessibility audit */
    audit() {
      const issues = [];
      // Missing alt
      document.querySelectorAll('img:not([alt])').forEach(img => issues.push({ type: 'error', rule: 'img-alt', el: img, msg: 'Image missing alt attribute' }));
      // Buttons without labels
      document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])').forEach(btn => {
        if (!btn.textContent.trim()) issues.push({ type: 'error', rule: 'btn-label', el: btn, msg: 'Button has no accessible label' });
      });
      // Links without href or label
      document.querySelectorAll('a:not([href])').forEach(a => issues.push({ type: 'warn', rule: 'link-href', el: a, msg: 'Anchor missing href' }));
      // Form inputs without labels
      document.querySelectorAll('input:not([aria-label]):not([aria-labelledby]):not([id])').forEach(input => {
        if (!document.querySelector(`label[for="${input.id}"]`)) {
          issues.push({ type: 'warn', rule: 'input-label', el: input, msg: 'Input may be missing an associated label' });
        }
      });
      // Interactive elements unreachable by keyboard
      document.querySelectorAll('[nx="btn"][tabindex="-1"], [nx="tab"][tabindex="-1"]').forEach(el => {
        issues.push({ type: 'warn', rule: 'keyboard-access', el: el, msg: 'Interactive element not keyboard accessible' });
      });

      const errors   = issues.filter(i => i.type === 'error').length;
      const warnings = issues.filter(i => i.type === 'warn').length;
      console.group('🔍 Noxen A11y Audit');
      console.log(`${errors} errors · ${warnings} warnings`);
      issues.forEach(i => {
        const fn = i.type === 'error' ? console.error : console.warn;
        fn(`[${i.rule}] ${i.msg}`, i.el);
      });
      console.groupEnd();
      emit('a11y', { issues, errors, warnings });
      return { issues, errors, warnings };
    },
  };

  // ═══════════════════════════════════════════════════════
  //  SCROLL REVEAL ENGINE
  // ═══════════════════════════════════════════════════════
  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;
    state.scrollObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('nx-visible');
            if (!entry.target.hasAttribute('nx-scroll-reveal-repeat')) {
              state.scrollObserver.unobserve(entry.target);
            }
          } else if (entry.target.hasAttribute('nx-scroll-reveal-repeat')) {
            entry.target.classList.remove('nx-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );
    document.querySelectorAll('[nx-scroll-reveal]').forEach(el => {
      state.scrollObserver.observe(el);
    });
  }

  // ═══════════════════════════════════════════════════════
  //  INTERACTIVE COMPONENTS
  // ═══════════════════════════════════════════════════════
  function initComponents() {
    // ── Accordion ──
    document.querySelectorAll('[nx="accordion-trigger"]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const isOpen = trigger.classList.contains('open');
        const content = trigger.nextElementSibling;
        trigger.classList.toggle('open', !isOpen);
        if (content && content.hasAttribute('nx')) {/* skip */}
        else if (content) content.classList.toggle('open', !isOpen);
        trigger.setAttribute('open', !isOpen ? '' : null);
        trigger.setAttribute('aria-expanded', (!isOpen).toString());
      });
    });

    // ── Toggle ──
    document.querySelectorAll('[nx="toggle"]:not([data-nx-init])').forEach(toggle => {
      toggle.setAttribute('data-nx-init', '');
      toggle.setAttribute('role', 'switch');
      toggle.setAttribute('tabindex', toggle.getAttribute('tabindex') || '0');
      toggle.addEventListener('click', () => {
        toggle.classList.toggle('on');
        toggle.setAttribute('aria-checked', toggle.classList.contains('on').toString());
        toggle.dispatchEvent(new CustomEvent('nx:toggle', { detail: { on: toggle.classList.contains('on') } }));
      });
    });

    // ── Tabs ──
    document.querySelectorAll('[nx="tabs"]').forEach(tabList => {
      tabList.querySelectorAll('[nx="tab"]').forEach(tab => {
        tab.addEventListener('click', () => {
          tabList.querySelectorAll('[nx="tab"]').forEach(t => {
            t.classList.remove('active');
            t.setAttribute('aria-selected', 'false');
            t.setAttribute('tabindex', '-1');
          });
          tab.classList.add('active');
          tab.setAttribute('aria-selected', 'true');
          tab.setAttribute('tabindex', '0');
          // Show/hide panels
          const target = tab.getAttribute('data-target');
          if (target) {
            document.querySelectorAll('[data-tab-panel]').forEach(p => p.hidden = true);
            const panel = document.querySelector(`[data-tab-panel="${target}"]`);
            if (panel) panel.hidden = false;
          }
          tab.dispatchEvent(new CustomEvent('nx:tab-change', { detail: { tab: tab.dataset.target }, bubbles: true }));
        });
      });
    });

    // ── Dropdown ──
    document.querySelectorAll('[nx="dropdown"]').forEach(dropdown => {
      const menu = dropdown.querySelector('[nx="dropdown-menu"]');
      const trigger = dropdown.querySelector('[data-dropdown-trigger], [nx="btn"]');
      if (!menu) return;
      if (trigger) {
        trigger.addEventListener('click', e => {
          e.stopPropagation();
          const open = menu.classList.contains('open');
          document.querySelectorAll('[nx="dropdown-menu"].open').forEach(m => m.classList.remove('open'));
          menu.classList.toggle('open', !open);
        });
      }
      document.addEventListener('click', () => menu.classList.remove('open'));
    });

    // ── Dismissible alerts ──
    document.querySelectorAll('[nx="alert"][dismissible]').forEach(alert => {
      const btn = document.createElement('button');
      btn.setAttribute('aria-label', 'Dismiss');
      btn.style.cssText = 'position:absolute;top:8px;right:12px;background:none;border:none;color:inherit;cursor:pointer;font-size:16px;opacity:0.6;';
      btn.textContent = '×';
      btn.addEventListener('click', () => alert.remove());
      alert.style.position = 'relative';
      alert.appendChild(btn);
    });

    // ── Modal ──
    document.querySelectorAll('[data-nx-modal]').forEach(trigger => {
      trigger.addEventListener('click', () => {
        const targetId = trigger.getAttribute('data-nx-modal');
        const backdrop = document.querySelector(`[nx="modal-backdrop"][data-modal-id="${targetId}"]`);
        if (backdrop) {
          backdrop.setAttribute('open', '');
          backdrop.querySelectorAll('[nx="btn"], button, input, select, textarea, a[href]')[0]?.focus();
        }
      });
    });
    document.querySelectorAll('[nx="modal-backdrop"]').forEach(backdrop => {
      backdrop.addEventListener('click', e => {
        if (e.target === backdrop) backdrop.removeAttribute('open');
      });
      backdrop.addEventListener('keydown', e => {
        if (e.key === 'Escape') backdrop.removeAttribute('open');
      });
    });
    document.querySelectorAll('[data-nx-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        btn.closest('[nx="modal-backdrop"]')?.removeAttribute('open');
      });
    });
  }

  // ═══════════════════════════════════════════════════════
  //  MASONRY LAYOUT
  // ═══════════════════════════════════════════════════════
  function initMasonry() {
    document.querySelectorAll('[nx="grid"][layout="masonry"]').forEach(grid => {
      const ROW_GAP = parseInt(getComputedStyle(grid).rowGap) || 16;
      function layout() {
        const rowHeight = 8;
        grid.querySelectorAll(':scope > *').forEach(item => {
          const height = item.getBoundingClientRect().height;
          const rowSpan = Math.ceil((height + ROW_GAP) / (rowHeight + ROW_GAP));
          item.style.gridRowEnd = `span ${rowSpan}`;
        });
      }
      layout();
      window.addEventListener('resize', layout);
      // Also run after images load
      grid.querySelectorAll('img').forEach(img => img.addEventListener('load', layout));
    });
  }

  // ═══════════════════════════════════════════════════════
  //  TOAST SYSTEM
  // ═══════════════════════════════════════════════════════
  const toast = {
    _stack: null,
    _getStack() {
      if (!this._stack) {
        this._stack = document.querySelector('[nx="toast-stack"]');
        if (!this._stack) {
          this._stack = document.createElement('div');
          this._stack.setAttribute('nx', 'toast-stack');
          document.body.appendChild(this._stack);
        }
      }
      return this._stack;
    },
    show(message, { tone = '', duration = 4000, title = '' } = {}) {
      const stack = this._getStack();
      const el = document.createElement('div');
      el.setAttribute('nx', 'toast');
      if (tone) el.setAttribute('tone', tone);
      const icon = { ok: '✓', warn: '⚠', err: '✕', info: 'ℹ' }[tone] || '●';
      el.innerHTML = `
        <span style="font-size:14px;flex-shrink:0">${icon}</span>
        <div style="flex:1">
          ${title ? `<div style="font-weight:600;font-size:13px;margin-bottom:3px">${title}</div>` : ''}
          <div style="font-size:13px;opacity:0.8">${message}</div>
        </div>
        <button onclick="this.parentElement.remove()" aria-label="Dismiss" style="background:none;border:none;color:inherit;cursor:pointer;opacity:0.5;font-size:16px;padding:0 0 0 8px">×</button>
      `;
      stack.prepend(el);
      if (duration > 0) setTimeout(() => el.remove(), duration);
      return el;
    },
    success(msg, opts) { return this.show(msg, { ...opts, tone: 'ok' }); },
    warn(msg, opts)    { return this.show(msg, { ...opts, tone: 'warn' }); },
    error(msg, opts)   { return this.show(msg, { ...opts, tone: 'err' }); },
    info(msg, opts)    { return this.show(msg, { ...opts, tone: 'info' }); },
  };

  // ═══════════════════════════════════════════════════════
  //  ANTIGRAVITY JS API
  // ═══════════════════════════════════════════════════════
  const ag = {
    /** Apply mirror to an element */
    mirror(el, axis = 'y') {
      if (axis === 'y') el.setAttribute('nx-ag', 'mirror');
      else if (axis === 'x') { el.removeAttribute('nx-ag'); el.setAttribute('nx-ag-axis', 'x'); }
    },
    /** Apply reflection */
    reflect(el) { el.setAttribute('nx-ag', 'reflect'); },
    /** Remove antigravity from element */
    restore(el) { el.removeAttribute('nx-ag'); el.removeAttribute('nx-ag-axis'); el.style.transform = ''; },
    /** Toggle mirror */
    toggle(el) {
      if (el.getAttribute('nx-ag') === 'mirror') this.restore(el);
      else this.mirror(el);
    },
    /** Trigger entry animation */
    enter(el, type = 'rise') { el.setAttribute('nx-ag-enter', type); },
  };

  // ═══════════════════════════════════════════════════════
  //  QUERY HELPERS
  // ═══════════════════════════════════════════════════════
  function query(component, variant) {
    const sel = variant ? `[nx="${component}"][variant="${variant}"]` : `[nx="${component}"]`;
    return document.querySelectorAll(sel);
  }

  // ═══════════════════════════════════════════════════════
  //  COLOR MATH UTILITIES
  // ═══════════════════════════════════════════════════════
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
  }
  function hexToRgba(hex, alpha) {
    const rgb = hexToRgb(hex);
    if (!rgb) return hex;
    return `rgba(${rgb.r},${rgb.g},${rgb.b},${alpha})`;
  }
  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: h * 360, s, l };
  }
  function hslToHex(h, s, l) {
    h = h % 360;
    const a = s * Math.min(l, 1 - l);
    const f = (n) => {
      const k = (n + h / 30) % 12;
      const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * c).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
  }

  // ═══════════════════════════════════════════════════════
  //  PRINT MODE
  // ═══════════════════════════════════════════════════════
  const print = {
    /** Switch to print mode preview */
    enable() { document.documentElement.setAttribute('data-nx-mode', 'print'); },
    /** Remove print mode */
    disable() { document.documentElement.removeAttribute('data-nx-mode'); },
    /** Trigger browser print dialog */
    open() { global.print(); },
  };

  // ═══════════════════════════════════════════════════════
  //  INIT
  // ═══════════════════════════════════════════════════════
  function init(config = {}) {
    // Apply config
    if (config.theme) theme.set(config.theme);
    if (config.tokens) tokens.setMany(config.tokens);
    if (config.a11y !== false) a11y.init();

    // Init all systems
    initScrollReveal();
    initComponents();
    initMasonry();

    // Detect system color scheme preference
    if (!document.documentElement.getAttribute('data-nx-theme')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (!prefersDark) theme.set('paper');
    }

    // Watch for new elements added to DOM
    const mo = new MutationObserver(() => {
      a11y.init();
      initComponents();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    emit('ready', { version: '2.0.0' });
    if (config.debug) console.log('[Noxen v2.0.0] Ready ✓');
  }

  // ═══════════════════════════════════════════════════════
  //  PUBLIC API
  // ═══════════════════════════════════════════════════════
  const Noxen = {
    version: '2.0.0',

    // Core
    init,
    query,

    // Subsystems
    theme,
    tokens,
    palette,
    a11y,
    ag,
    toast,
    print,

    // Convenience aliases
    on(event, fn) { (state.listeners[event] = state.listeners[event] || []).push(fn); },

    // Quick theme switch
    setTheme(name) { theme.set(name); },

    // Quick token override
    setToken(key, value) { tokens.set(key, value); },
  };

  // ── Auto-init on DOMContentLoaded ──
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => init({ a11y: true }));
  } else {
    init({ a11y: true });
  }

  // ── Expose globally ──
  global.Noxen = Noxen;

}(typeof window !== 'undefined' ? window : this));
