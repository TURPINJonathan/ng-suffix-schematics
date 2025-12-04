import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing/index.js';
import { join } from 'path';

const collectionPath = join(__dirname, '../collection.json');

describe('guard schematic', () => {
  let runner: SchematicTestRunner;
  let appTree: Tree;

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', collectionPath);
    appTree = Tree.empty();
    appTree.create('/angular.json', JSON.stringify({
      version: 1,
      projects: {
        'test-app': {
          root: '',
          sourceRoot: 'src',
          projectType: 'application'
        }
      }
    }));
  });

  it('should create guard files with .guard suffix', async () => {
    const tree = await runner.runSchematic('guard', {
      name: 'auth',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/auth/auth.guard.ts');
    expect(tree.files).toContain('/src/app/auth/auth.guard.spec.ts');
  });

  it('should generate functional guard with correct name', async () => {
    const tree = await runner.runSchematic('guard', {
      name: 'admin',
      project: 'test-app'
    }, appTree);

    const content = tree.read('/src/app/admin/admin.guard.ts')?.toString();
    expect(content).toContain('export const adminGuard');
  });

  it('should handle nested paths', async () => {
    const tree = await runner.runSchematic('guard', {
      name: 'core/auth',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/core/auth/auth.guard.ts');
    const content = tree.read('/src/app/core/auth/auth.guard.ts')?.toString();
    expect(content).toContain('export const authGuard');
  });

  it('should respect skipTests option', async () => {
    const tree = await runner.runSchematic('guard', {
      name: 'no-test',
      project: 'test-app',
      skipTests: true
    }, appTree);

    expect(tree.files).not.toContain('/src/app/no-test/no-test.guard.spec.ts');
  });

  it('should handle flat option', async () => {
    const tree = await runner.runSchematic('guard', {
      name: 'flat-guard',
      project: 'test-app',
      flat: true
    }, appTree);

    expect(tree.files).toContain('/src/app/flat-guard.guard.ts');
    expect(tree.files).not.toContain('/src/app/flat-guard/flat-guard.guard.ts');
  });

  it('should remove duplicate suffix from file names', async () => {
    const tree = await runner.runSchematic('guard', {
      name: 'role',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/role/role.guard.ts');
    expect(tree.files).not.toContain('/src/app/role/role-guard.ts');
  });

  it('should handle deeply nested paths', async () => {
    const tree = await runner.runSchematic('guard', {
      name: 'features/security/auth/login',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/features/security/auth/login/login.guard.ts');
  });
});
