import { resolve } from 'path';
import { defineConfig } from 'vitest/config';
import pkg from './package.json' with {type: 'json'};

const tsConfig = {
  tsconfig: './tsconfig.bundle.json',
  checkJs: false,
};

type BuildFormat = 'es' | 'cjs' | 'umd';

// Get the file name for a given build format.
const fileFormat = (format: BuildFormat): string => {
  const ext = {
    'es': 'module', // ES module (for bundlers)
    'cjs': 'main', // CommonJS (for Node)
    'umd': 'browser', // Browser-friendly UMD
  };
  return `${pkg[ext[format] as keyof typeof pkg]}`.replace('dist/', '');
}

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
      fileName: (format) => fileFormat(format as BuildFormat),
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
