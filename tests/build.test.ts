import { describe, test, expect } from 'bun:test';
import { existsSync, readFileSync, statSync } from 'fs';
import path from 'path';

const DIST = path.resolve(import.meta.dir, '..', 'dist');
const CJS_BUNDLE = path.join(DIST, 'webcore.cjs.js');
const ESM_BUNDLE = path.join(DIST, 'webcore.esm.js');
const TYPES_ENTRY = path.join(DIST, 'types', 'webcore.d.ts');

const EXPECTED_EXPORTS = [
  'WebCore',
  'WebCoreApis',
  'WebCoreServices',
  'WebCoreDals',
  'injectable',
  'inject',
  'container',
  'Container',
];

// ---------------------------------------------------------------------------
// Build output file generation
// ---------------------------------------------------------------------------
describe('Build output', () => {
  test('CJS bundle exists and is non-empty', () => {
    expect(existsSync(CJS_BUNDLE)).toBe(true);
    expect(statSync(CJS_BUNDLE).size).toBeGreaterThan(0);
  });

  test('ESM bundle exists and is non-empty', () => {
    expect(existsSync(ESM_BUNDLE)).toBe(true);
    expect(statSync(ESM_BUNDLE).size).toBeGreaterThan(0);
  });

  test('TypeScript declaration entry file exists', () => {
    expect(existsSync(TYPES_ENTRY)).toBe(true);
    expect(statSync(TYPES_ENTRY).size).toBeGreaterThan(0);
  });

  test('source maps are generated alongside bundles', () => {
    expect(existsSync(`${CJS_BUNDLE}.map`)).toBe(true);
    expect(existsSync(`${ESM_BUNDLE}.map`)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// CommonJS bundle structure
// ---------------------------------------------------------------------------
describe('CJS bundle', () => {
  const cjsContent = readFileSync(CJS_BUNDLE, 'utf-8');

  test('uses module.exports via __toCommonJS wrapper', () => {
    expect(cjsContent).toContain('module.exports');
  });

  for (const name of EXPECTED_EXPORTS) {
    test(`exports ${name}`, () => {
      // Bun CJS bundles declare exports via __export(target, { name: () => binding })
      expect(cjsContent).toContain(`${name}: () => ${name}`);
    });
  }

  test('references external dependency axios via require()', () => {
    expect(cjsContent).toContain('require("axios")');
  });

  test('references external dependency qs via require()', () => {
    expect(cjsContent).toContain('require("qs")');
  });

  test('contains WebCore class with constructor, addConfig, and setEnvironment', () => {
    expect(cjsContent).toMatch(/class WebCore\s*\{/);
    expect(cjsContent).toContain('addConfig(environment');
    expect(cjsContent).toContain('setEnvironment(environment');
  });

  test('contains DI decorator registrations for all core classes', () => {
    expect(cjsContent).toContain('injectable("WebCore")');
    expect(cjsContent).toContain('injectable("WebCoreApis")');
    expect(cjsContent).toContain('injectable("WebCoreServices")');
    expect(cjsContent).toContain('injectable("WebCoreDals")');
  });

  test('contains inject() calls for all service bindings', () => {
    const expectedBindings = [
      'AuthService', 'OperationTokenService', 'CloudConfigService',
      'OfflineService', 'WeatherService', 'UserService', 'DeviceService',
      'LocationService', 'Logger', 'UserLocalStorage', 'WcStorage',
      'SystemPropertiesService', 'DeviceStreamingService', 'MessagingService',
      'NarrativeService', 'ProfessionalMonitoringService', 'RulesService',
      'SubscriptionsService', 'BotService', 'StoriesService', 'FilesService',
      'QueryService', 'QuestionsService',
    ];
    for (const binding of expectedBindings) {
      expect(cjsContent).toContain(`inject("${binding}")`);
    }
  });
});

// ---------------------------------------------------------------------------
// ES Module bundle structure
// ---------------------------------------------------------------------------
describe('ESM bundle', () => {
  const esmContent = readFileSync(ESM_BUNDLE, 'utf-8');

  test('uses native export syntax', () => {
    expect(esmContent).toContain('export {');
  });

  for (const name of EXPECTED_EXPORTS) {
    test(`exports ${name}`, () => {
      // ESM named exports appear in the export block
      expect(esmContent).toMatch(new RegExp(`export\\s*\\{[^}]*\\b${name}\\b`));
    });
  }

  test('imports external dependency axios via native import', () => {
    expect(esmContent).toMatch(/from\s+["']axios["']/);
  });

  test('imports external dependency qs via native import', () => {
    expect(esmContent).toMatch(/from\s+["']qs["']/);
  });

  test('contains WebCore class with constructor, addConfig, and setEnvironment', () => {
    expect(esmContent).toMatch(/class WebCore\s*\{/);
    expect(esmContent).toContain('addConfig(environment');
    expect(esmContent).toContain('setEnvironment(environment');
  });

  test('contains DI decorator registrations for all core classes', () => {
    expect(esmContent).toContain('injectable("WebCore")');
    expect(esmContent).toContain('injectable("WebCoreApis")');
    expect(esmContent).toContain('injectable("WebCoreServices")');
    expect(esmContent).toContain('injectable("WebCoreDals")');
  });

  test('contains inject() calls for all DAL bindings', () => {
    const expectedDals = [
      'AppApiDal', 'AppApiOAuthDal', 'AppApiReportsDal',
      'BotApiDal', 'DeviceStreamingApiDal',
    ];
    for (const dal of expectedDals) {
      expect(esmContent).toContain(`inject("${dal}")`);
    }
  });
});

// ---------------------------------------------------------------------------
// TypeScript declaration files
// ---------------------------------------------------------------------------
describe('TypeScript declarations', () => {
  const dtsContent = readFileSync(TYPES_ENTRY, 'utf-8');

  test('declares WebCore class', () => {
    expect(dtsContent).toContain('export declare class WebCore');
  });

  test('declares WebCoreApis class', () => {
    expect(dtsContent).toContain('export declare class WebCoreApis');
  });

  test('declares WebCoreServices class', () => {
    expect(dtsContent).toContain('export declare class WebCoreServices');
  });

  test('declares WebCoreDals class', () => {
    expect(dtsContent).toContain('export declare class WebCoreDals');
  });

  test('re-exports DI module types', () => {
    expect(dtsContent).toContain("export * from './modules/common/di'");
  });

  test('WebCore declares public api, services, and dals members', () => {
    expect(dtsContent).toContain('api: WebCoreApis');
    expect(dtsContent).toContain('services: WebCoreServices');
    expect(dtsContent).toContain('dals: WebCoreDals');
  });

  test('WebCore declares constructor with optional environment and config', () => {
    expect(dtsContent).toContain('constructor(environment?: Environment, config?: WebCoreConfig)');
  });

  test('WebCore declares addConfig and setEnvironment methods', () => {
    expect(dtsContent).toContain('addConfig(environment: Environment, config: WebCoreConfig): void');
    expect(dtsContent).toContain('setEnvironment(environment: Environment): void');
  });

  test('WebCoreServices declares all expected service members', () => {
    const expectedServices = [
      'auth: AuthService',
      'operationToken: OperationTokenService',
      'cloudConfig: CloudConfigService',
      'offline: OfflineService',
      'weather: WeatherService',
      'user: UserService',
      'device: DeviceService',
      'location: LocationService',
      'logger: Logger',
      'userLocalStorage: UserLocalStorage',
      'localStorage: WcStorage',
      'systemProperties: SystemPropertiesService',
      'deviceStreaming: DeviceStreamingService',
      'messaging: MessagingService',
      'narrative: NarrativeService',
      'professionalMonitoring: ProfessionalMonitoringService',
      'rules: RulesService',
      'subscriptions: SubscriptionsService',
      'bots: BotService',
      'stories: StoriesService',
      'files: FilesService',
      'query: QueryService',
      'questions: QuestionsService',
    ];
    for (const member of expectedServices) {
      expect(dtsContent).toContain(member);
    }
  });

  test('WebCoreDals declares all expected DAL members', () => {
    const expectedDals = [
      'appApiDal: AppApiDal',
      'appApiOAuthDal: AppApiOAuthDal',
      'appApiReportsDal: AppApiReportsDal',
      'botApiDal: BotApiDal',
      'deviceStreamingApiDal: DeviceStreamingApiDal',
    ];
    for (const member of expectedDals) {
      expect(dtsContent).toContain(member);
    }
  });

  test('DI module declarations exist', () => {
    const diDts = path.join(DIST, 'types', 'modules', 'common', 'di.d.ts');
    expect(existsSync(diDts)).toBe(true);
    const diContent = readFileSync(diDts, 'utf-8');
    expect(diContent).toContain('export declare class Container');
    expect(diContent).toContain('export declare function injectable');
    expect(diContent).toContain('export declare function inject');
  });
});

// ---------------------------------------------------------------------------
// ES2020 target compliance (Bun compiles to ES2020)
// ---------------------------------------------------------------------------
describe('ES2020 target compliance', () => {
  const esmContent = readFileSync(ESM_BUNDLE, 'utf-8');
  const cjsContent = readFileSync(CJS_BUNDLE, 'utf-8');

  test('bundles use optional chaining or nullish coalescing (ES2020 features)', () => {
    const usesOptionalChaining = esmContent.includes('?.') || cjsContent.includes('?.');
    const usesNullishCoalescing = esmContent.includes('??') || cjsContent.includes('??');
    expect(usesOptionalChaining || usesNullishCoalescing).toBe(true);
  });

  test('bundles do not contain ES2015-era __awaiter polyfill', () => {
    expect(esmContent).not.toContain('__awaiter');
    expect(cjsContent).not.toContain('__awaiter');
  });

  test('ESM bundle uses native import/export syntax', () => {
    expect(esmContent).toContain('export {');
    expect(esmContent).toMatch(/import\s/);
  });

  test('CJS bundle uses module.exports', () => {
    expect(cjsContent).toContain('module.exports');
  });

  test('external dependencies (axios, qs) are not bundled', () => {
    expect(esmContent).toMatch(/from\s+["']axios["']/);
    expect(esmContent).toMatch(/from\s+["']qs["']/);
    expect(cjsContent).toContain('require("axios")');
    expect(cjsContent).toContain('require("qs")');
  });

  test('SDK DI system compiles and runs under Bun ES2020 runtime', async () => {
    // Import the DI module TypeScript source directly.
    // Bun transpiles it natively, proving the ES2020 TypeScript compiles and runs.
    const { Container, container, injectable, inject } = await import('../src/modules/common/di');

    expect(typeof Container).toBe('function');
    expect(typeof injectable).toBe('function');
    expect(typeof inject).toBe('function');
    expect(container).toBeInstanceOf(Container);

    // Verify the DI container works: register a class and resolve it
    @injectable('TestService')
    class TestService {
      greet() { return 'hello'; }
    }

    const instance = container.get<TestService>('TestService');
    expect(instance).toBeInstanceOf(TestService);
    expect(instance.greet()).toBe('hello');

    // Verify singleton behavior
    expect(container.get('TestService')).toBe(instance);
  });

  test('SDK environment module compiles and runs under Bun ES2020 runtime', async () => {
    const { Envir } = await import('../src/modules/environment/environment');
    const { container } = await import('../src/modules/common/di');

    const envir = container.get<InstanceType<typeof Envir>>('Envir');
    expect(envir).toBeDefined();
    expect(envir.environment).toBe('dev'); // Default environment

    envir.environment = 'prod';
    expect(envir.environment).toBe('prod');
  });
});
