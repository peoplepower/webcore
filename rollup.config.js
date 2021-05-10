import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import sourcemaps from 'rollup-plugin-sourcemaps';
import {terser} from 'rollup-plugin-terser';
import pkg from './package.json';

const tsConfig = {
  tsconfig: './tsconfig.bundle.json',
  clean: true,
  check: false,
  useTsconfigDeclarationDir: true
}

export default [
  // Browser-friendly UMD build
  {
    input: 'src/ppc-webcore.ts',
    // TODO another bundle without `external` to include 'axios', 'qs' to the build
    external: ['axios', 'qs'], // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    plugins: [
      // Allow node_modules resolution, so you can use 'external' to control which external modules to include in the bundle
      nodeResolve(), // so Rollup can find 'axios' and 'qs'
      commonjs(), // so Rollup can convert 'axios' and 'qs' to an ES module
      typescript(tsConfig), // so Rollup can convert TypeScript to JavaScript
      terser(), // so Rollup can minify the codebase
      sourcemaps() // Resolve source maps to the original source
    ],
    output: {
      sourcemap: true,
      name: 'ppcWebcore',
      file: pkg.browser,
      format: 'umd'
    }
  },

  // CommonJS (for Node) build.
  {
    input: 'src/ppc-webcore.ts',
    external: ['axios', 'qs'], // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    plugins: [
      typescript(tsConfig), // so Rollup can convert TypeScript to JavaScript
      sourcemaps() // Resolve source maps to the original source
    ],
    output: {
      sourcemap: true,
      file: pkg.main,
      format: 'cjs'
    }
  },

  // ES module (for bundlers) build.
  {
    input: 'src/ppc-webcore.ts',
    external: ['axios', 'qs'], // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    plugins: [
      typescript(tsConfig), // so Rollup can convert TypeScript to JavaScript
      sourcemaps() // Resolve source maps to the original source
    ],
    output: {
      sourcemap: true,
      file: pkg.module,
      format: 'es'
    }
  },

  // ES module for React Native
  {
    input: 'src/ppc-webcore-rn.ts',
    external: ['axios', 'qs', 'react-native'], // Indicate here external modules you don't wanna include in your bundle (i.e.: 'lodash')
    plugins: [
      typescript(tsConfig), // so Rollup can convert TypeScript to JavaScript
      sourcemaps() // Resolve source maps to the original source
    ],
    output: {
      sourcemap: true,
      file: pkg.reactNative,
      format: 'es'
    }
  }
]
