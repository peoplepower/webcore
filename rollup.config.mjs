import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';
import pkg from './package.json' with {type: 'json'};

const tsConfig = {
  tsconfig: './tsconfig.bundle.json',
  checkJs: false,
};

export default command => {

  // Browser-friendly UMD build
  const umd = {
    input: 'src/ppc-webcore.ts',
    // TODO another bundle without `external` to include 'axios', 'qs' to the build
    external: ['axios', 'qs'], // Indicate here external modules you don't want to include in your bundle (i.e.: 'lodash')
    plugins: [
      // Allow node_modules resolution, so you can use 'external' to control which external modules to include in the bundle
      nodeResolve(), // so Rollup can find 'axios' and 'qs'
      commonjs(), // so Rollup can convert 'axios' and 'qs' to an ES module
      typescript(tsConfig), // so Rollup can convert TypeScript to JavaScript
      terser(), // so Rollup can minify the codebase
    ],
    output: {
      sourcemap: true,
      name: 'ppcWebcore',
      file: pkg.browser, // NOTE insert `"browser": "dist/ppc-webcore.umd.js",` to `package.json`
      format: 'umd'
    }
  };

  // CommonJS (for Node) build
  const cjs = {
    input: 'src/ppc-webcore.ts',
    external: ['axios', 'qs'], // Indicate here external modules you don't want to include in your bundle (i.e.: 'lodash')
    plugins: [
      typescript(tsConfig), // so Rollup can convert TypeScript to JavaScript
    ],
    output: {
      sourcemap: true,
      file: pkg.main,
      format: 'cjs',
    },
  };

  // ES module (for bundlers) build
  const esm = {
    input: 'src/ppc-webcore.ts',
    external: ['axios', 'qs'], // Indicate here external modules you don't want to include in your bundle (i.e.: 'lodash')
    plugins: [
      typescript(tsConfig), // so Rollup can convert TypeScript to JavaScript
    ],
    output: {
      sourcemap: true,
      file: pkg.module,
      format: 'es',
    },
  };

  // ES module for React Native
  const rn = {
    input: 'src/ppc-webcore-rn.ts',
    external: ['axios', 'qs', 'react-native', 'base-64'], // Indicate here external modules you don't want to include in your bundle (i.e.: 'lodash')
    plugins: [
      typescript(tsConfig), // so Rollup can convert TypeScript to JavaScript
    ],
    output: {
      sourcemap: true,
      file: pkg.reactNative, // NOTE insert `"reactNative": "dist/ppc-webcore.react-native.js",` to `package.json`
      format: 'es'
    }
  };

  return [
    cjs,
    esm,
    // umd,
    // rn,
  ];
};
