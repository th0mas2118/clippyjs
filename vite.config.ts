import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    lib: {
      entry: {
        // Main entry
        index: resolve(__dirname, 'src/index.ts'),
        // Plugin entry
        plugin: resolve(__dirname, 'src/plugin/index.ts'),
        // Vue entry
        vue: resolve(__dirname, 'src/vue/index.ts'),
      },
      name: 'ClippyJS',
      formats: ['es', 'cjs'],
      fileName: (format, entryName) => {
        const ext = format === 'es' ? 'js' : 'cjs';
        return `${entryName}.${ext}`;
      },
    },
    rollupOptions: {
      // Externalize peer dependencies
      external: ['vue'],
      output: {
        // Preserve module structure
        preserveModules: false,
        exports: 'named',
        // Global variable names for UMD builds
        globals: {
          vue: 'Vue',
        },
      },
    },
    sourcemap: true,
    // Target modern browsers
    target: 'es2020',
    // Minimize output
    minify: 'esbuild',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
