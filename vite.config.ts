import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    tsconfigRaw: {
      compilerOptions: {
        importsNotUsedAsValues: 'preserve',
      },
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/webcore.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => format === 'es' ? 'webcore.esm.js' : 'webcore.cjs.js',
    },
    minify: false,
    sourcemap: true,
    target: 'es2020',
    outDir: 'dist',
    rollupOptions: {
      external: ['axios', 'qs'],
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
