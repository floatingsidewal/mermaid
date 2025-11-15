#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { JSDOM } from 'jsdom';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup jsdom
const dom = new JSDOM('<!DOCTYPE html><html><body></body></html>', {
  runScripts: 'dangerously',
  resources: 'usable',
  url: 'http://localhost'
});

global.window = dom.window;
global.document = dom.window.document;
if (!global.navigator) {
  Object.defineProperty(global, 'navigator', {
    value: dom.window.navigator,
    writable: true,
    configurable: true
  });
}

// Import mermaid from the built package
const mermaidPath = join(__dirname, '../packages/mermaid/dist/mermaid.core.mjs');
const { default: mermaid } = await import(mermaidPath);

// Initialize mermaid
mermaid.initialize({
  startOnLoad: false,
  theme: 'default',
  securityLevel: 'loose'
});

const inputDir = join(__dirname, 'funnel-outputs');
const outputDir = join(__dirname, 'funnel-svgs');

// Create output directory
import { mkdirSync } from 'fs';
mkdirSync(outputDir, { recursive: true });

console.log('Rendering funnel diagrams to SVG...\n');

// Get all .mmd files
const mmdFiles = readdirSync(inputDir).filter(f => f.endsWith('.mmd'));

for (const file of mmdFiles) {
  const mmdPath = join(inputDir, file);
  const svgPath = join(outputDir, file.replace('.mmd', '.svg'));

  const diagramCode = readFileSync(mmdPath, 'utf8');

  try {
    const { svg } = await mermaid.render(`diagram-${file}`, diagramCode);
    writeFileSync(svgPath, svg);
    console.log(`✓ Rendered ${file} -> ${file.replace('.mmd', '.svg')}`);
  } catch (error) {
    console.error(`✗ Failed to render ${file}:`, error.message);
  }
}

console.log('\n✓ All SVG files created in scripts/funnel-svgs/');
