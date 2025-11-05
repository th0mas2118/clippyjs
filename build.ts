/**
 * Bun native build script
 * Builds the TypeScript project using Bun's native bundler
 */

import { build } from 'bun';
import { rmSync, mkdirSync } from 'fs';
import { join } from 'path';

// Clean dist folder
try {
  rmSync('dist', { recursive: true, force: true });
} catch (e) {
  // Ignore if doesn't exist
}

mkdirSync('dist', { recursive: true });

console.log('🔨 Building ClippyJS with Bun...\n');

// Build configurations
const builds = [
  {
    name: 'Core (ESM)',
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    format: 'esm',
    target: 'browser',
    naming: 'index.js',
  },
  {
    name: 'Core (CommonJS)',
    entrypoints: ['./src/index.ts'],
    outdir: './dist',
    format: 'cjs',
    target: 'node',
    naming: 'index.cjs',
  },
  {
    name: 'Plugin (ESM)',
    entrypoints: ['./src/plugin/index.ts'],
    outdir: './dist/plugin',
    format: 'esm',
    target: 'browser',
    naming: 'index.js',
  },
  {
    name: 'Plugin (CommonJS)',
    entrypoints: ['./src/plugin/index.ts'],
    outdir: './dist/plugin',
    format: 'cjs',
    target: 'node',
    naming: 'index.cjs',
  },
  {
    name: 'Vue (ESM)',
    entrypoints: ['./src/vue/index.ts'],
    outdir: './dist/vue',
    format: 'esm',
    target: 'browser',
    naming: 'index.js',
    external: ['vue'],
  },
  {
    name: 'Vue (CommonJS)',
    entrypoints: ['./src/vue/index.ts'],
    outdir: './dist/vue',
    format: 'cjs',
    target: 'node',
    naming: 'index.cjs',
    external: ['vue'],
  },
];

// Run builds
let success = 0;
let failed = 0;

for (const config of builds) {
  try {
    console.log(`📦 Building ${config.name}...`);

    await build({
      entrypoints: config.entrypoints,
      outdir: config.outdir,
      format: config.format as 'esm' | 'cjs',
      target: config.target as 'browser' | 'node',
      minify: true,
      sourcemap: 'external',
      external: config.external || [],
      naming: config.naming,
    });

    console.log(`   ✅ ${config.name} built successfully\n`);
    success++;
  } catch (error) {
    console.error(`   ❌ ${config.name} failed:`, error);
    failed++;
  }
}

// Generate TypeScript declarations
console.log('📝 Generating TypeScript declarations...');
const tscResult = Bun.spawnSync(['bun', 'x', 'tsc', '--emitDeclarationOnly']);

if (tscResult.exitCode === 0) {
  console.log('   ✅ Type declarations generated\n');
  success++;
} else {
  console.error('   ⚠️  Type declarations failed (non-blocking)\n');
  console.error(tscResult.stderr.toString());
}

// Summary
console.log('\n' + '='.repeat(50));
console.log(`✨ Build complete!`);
console.log(`   ✅ Success: ${success}`);
if (failed > 0) {
  console.log(`   ❌ Failed: ${failed}`);
}
console.log('='.repeat(50));

if (failed > 0) {
  process.exit(1);
}
