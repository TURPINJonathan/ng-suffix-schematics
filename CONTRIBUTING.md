# Contributing to ng-suffix-schematics

Thank you for your interest in contributing! 🎉

## Development Setup

<details>
<summary>View setup instructions</summary>

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

</details>

## Project Structure

<details>
<summary>View project structure</summary>

```
ng-suffix-schematics/
├── utils/                    # Shared utilities and factories
├── ng-add/                   # ng-add schematic (auto-configuration)
├── component/service/pipe/   # Angular schematics (simple type forcing)
├── directive/guard/          # Angular schematics (complex with renaming)
├── interceptor/resolver/     # Angular schematics (complex with renaming)
└── collection.json           # Schematics registry

Each schematic folder contains:
  ├── index.ts         # Schematic implementation
  ├── index.spec.ts    # Integration tests
  └── schema.json      # Schema definition
```

</details>

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

<details>
<summary>View testing guide</summary>

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

### Test Coverage

**89 comprehensive tests** covering:
- ✅ **27 tests** - Utilities (path manipulation, tree transformations)
- ✅ **10 tests** - ng-add schematic (angular.json configuration)
- ✅ **52 tests** - All schematics (component, service, pipe, directive, guard, interceptor, resolver)

Each schematic is tested for:
- File generation with correct suffixes
- Class/function naming conventions
- Nested paths and special characters
- Options: `flat`, `skipTests`, `standalone`, etc.
- Edge cases: duplicate suffixes, type enforcement

Run `npm test` to execute all tests. All PRs must pass 100% of tests.

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

</details>

## CI/CD

All pull requests are automatically tested via GitHub Actions:
- ✅ Build verification & unit tests
- ✅ Multi-version testing (Node 18.x, 20.x, 22.x)
- ✅ Branch validation (features → develop → main)

## Release Process (Maintainer Only)

<details>
<summary>View release process</summary>

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

</details>

## Questions?

Feel free to open an issue for:
- 🐛 Bug reports
- 💡 Feature requests
- 📚 Documentation improvements
- ❓ Questions about the code

Thank you for contributing! 🙏
