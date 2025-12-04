# Angular Suffix Schematics
[![npm version](https://badge.fury.io/js/%40turpinjonathan%2Fng-suffix-schematics.svg)](https://www.npmjs.com/package/@turpinjonathan/ng-suffix-schematics)
[![CI](https://github.com/TURPINJonathan/ng-suffix-schematics/actions/workflows/ci.yml/badge.svg)](https://github.com/TURPINJonathan/ng-suffix-schematics/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
📋 [Changelog](CHANGELOG.md) • 🤝 [Contributing](CONTRIBUTING.md) • 🐛 [Report Issues](https://github.com/TURPINJonathan/ng-suffix-schematics/issues)

> Angular CLI schematics that automatically add proper suffixes (`.component`, `.service`, `.pipe`, etc.) to file names and class names in Angular 20+



## 🚀 Why?

Starting with Angular 20, the CLI changed its default behavior and no longer adds suffixes like `.component`, `.service`, etc., to file names and class names. This can make codebases harder to navigate and less consistent.

This package restores the classic Angular naming conventions by wrapping the official Angular schematics.

### Before (Angular 20 default)
```bash
ng g c my-component
# Creates: my-component/my-component.ts
# Class: MyComponent
```

### After (with this package)
```bash
ng g c my-component
# Creates: my-component/my-component.component.ts
# Class: MyComponentComponent
```

## 📦 Installation

```bash
ng add @turpinjonathan/ng-suffix-schematics
```

That's it! 🎉 The command will install the package and automatically configure your `angular.json`.

## 🔧 Manual Installation (not recommended)
<details>
<summary>Show installation steps</summary>


### 1. Install the package

```bash
npm install --save-dev @turpinjonathan/ng-suffix-schematics
# or
yarn add --dev @turpinjonathan/ng-suffix-schematics
```

### 2. Configure angular.json

Add the schematic collection to your `angular.json`:

```json
{
  "cli": {
    "schematicCollections": [
      "@turpinjonathan/ng-suffix-schematics",
      "@schematics/angular"
    ]
  }
}
```

### 3. Configure options (optional)

Add configuration for each schematic in your project's `schematics` section:

```json
{
  "projects": {
    "your-project": {
      "schematics": {
        "@turpinjonathan/ng-suffix-schematics:component": {
          "style": "scss",
          "standalone": true,
          "prefix": "app",
          "changeDetection": "OnPush"
        },
        "@turpinjonathan/ng-suffix-schematics:service": {
          "flat": false
        }
      }
    }
  }
}
```

</details>

## 🎯 Usage

Use Angular CLI commands as usual:

```bash
ng g c my-component      # Component
ng g s my-service        # Service
ng g d my-directive      # Directive
ng g p my-pipe           # Pipe
ng g g my-guard          # Guard
ng g interceptor my-int  # Interceptor
ng g r my-resolver       # Resolver
```

All standard Angular CLI options work: `--flat`, `--skip-tests`, `--standalone`, etc.

## 🔧 Supported Options
<details>
<summary>See all CLI options available</summary>

### Component Options
- `--prefix` - Selector prefix (e.g., `app`)
- `--style` - Style file extension (`css`, `scss`, `sass`, `less`)
- `--skip-tests` - Skip creating `.spec.ts` files
- `--inline-style` - Include styles inline in the component
- `--inline-template` - Include template inline in the component
- `--standalone` - Create a standalone component
- `--change-detection` - Change detection strategy (`Default` or `OnPush`)
- `--flat` - Create files at the top level instead of in a folder

### Service Options
- `--flat` - Create at the top level
- `--skip-tests` - Skip creating `.spec.ts` files

### Directive/Pipe Options
- `--prefix` - Directive/Pipe selector prefix
- `--flat` - Create at the top level
- `--skip-tests` - Skip creating `.spec.ts` files
- `--standalone` - Create a standalone directive/pipe

### Guard/Interceptor/Resolver Options
- `--flat` - Create at the top level
- `--skip-tests` - Skip creating `.spec.ts` files

**Example with options:**
```bash
ng g c my-component --flat --skip-tests --standalone
ng g c admin/dashboard --change-detection=OnPush --inline-template
ng g s api/auth --skip-tests
ng g p currency --standalone
```

</details>

## ✨ Features

- ✅ **Components**: Generates `name.component.ts` with `export class NameComponent`
- ✅ **Services**: Generates `name.service.ts` with `export class NameService`
- ✅ **Directives**: Generates `name.directive.ts` with `export class NameDirective`
- ✅ **Pipes**: Generates `name.pipe.ts` with `export class NamePipe`
- ✅ **Guards**: Generates `name.guard.ts` with functional guard (Angular 20+)
- ✅ **Interceptors**: Generates `name.interceptor.ts` with functional interceptor (Angular 20+)
- ✅ **Resolvers**: Generates `name.resolver.ts` with functional resolver (Angular 20+)
- ✅ Respects all Angular CLI configuration options (prefix, style, changeDetection, etc.)
- ✅ Works with nested paths: `ng g c features/admin/dashboard`
- ✅ Compatible with Angular 20+

## 📝 Example Angular.json Configuration

<details>
<summary>Click to expand full example</summary>

```json
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "cli": {
    "schematicCollections": [
      "@turpinjonathan/ng-suffix-schematics",
      "@schematics/angular"
    ]
  },
  "projects": {
    "my-app": {
      "projectType": "application",
      "schematics": {
        "@turpinjonathan/ng-suffix-schematics:component": {
          "style": "scss",
          "standalone": true,
          "prefix": "app",
          "flat": false,
          "skipTests": false,
          "inlineStyle": false,
          "inlineTemplate": false,
          "changeDetection": "OnPush"
        },
        "@turpinjonathan/ng-suffix-schematics:directive": {
          "standalone": true,
          "prefix": "app",
          "flat": false,
          "skipTests": false
        },
        "@turpinjonathan/ng-suffix-schematics:pipe": {
          "standalone": true,
          "flat": false,
          "skipTests": false
        },
        "@turpinjonathan/ng-suffix-schematics:service": {
          "flat": false,
          "skipTests": false
        },
        "@turpinjonathan/ng-suffix-schematics:guard": {
          "flat": false,
          "skipTests": false
        },
        "@turpinjonathan/ng-suffix-schematics:interceptor": {
          "flat": false,
          "skipTests": false
        },
        "@turpinjonathan/ng-suffix-schematics:resolver": {
          "flat": false,
          "skipTests": false
        }
      }
    }
  }
}
```

</details>

<details>
<summary>View test coverage details</summary>

## 🧪 Testing

**99 comprehensive tests** ensure reliability across all schematics:
- **28 tests** - Utilities (path manipulation & tree transformations)
- **11 tests** - ng-add schematic (automatic configuration)
- **60 tests** - All schematics (component, service, pipe, directive, guard, interceptor, resolver)

Test coverage includes:
- ✅ File generation with correct suffixes
- ✅ Class/function naming conventions
- ✅ Nested paths and special characters
- ✅ All CLI options (`flat`, `skipTests`, `standalone`, etc.)
- ✅ Edge cases (duplicate suffixes, type enforcement)

All tests run automatically on every push via GitHub Actions CI/CD with Node.js 18.x, 20.x, and 22.x.

</details>

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## 📄 License

MIT © Jonathan TURPIN

## 🐛 Issues

Found a bug or have a suggestion? [Open an issue](https://github.com/TURPINJonathan/ng-suffix-schematics/issues)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!
