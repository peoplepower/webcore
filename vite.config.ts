import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import pkg from './package.json' with {type: 'json'};

type BuildFormat = 'es' | 'cjs' | 'umd';

// Get the file name for a given build format.
const getFileNameForFormat = (format: BuildFormat): string => {
  const ext = {
    'es': 'module', // ES module (for bundlers)
    'cjs': 'main', // CommonJS (for Node)
    'umd': 'browser', // Browser-friendly UMD
  };
  const key = ext[format];
  const value = pkg[key as keyof typeof pkg];

  if (typeof value !== 'string' || value.length === 0) {
    throw new Error(`Missing or invalid package.json field "${key}" for build format "${format}"`);
  }

  return value.replace('dist/', '');
}

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/webcore.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => getFileNameForFormat(format as BuildFormat),
    },
    minify: false,
    sourcemap: true,
    rolldownOptions: {
      external: ['axios', 'qs'],
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
