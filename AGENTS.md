# Context for AI Agents

This file provides guidance to AI Agents like Claude Code, Gemini CLI, OpenCode, GitHub Copilot and others when working with code in this repository.

## Project Overview

WebCore is a TypeScript client SDK (`@peoplepower/webcore`) for the Care Daily Cloud API. It produces dual-format bundles (ESM + CJS) published to GitHub Packages.

## Commands

```bash
pnpm build # Clean dist/, build Vite bundles + TypeScript declarations
pnpm build:types # Generate TypeScript declarations only
pnpm test:build # Run build output integrity tests (vitest)
pnpm lint # Run code check with eslint
```

There is no lint command configured. Tests are in `tests/` and run via Vitest.

## Architecture

### Layered Design

The SDK uses a **four-layer architecture**, all wired together via a custom dependency injection system:

1. **WebCore** (`src/webcore.ts`) — Top-level entry point. Holds references to APIs, Services, and DALs. Accepts environment and config on construction.
2. **Services** (`src/data/services/`) — 21 business logic services (auth, devices, locations, messaging, etc.). Each is an `@injectable` singleton.
3. **APIs** (`src/data/api/`) — Three API clients: `AppApi` (main REST API with 28+ endpoint groups), `BotApi`, and `DeviceStreamingApi`.
4. **DALs** (`src/data/api/*/`) — Data access layers that handle raw HTTP requests (axios) and response interceptors.

### Dependency Injection

The DI system (`src/modules/common/di.ts`) is central to the codebase:

- `@injectable('Name')` — Class decorator that registers a constructor in the global `Container`
- `@inject('Name')` — Property decorator that lazily resolves a singleton from the container via a getter
- String identifiers are required (not optional) to survive minification
- All instances are **singletons** — first `container.get()` call creates the instance, subsequent calls return the same one
- The DI container and decorators are re-exported from the main entry point for use by consuming applications

### Infrastructure Modules (`src/modules/`)

- **environment/** — Environment switching (dev, test, prod) with per-environment config merging
- **tuner/** — Configuration management (`WebCoreConfig` interface)
- **logger/** — Multi-appender logger (console, localStorage, XHR) with configurable log levels per environment
- **localStorage/** and **userLocalStorage/** — Storage abstraction (pluggable for React Native AsyncStorage)
- **wsHub/** — WebSocket hub for data streaming

### Build Output

- Vite bundles to `dist/webcore.esm.js` and `dist/webcore.cjs.js` (with source maps)
- TypeScript declarations emitted per-file to `dist/types/`
- Target: ES2020. External deps (axios, qs) are not bundled
- Minification is disabled to preserve readability

## Key Conventions

- **Node**: `>=20.15.1 <21.0.0`, **pnpm** `10.29.3`
- TypeScript strict mode with `experimentalDecorators` and `emitDecoratorMetadata` enabled
- Every service/API/DAL class must use `@injectable('ClassName')` with a string identifier matching the class name
- `@inject()` always requires a string argument — never rely on type reflection
