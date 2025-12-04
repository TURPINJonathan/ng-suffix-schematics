import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing/index.js';
import { join } from 'path';

const collectionPath = join(__dirname, '../collection.json');

describe('resolver schematic', () => {
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

  it('should create resolver files with .resolver suffix', async () => {
    const tree = await runner.runSchematic('resolver', {
      name: 'user',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/user/user.resolver.ts');
    expect(tree.files).toContain('/src/app/user/user.resolver.spec.ts');
  });

  it('should generate functional resolver with correct name', async () => {
    const tree = await runner.runSchematic('resolver', {
      name: 'product',
      project: 'test-app'
    }, appTree);

    const content = tree.read('/src/app/product/product.resolver.ts')?.toString();
    expect(content).toContain('export const productResolver');
  });

  it('should handle nested paths', async () => {
    const tree = await runner.runSchematic('resolver', {
      name: 'features/user',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/features/user/user.resolver.ts');
    const content = tree.read('/src/app/features/user/user.resolver.ts')?.toString();
    expect(content).toContain('export const userResolver');
  });

  it('should respect skipTests option', async () => {
    const tree = await runner.runSchematic('resolver', {
      name: 'no-test',
      project: 'test-app',
      skipTests: true
    }, appTree);

    expect(tree.files).not.toContain('/src/app/no-test/no-test.resolver.spec.ts');
  });

  it('should handle flat option', async () => {
    const tree = await runner.runSchematic('resolver', {
      name: 'flat-resolver',
      project: 'test-app',
      flat: true
    }, appTree);

    expect(tree.files).toContain('/src/app/flat-resolver.resolver.ts');
    expect(tree.files).not.toContain('/src/app/flat-resolver/flat-resolver.resolver.ts');
  });

  it('should remove duplicate suffix from file names', async () => {
    const tree = await runner.runSchematic('resolver', {
      name: 'data',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/data/data.resolver.ts');
    expect(tree.files).not.toContain('/src/app/data/data-resolver.ts');
  });

  it('should work with complex nested structures', async () => {
    const tree = await runner.runSchematic('resolver', {
      name: 'modules/admin/users/detail',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/modules/admin/users/detail/detail.resolver.ts');
    const content = tree.read('/src/app/modules/admin/users/detail/detail.resolver.ts')?.toString();
    expect(content).toContain('export const detailResolver');
  });
});
