#!/usr/bin/env python3
"""
NOXEN CSS v2.0 — Build Script
Concatenates all source layers → dist/noxen.css + noxen.min.css
Copies JS → dist/noxen.js + noxen.min.js
"""

import os, re, json

ROOT = os.path.dirname(os.path.abspath(__file__))

CSS_LAYERS = [
    'src/tokens/_tokens.css',
    'src/themes/_themes.css',
    'src/components/_base.css',
    'src/layout/_layout.css',
    'src/components/_components.css',
    'src/motion/_motion.css',
    'src/antigravity/_antigravity.css',
]

def read(path):
    with open(os.path.join(ROOT, path)) as f:
        return f.read()

def write(path, content):
    full_path = os.path.join(ROOT, path)
    os.makedirs(os.path.dirname(full_path), exist_ok=True)
    with open(full_path, 'w') as f:
        f.write(content)
    kb = os.path.getsize(full_path) / 1024
    print(f'  ✓  {path} ({kb:.1f} KB)')

def minify_css(css):
    css = re.sub(r'/\*.*?\*/', '', css, flags=re.DOTALL)
    css = re.sub(r'\s+', ' ', css)
    css = re.sub(r'\s*([{};:,>~+])\s*', r'\1', css)
    css = re.sub(r';}', '}', css)
    return css.strip()

def minify_js(js):
    js = re.sub(r'(?<!:)//(?!/).*$', '', js, flags=re.MULTILINE)
    js = re.sub(r'/\*.*?\*/', '', js, flags=re.DOTALL)
    js = re.sub(r'\n\s*\n', '\n', js)
    js = re.sub(r'  +', ' ', js)
    return js.strip()

print('\n🔧 Building Noxen CSS v2.0.0...\n')

# ── CSS ──
parts = []
for layer in CSS_LAYERS:
    content = read(layer)
    content = re.sub(r"@import\s+'[^']+';?\n?", '', content)
    parts.append(content)

full_css = '\n'.join(parts)
mini_css = minify_css(full_css)
css_banner = "/* Noxen CSS v2.0.0 | MIT License | https://noxen.dev | npm i noxen-css */\n"

write('dist/noxen.css', full_css)
write('dist/noxen.min.css', css_banner + mini_css)

# ── JS ──
full_js = read('src/intelligence/noxen.js')
mini_js = minify_js(full_js)
js_banner  = "/* Noxen JS v2.0.0 | MIT License | https://noxen.dev */\n"

write('dist/noxen.js', full_js)
write('dist/noxen.min.js', js_banner + mini_js)

# ── Build manifest ──
with open(os.path.join(ROOT, 'dist/noxen.css')) as f: css_size = len(f.read().encode())
with open(os.path.join(ROOT, 'dist/noxen.min.css')) as f: min_css_size = len(f.read().encode())
with open(os.path.join(ROOT, 'dist/noxen.js')) as f: js_size = len(f.read().encode())
with open(os.path.join(ROOT, 'dist/noxen.min.js')) as f: min_js_size = len(f.read().encode())

manifest = {
    "name": "noxen-css",
    "version": "2.0.0",
    "built": __import__('datetime').datetime.utcnow().isoformat() + 'Z',
    "files": {
        "noxen.css":     f"{css_size/1024:.1f}KB",
        "noxen.min.css": f"{min_css_size/1024:.1f}KB",
        "noxen.js":      f"{js_size/1024:.1f}KB",
        "noxen.min.js":  f"{min_js_size/1024:.1f}KB",
    },
    "cdn": {
        "css": "https://cdn.jsdelivr.net/npm/noxen-css@2/dist/noxen.min.css",
        "js":  "https://cdn.jsdelivr.net/npm/noxen-css@2/dist/noxen.min.js"
    }
}
write('dist/build-manifest.json', json.dumps(manifest, indent=2))

total = (min_css_size + min_js_size) / 1024
print(f'\n✅ Build complete! Total minified: {total:.1f} KB\n')
