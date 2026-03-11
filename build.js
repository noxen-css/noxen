const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

const CSS_LAYERS = [
    'src/tokens/_tokens.css',
    'src/themes/_themes.css',
    'src/components/_base.css',
    'src/layout/_layout.css',
    'src/components/_components.css',
    'src/motion/_motion.css',
    'src/antigravity/_antigravity.css',
];

function read(filePath) {
    return fs.readFileSync(path.join(ROOT, filePath), 'utf8');
}

function write(filePath, content) {
    const fullPath = path.join(ROOT, filePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
    const kb = fs.statSync(fullPath).size / 1024;
    console.log(`  ✓  ${filePath} (${kb.toFixed(1)} KB)`);
}

function minifyCss(css) {
    return css
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*([{};:,>~+])\s*/g, '$1')
        .replace(/;}/g, '}')
        .trim();
}

function minifyJs(js) {
    return js
        .replace(/(?<!:)\/\/(?!\/).*$/gm, '')
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .replace(/\n\s*\n/g, '\n')
        .replace(/  +/g, ' ')
        .trim();
}

console.log('\n🔧 Building Noxen CSS v2.1.2 (Node.js)...\n');

// ── CSS ──
const parts = CSS_LAYERS.map(layer => {
    let content = read(layer);
    return content.replace(/@import\s+'[^']+';?\n?/g, '');
});

const fullCss = parts.join('\n');
const miniCss = minifyCss(fullCss);
const cssBanner = "/* Noxen CSS v2.1.2 | MIT License | https://noxen.dev | npm i noxen-css */\n";

write('dist/noxen.css', fullCss);
write('dist/noxen.min.css', cssBanner + miniCss);

// ── JS ──
const fullJs = read('src/intelligence/noxen.js');
const miniJs = minifyJs(fullJs);
const jsBanner = "/* Noxen JS v2.1.2 | MIT License | https://noxen.dev */\n";

write('dist/noxen.js', fullJs);
write('dist/noxen.min.js', jsBanner + miniJs);

// ── Build manifest ──
const cssSize = Buffer.byteLength(fs.readFileSync(path.join(ROOT, 'dist/noxen.css')));
const minCssSize = Buffer.byteLength(fs.readFileSync(path.join(ROOT, 'dist/noxen.min.css')));
const jsSize = Buffer.byteLength(fs.readFileSync(path.join(ROOT, 'dist/noxen.js')));
const minJsSize = Buffer.byteLength(fs.readFileSync(path.join(ROOT, 'dist/noxen.min.js')));

const manifest = {
    "name": "noxen-css",
    "version": "2.1.2",
    "built": new Date().toISOString(),
    "files": {
        "noxen.css": `${(cssSize / 1024).toFixed(1)}KB`,
        "noxen.min.css": `${(minCssSize / 1024).toFixed(1)}KB`,
        "noxen.js": `${(jsSize / 1024).toFixed(1)}KB`,
        "noxen.min.js": `${(minJsSize / 1024).toFixed(1)}KB`,
    },
    "cdn": {
        "css": "https://cdn.jsdelivr.net/npm/noxen-css@2/dist/noxen.min.css",
        "js": "https://cdn.jsdelivr.net/npm/noxen-css@2/dist/noxen.min.js"
    }
};
write('dist/build-manifest.json', JSON.stringify(manifest, null, 2));

const total = (minCssSize + minJsSize) / 1024;
console.log(`\n✅ Build complete! Total minified: ${total.toFixed(1)} KB\n`);
