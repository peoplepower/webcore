import { describe, test, expect } from 'vitest';
import { existsSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const DIST = join(import.meta.dirname, '..', 'dist');
const TYPES_DIR = join(DIST, 'types');

describe('Build output created', () => {
  test('Folder \'dist\' created with output', () => {
    expect(existsSync(DIST)).toBe(true);
    expect(readdirSync(DIST).length).toBeGreaterThan(0);
  });

  test('CJS bundle exists and is non-empty', () => {
    const cjsBundle = join(DIST, 'webcore.cjs.js');
    expect(existsSync(cjsBundle)).toBe(true);
    expect(statSync(cjsBundle).size).toBeGreaterThan(0);
  });

  test('ESM bundle exists and is non-empty', () => {
    const esmBundle = join(DIST, 'webcore.esm.js');
    expect(existsSync(esmBundle)).toBe(true);
    expect(statSync(esmBundle).size).toBeGreaterThan(0);
  });

  test('Bundle source maps exist', () => {
    expect(existsSync(join(DIST, 'webcore.cjs.js.map'))).toBe(true);
    expect(existsSync(join(DIST, 'webcore.esm.js.map'))).toBe(true);
  });

  test('Types compiled with .d.ts, .js, and .js.map files', () => {
    expect(existsSync(TYPES_DIR)).toBe(true);

    // Check for entry point files
    expect(existsSync(join(TYPES_DIR, 'webcore.d.ts'))).toBe(true);
    expect(existsSync(join(TYPES_DIR, 'webcore.js'))).toBe(true);
    expect(existsSync(join(TYPES_DIR, 'webcore.js.map'))).toBe(true);

    // Verify all three file types exist in types directory
    const files = readdirSync(TYPES_DIR, { recursive: true, withFileTypes: true });
    const hasDeclarations = files.some(f => f.isFile() && f.name.endsWith('.d.ts'));
    const hasJavaScript = files.some(f => f.isFile() && f.name.endsWith('.js') && !f.name.endsWith('.map'));
    const hasSourceMaps = files.some(f => f.isFile() && f.name.endsWith('.js.map'));

    expect(hasDeclarations).toBe(true);
    expect(hasJavaScript).toBe(true);
    expect(hasSourceMaps).toBe(true);
  });
});
