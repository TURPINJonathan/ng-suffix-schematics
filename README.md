# Angular Suffix Schematics

> Angular CLI schematics that automatically add proper suffixes (`.component`, `.service`, `.pipe`, etc.) to file names and class names in Angular 20+

[![npm version](https://badge.fury.io/js/%40turpinjonathan%2Fng-suffix-schematics.svg)](https://www.npmjs.com/package/@turpinjonathan/ng-suffix-schematics)
[![CI](https://github.com/TURPINJonathan/ng-suffix-schematics/actions/workflows/ci.yml/badge.svg)](https://github.com/TURPINJonathan/ng-suffix-schematics/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

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
npm install --save-dev @turpinjonathan/ng-suffix-schematics
```

Or with yarn:

```bash
yarn add --dev @turpinjonathan/ng-suffix-schematics
```

## ⚙️ Configuration

After installation, configure your `angular.json` to use these schematics by default:

### 1. Add the schematic collection

In your `angular.json`, add the collection to the CLI configuration:

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

### 2. Configure schematic options (optional but recommended)

Add configuration for each schematic in your project's `schematics` section. Use the full path with the package name:

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
        },
        "@turpinjonathan/ng-suffix-schematics:directive": {
          "prefix": "app"
        },
        "@turpinjonathan/ng-suffix-schematics:pipe": {
          "flat": false
        }
      }
    }
  }
}
```

## 🎯 Usage

Use Angular CLI commands as usual:

```bash
# Generate a component
ng g c my-component
ng generate component my-component

# Generate a service
ng g s my-service
ng generate service my-service

# Generate a directive
ng g d my-directive
ng generate directive my-directive

# Generate a pipe
ng g p my-pipe
ng generate pipe my-pipe

# Generate a guard
ng g g my-guard
ng generate guard my-guard

# Generate an interceptor
ng generate interceptor my-interceptor

# Generate a resolver
ng g r my-resolver
ng generate resolver my-resolver
```

## ✨ Features

- ✅ **Components**: Generates `name.component.ts` with `export class NameComponent`
- ✅ **Services**: Generates `name.service.ts` with `export class NameService`
- ✅ **Directives**: Generates `name.directive.ts` with `export class NameDirective`
- ✅ **Pipes**: Generates `name.pipe.ts` with `export class NamePipe`
- ✅ **Guards**: Generates `name.guard.ts` with `export class NameGuard`
- ✅ **Interceptors**: Generates `name.interceptor.ts` with `export class NameInterceptor`
- ✅ **Resolvers**: Generates `name.resolver.ts` with `export class NameResolver`
- ✅ Respects all Angular CLI configuration options (prefix, style, changeDetection, etc.)
- ✅ Works with nested paths: `ng g c features/admin/dashboard`
- ✅ Compatible with Angular 20+

## 🔧 Supported Options

All standard Angular CLI options are supported:

### Component Options
- `--prefix` - Selector prefix
- `--style` - Style file extension (css, scss, sass, less)
- `--skip-tests` - Skip creating spec files
- `--inline-style` - Include styles inline
- `--inline-template` - Include template inline
- `--standalone` - Create standalone component
- `--change-detection` - Change detection strategy
- `--flat` - Create files at top level

### Service Options
- `--flat` - Create at top level
- `--skip-tests` - Skip creating spec files

### Directive/Pipe Options
- `--prefix` - Directive selector prefix
- `--flat` - Create at top level
- `--skip-tests` - Skip creating spec files
- `--standalone` - Create standalone directive/pipe

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
        "@turpinou/ng-suffix-schematics:component": {
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

## 🧪 Testing

This package includes **27 comprehensive unit tests** to ensure reliability. All tests are automatically run on every push via GitHub Actions CI/CD.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more details.

## 📄 License

MIT © Jonathan TURPIN

## 🐛 Issues

Found a bug or have a suggestion? [Open an issue](https://github.com/TURPINJonathan/ng-suffix-schematics/issues)

## ⭐ Show Your Support

Give a ⭐️ if this project helped you!
