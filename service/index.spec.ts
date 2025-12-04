import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing/index.js';
import { join } from 'path';

const collectionPath = join(__dirname, '../collection.json');

describe('service schematic', () => {
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

  it('should create service files with .service suffix', async () => {
    const tree = await runner.runSchematic('service', {
      name: 'data-api',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/data-api/data-api.service.ts');
    expect(tree.files).toContain('/src/app/data-api/data-api.service.spec.ts');
  });

  it('should generate class with Service suffix', async () => {
    const tree = await runner.runSchematic('service', {
      name: 'user-data',
      project: 'test-app'
    }, appTree);

    const content = tree.read('/src/app/user-data/user-data.service.ts')?.toString();
    expect(content).toContain('export class UserDataService');
  });

  it('should handle nested paths', async () => {
    const tree = await runner.runSchematic('service', {
      name: 'core/auth',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/core/auth/auth.service.ts');
    const content = tree.read('/src/app/core/auth/auth.service.ts')?.toString();
    expect(content).toContain('export class AuthService');
  });

  it('should respect skipTests option', async () => {
    const tree = await runner.runSchematic('service', {
      name: 'no-test',
      project: 'test-app',
      skipTests: true
    }, appTree);

    expect(tree.files).not.toContain('/src/app/no-test/no-test.service.spec.ts');
  });

  it('should handle flat option', async () => {
    const tree = await runner.runSchematic('service', {
      name: 'flat-service',
      project: 'test-app',
      flat: true
    }, appTree);

    expect(tree.files).toContain('/src/app/flat-service.service.ts');
    expect(tree.files).not.toContain('/src/app/flat-service/flat-service.service.ts');
  });

  it('should force Service type suffix', async () => {
    const tree = await runner.runSchematic('service', {
      name: 'api',
      project: 'test-app',
      type: 'CustomType'
    }, appTree);

    const content = tree.read('/src/app/api/api.service.ts')?.toString();
    expect(content).toContain('export class ApiService');
    expect(tree.files).toContain('/src/app/api/api.service.ts');
  });

  it('should handle complex nested paths', async () => {
    const tree = await runner.runSchematic('service', {
      name: 'core/api/auth/token',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/core/api/auth/token/token.service.ts');
    const content = tree.read('/src/app/core/api/auth/token/token.service.ts')?.toString();
    expect(content).toContain('export class TokenService');
  });
});
