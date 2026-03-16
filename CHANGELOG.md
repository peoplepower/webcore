# Changelog

All notable changes to WebCore SDK will be documented in this file.

The format is based on [Keep a Changelog],
and this project adheres to [Semantic Versioning].

## [Unreleased]

### Changed
- User role types updated

## [3.1.3] - 2026-03-11

### Deprecated
- Remove unused `connections` state

## [3.1.2] - 2026-03-06

### Fixed
- Set package type to CommonJS (default) for compatibility

## [3.1.1] - 2026-03-04

### Added
- Location `connections` state notation

### Fixed
- Removed duplicats in [Survey Answers API](https://sboxall.peoplepowerco.com/cloud/apidocs/cloud.html#tag/Questions/operation/Get%20Survey%20Answers) response

## [3.1.0] - 2026-03-02

### Added
- Vitest for build output testing as `test:build` script

### Changed
- NodeJS updated to version 20.19.6
- Build system now using Vite (Rollup)
- GitHub Actions step for `test:build` in `dev` branch

<!-- Links -->
[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html

<!-- Versions -->
[unreleased]: https://github.com/peoplepower/webcore/compare/3.1.3...HEAD
[3.1.3]: https://github.com/peoplepower/webcore/compare/3.1.2..3.1.3
[3.1.2]: https://github.com/peoplepower/webcore/compare/3.1.1..3.1.2
[3.1.1]: https://github.com/peoplepower/webcore/compare/3.1.0...3.1.1
[3.1.0]: https://github.com/peoplepower/webcore/releases/tag/3.1.0
