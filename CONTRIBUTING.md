# Contributing to ng-suffix-schematics

Thank you for your interest in contributing! 🎉

## Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/TURPINJonathan/ng-suffix-schematics.git
cd ng-suffix-schematics
```

2. **Install dependencies**
```bash
npm install
```

3. **Build the project**
```bash
npm run build
```

4. **Run tests**
```bash
npm test
```

## Project Structure

```
ng-suffix-schematics/
├── utils/              # Shared utilities and factories
│   ├── index.ts       # Main utility functions
│   └── index.spec.ts  # Unit tests
├── component/         # Component schematic
├── service/           # Service schematic
├── directive/         # Directive schematic
├── pipe/              # Pipe schematic
├── guard/             # Guard schematic
├── interceptor/       # Interceptor schematic
├── resolver/          # Resolver schematic
└── collection.json    # Schematics configuration
```

## Git Workflow

This repository follows a strict branch protection model:

### Branch Structure

- **`main`** - Production branch (protected)
  - Only accepts Pull Requests from `develop`
  - No direct pushes allowed
  - Requires maintainer approval
  - Tagged with version numbers
  - Always matches what's published on npm

- **`develop`** - Integration/staging branch (protected)
  - Only accepts Pull Requests from `feature/*` branches
  - No direct pushes allowed
  - Requires maintainer approval
  - Used for release preparation and testing

- **`feature/*`** - Feature branches
  - Created from `main` (stable base)
  - Merged to `develop` via PR
  - Deleted after merge

### Making Changes

1. **Fork and clone the repository**
```bash
git clone https://github.com/TURPINJonathan/ng-suffix-schematics.git
cd ng-suffix-schematics
```

2. **Create a feature branch from main**
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

2. **Make your changes**
   - Update code in the appropriate schematic folder
   - Add/update tests in `*.spec.ts` files
   - Update documentation in README.md if needed

3. **Test your changes**
```bash
# Build and test
npm run build
npm test

# Test in a real Angular project
cd /path/to/test-project
npm install --save-dev /path/to/ng-suffix-schematics
ng g c test-component
```

4. **Commit your changes**
```bash
git add .
git commit -m "feat: your feature description"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `test:` - Test changes
- `refactor:` - Code refactoring
- `chore:` - Build process or auxiliary tools

5. **Push and create a Pull Request to development**
```bash
git push origin feature/your-feature-name
```

6. **Create Pull Request**
- Go to GitHub and create a PR
- **Target branch must be `develop`**
- Fill in the PR template
- Wait for maintainer review and approval

⚠️ **Important:** Never create PRs directly to `main`. All contributions must go through `develop` first.

## Code Guidelines

- ✅ Use TypeScript strict mode
- ✅ Add JSDoc comments for public functions
- ✅ Write tests for new functionality
- ✅ Keep functions small and focused
- ✅ Use the factory pattern for new schematics
- ✅ Follow existing code style

## Testing

### Running Tests

```bash
# Run all tests
npm test

# Build the project only
npm run build

# Run Jasmine directly
npx jasmine --config=spec/support/jasmine.json
```

The `npm test` command:
1. Compiles TypeScript (`npm run build`)
2. Executes all Jasmine tests

### Test Structure

```
ng-suffix-schematics/
├── utils/
│   ├── path-utils.spec.ts        # Path manipulation tests
│   └── tree-transforms.spec.ts   # File tree transformation tests
├── spec/
│   └── support/
│       └── jasmine.json          # Jasmine configuration
└── package.json
```

### Test Coverage

This package includes **27 comprehensive unit tests** covering:

#### Path Utilities (`path-utils.spec.ts`) - 16 tests

**extractBaseName** (6 tests):
- Simple paths, nested paths, deep nesting
- Empty strings and special characters

**buildFilePath** (10 tests):
- Flat and nested structures
- Default paths and custom paths
- CamelCase normalization
- All schematic types (component, service, pipe, guard, interceptor)

#### Tree Transformations (`tree-transforms.spec.ts`) - 11 tests

**removeDuplicateSuffix** (5 tests):
- File renaming (dash → dot format)
- Spec file updates with import rewrites
- Edge cases (missing files, CamelCase)

**ensureClassSuffix** (6 tests):
- Class name suffix addition
- Duplicate suffix prevention
- Handles implements/extends clauses
- Multiple spaces normalization

**Test Results:** 27 specs, 0 failures, 100% success rate ✅

### Manual Testing

Test your changes in a real Angular project:

```bash
# In your schematic project
npm run build
npm pack

# In a test Angular project
npm install /path/to/tarball.tgz
ng generate component test
```

## CI/CD

All pull requests are automatically tested via GitHub Actions:
- ✅ Build verification
- ✅ Unit tests
- ✅ TypeScript compilation check
- ✅ Tests on Node 18.x, 20.x, and 22.x

## Branch Protection Rules

This repository enforces the following protections:

### Main Branch
- ✅ Require pull request reviews before merging
- ✅ Require approval from maintainer (@TURPINJonathan)
- ✅ Only accept PRs from `develop` branch
- ✅ Require status checks to pass (CI tests)
- ❌ No direct pushes
- ❌ No force pushes
- ❌ No branch deletion

### Develop Branch
- ✅ Require pull request reviews before merging
- ✅ Require approval from maintainer (@TURPINJonathan)
- ✅ Only accept PRs from `feature/*` branches
- ✅ Require status checks to pass (CI tests)
- ❌ No direct pushes
- ❌ No force pushes

## Release Process (Maintainer Only)

1. **Integrate features:**
   - Merge approved `feature/*` PRs to `develop`
   - Test integration on `develop` branch

2. **Prepare release in develop:**
   ```bash
   git checkout develop
   npm version patch|minor|major  # Bumps version
   # Update CHANGELOG.md with changes
   git add .
   git commit -m "chore: prepare release vX.Y.Z"
   git push origin develop
   ```

3. **Create release PR:**
   - Create PR from `develop` to `main`
   - Review all changes
   - Ensure CI passes

4. **Publish release:**
   ```bash
   git checkout main
   git pull origin main
   npm publish --access public
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```

5. **Sync branches:**
   ```bash
   # Merge main back to develop to sync version numbers
   git checkout develop
   git merge main
   git push origin develop
   ```

## Questions?

Feel free to open an issue for:
- 🐛 Bug reports
- 💡 Feature requests
- 📚 Documentation improvements
- ❓ Questions about the code

Thank you for contributing! 🙏
