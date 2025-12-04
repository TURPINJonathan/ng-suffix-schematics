import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing/index.js';
import { join } from 'path';

const collectionPath = join(__dirname, '../collection.json');

describe('interceptor schematic', () => {
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

  it('should create interceptor files with .interceptor suffix', async () => {
    const tree = await runner.runSchematic('interceptor', {
      name: 'auth',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/auth/auth.interceptor.ts');
    expect(tree.files).toContain('/src/app/auth/auth.interceptor.spec.ts');
  });

  it('should generate functional interceptor with correct name', async () => {
    const tree = await runner.runSchematic('interceptor', {
      name: 'logging',
      project: 'test-app'
    }, appTree);

    const content = tree.read('/src/app/logging/logging.interceptor.ts')?.toString();
    expect(content).toContain('export const loggingInterceptor');
  });

  it('should handle nested paths', async () => {
    const tree = await runner.runSchematic('interceptor', {
      name: 'core/error',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/core/error/error.interceptor.ts');
    const content = tree.read('/src/app/core/error/error.interceptor.ts')?.toString();
    expect(content).toContain('export const errorInterceptor');
  });

  it('should respect skipTests option', async () => {
    const tree = await runner.runSchematic('interceptor', {
      name: 'no-test',
      project: 'test-app',
      skipTests: true
    }, appTree);

    expect(tree.files).not.toContain('/src/app/no-test/no-test.interceptor.spec.ts');
  });

  it('should handle flat option', async () => {
    const tree = await runner.runSchematic('interceptor', {
      name: 'flat-interceptor',
      project: 'test-app',
      flat: true
    }, appTree);

    expect(tree.files).toContain('/src/app/flat-interceptor.interceptor.ts');
    expect(tree.files).not.toContain('/src/app/flat-interceptor/flat-interceptor.interceptor.ts');
  });

  it('should remove duplicate suffix from file names', async () => {
    const tree = await runner.runSchematic('interceptor', {
      name: 'cache',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/cache/cache.interceptor.ts');
    expect(tree.files).not.toContain('/src/app/cache/cache-interceptor.ts');
  });

  it('should handle multiple path segments', async () => {
    const tree = await runner.runSchematic('interceptor', {
      name: 'shared/http/retry',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/shared/http/retry/retry.interceptor.ts');
    const content = tree.read('/src/app/shared/http/retry/retry.interceptor.ts')?.toString();
    expect(content).toContain('export const retryInterceptor');
  });
});
