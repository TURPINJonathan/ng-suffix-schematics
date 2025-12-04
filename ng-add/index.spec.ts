import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing/index.js';
import { join } from 'path';

const collectionPath = join(__dirname, '../collection.json');

describe('ng-add schematic', () => {
  let runner: SchematicTestRunner;
  let tree: Tree;

  beforeEach(() => {
    runner = new SchematicTestRunner('schematics', collectionPath);
    tree = Tree.empty();
  });

  it('should create angular.json with schematicCollections if it does not exist', async () => {
    tree.create('/angular.json', JSON.stringify({
      version: 1,
      projects: {}
    }));

    const result = await runner.runSchematic('ng-add', {}, tree);

    const angularJson = JSON.parse(result.read('/angular.json')!.toString());
    expect(angularJson.cli).toBeDefined();
    expect(angularJson.cli.schematicCollections).toBeDefined();
    expect(angularJson.cli.schematicCollections).toContain('@turpinjonathan/ng-suffix-schematics');
    expect(angularJson.cli.schematicCollections).toContain('@schematics/angular');
  });

  it('should add package to existing schematicCollections', async () => {
    tree.create('/angular.json', JSON.stringify({
      version: 1,
      cli: {
        schematicCollections: ['@some/other-package']
      },
      projects: {}
    }));

    const result = await runner.runSchematic('ng-add', {}, tree);

    const angularJson = JSON.parse(result.read('/angular.json')!.toString());
    expect(angularJson.cli.schematicCollections).toContain('@turpinjonathan/ng-suffix-schematics');
    expect(angularJson.cli.schematicCollections).toContain('@some/other-package');
    expect(angularJson.cli.schematicCollections).toContain('@schematics/angular');
  });

  it('should place package at the beginning of schematicCollections for priority', async () => {
    tree.create('/angular.json', JSON.stringify({
      version: 1,
      cli: {
        schematicCollections: ['@some/other-package']
      },
      projects: {}
    }));

    const result = await runner.runSchematic('ng-add', {}, tree);

    const angularJson = JSON.parse(result.read('/angular.json')!.toString());
    expect(angularJson.cli.schematicCollections[0]).toBe('@turpinjonathan/ng-suffix-schematics');
  });

  it('should not duplicate package if already configured', async () => {
    tree.create('/angular.json', JSON.stringify({
      version: 1,
      cli: {
        schematicCollections: [
          '@turpinjonathan/ng-suffix-schematics',
          '@schematics/angular'
        ]
      },
      projects: {}
    }));

    const result = await runner.runSchematic('ng-add', {}, tree);

    const angularJson = JSON.parse(result.read('/angular.json')!.toString());
    const collections = angularJson.cli.schematicCollections;
    const packageCount = collections.filter((c: string) => c === '@turpinjonathan/ng-suffix-schematics').length;
    expect(packageCount).toBe(1);
  });

  it('should handle angular.json without cli section', async () => {
    tree.create('/angular.json', JSON.stringify({
      version: 1,
      projects: {
        'my-app': {}
      }
    }));

    const result = await runner.runSchematic('ng-add', {}, tree);

    const angularJson = JSON.parse(result.read('/angular.json')!.toString());
    expect(angularJson.cli).toBeDefined();
    expect(angularJson.cli.schematicCollections).toBeDefined();
    expect(angularJson.cli.schematicCollections[0]).toBe('@turpinjonathan/ng-suffix-schematics');
  });

  it('should add @schematics/angular if not present', async () => {
    tree.create('/angular.json', JSON.stringify({
      version: 1,
      cli: {
        schematicCollections: []
      },
      projects: {}
    }));

    const result = await runner.runSchematic('ng-add', {}, tree);

    const angularJson = JSON.parse(result.read('/angular.json')!.toString());
    expect(angularJson.cli.schematicCollections).toContain('@schematics/angular');
  });

  it('should return tree unchanged if angular.json does not exist', async () => {
    const result = await runner.runSchematic('ng-add', {}, tree);
    expect(result.exists('/angular.json')).toBe(false);
  });

  it('should preserve existing angular.json structure', async () => {
    const originalConfig = {
      version: 1,
      cli: {
        analytics: false,
        cache: {
          enabled: true
        }
      },
      projects: {
        'my-app': {
          projectType: 'application'
        }
      }
    };

    tree.create('/angular.json', JSON.stringify(originalConfig, null, 2));

    const result = await runner.runSchematic('ng-add', {}, tree);

    const angularJson = JSON.parse(result.read('/angular.json')!.toString());
    expect(angularJson.version).toBe(1);
    expect(angularJson.cli.analytics).toBe(false);
    expect(angularJson.cli.cache.enabled).toBe(true);
    expect(angularJson.projects['my-app'].projectType).toBe('application');
  });

  it('should handle invalid JSON in angular.json', async () => {
    tree.create('/angular.json', '{ invalid json }');

    const result = await runner.runSchematic('ng-add', {}, tree);

    expect(result.read('/angular.json')!.toString()).toBe('{ invalid json }');
  });

  it('should reposition package to beginning if already present elsewhere', async () => {
    tree.create('/angular.json', JSON.stringify({
      version: 1,
      cli: {
        schematicCollections: [
          '@some/other-package',
          '@turpinjonathan/ng-suffix-schematics',
          '@another/package'
        ]
      },
      projects: {}
    }));

    const result = await runner.runSchematic('ng-add', {}, tree);

    const angularJson = JSON.parse(result.read('/angular.json')!.toString());
    expect(angularJson.cli.schematicCollections[0]).toBe('@turpinjonathan/ng-suffix-schematics');
    expect(angularJson.cli.schematicCollections).toContain('@some/other-package');
    expect(angularJson.cli.schematicCollections).toContain('@another/package');
    
    const packageCount = angularJson.cli.schematicCollections.filter((c: string) => c === '@turpinjonathan/ng-suffix-schematics').length;
    expect(packageCount).toBe(1);
  });
});
