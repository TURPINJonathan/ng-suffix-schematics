# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2025-12-04

<details>
<summary>View changes</summary>

### Added
- **ng-add schematic** for automatic installation and configuration
  - Automatically configures `angular.json` with schematicCollections
  - Places package first in collections for priority
  - Prevents duplicate entries
  - One-command installation: `ng add @turpinjonathan/ng-suffix-schematics`
- **Comprehensive test suite**: 99 tests covering all schematics
  - 28 tests for utilities (path manipulation & tree transformations)
  - 11 tests for ng-add schematic
  - 60 tests for all schematics (component, service, pipe, directive, guard, interceptor, resolver)
  - Tests for edge cases: duplicate suffixes, nested paths, special characters, all CLI options

### Changed
- **Documentation improvements**
  - Simplified README with collapsible sections
  - Encouraged use of `ng add` as recommended installation method
  - Added detailed supported options section
  - Streamlined CONTRIBUTING.md (reduced from ~400 to ~150 lines)
- **Package optimization**
  - Reduced package size from 11.0 kB to 8.1 kB (-26%)
  - Cleaned up published files

### Fixed
- Test coverage for all schematic types
- Edge case handling for functional guards/interceptors/resolvers (Angular 20+)

</details>

## [1.0.0] - 2024-12-03

<details>
<summary>View changes</summary>

### Added
- Initial release
- Angular 20+ support for suffix restoration
- **Component schematic** - Generates `name.component.ts` with `NameComponent` class
- **Service schematic** - Generates `name.service.ts` with `NameService` class
- **Directive schematic** - Generates `name.directive.ts` with `NameDirective` class
- **Pipe schematic** - Generates `name.pipe.ts` with `NamePipe` class
- **Guard schematic** - Generates `name.guard.ts` with functional guard
- **Interceptor schematic** - Generates `name.interceptor.ts` with functional interceptor
- **Resolver schematic** - Generates `name.resolver.ts` with functional resolver
- Automatic duplicate suffix removal (e.g., `pipe-pipe.ts` → `pipe.pipe.ts`)
- Support for all standard Angular CLI options
- Nested path support
- CI/CD with GitHub Actions
- Multi-version testing (Node.js 18.x, 20.x, 22.x)
- Git-Flow workflow with branch protection

### Documentation
- Comprehensive README with installation and usage instructions
- Contributing guidelines with Git workflow
- MIT License
- GitHub templates (PR template, issue templates)

</details>

---

[1.1.0]: https://github.com/TURPINJonathan/ng-suffix-schematics/compare/v1.0.0...v1.1.0
[1.0.0]: https://github.com/TURPINJonathan/ng-suffix-schematics/releases/tag/v1.0.0
