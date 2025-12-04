import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing/index.js';
import { join } from 'path';

const collectionPath = join(__dirname, '../collection.json');

describe('directive schematic', () => {
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

  it('should create directive files with .directive suffix', async () => {
    const tree = await runner.runSchematic('directive', {
      name: 'highlight',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/highlight/highlight.directive.ts');
    expect(tree.files).toContain('/src/app/highlight/highlight.directive.spec.ts');
  });

  it('should generate class with Directive suffix', async () => {
    const tree = await runner.runSchematic('directive', {
      name: 'tooltip',
      project: 'test-app'
    }, appTree);

    const content = tree.read('/src/app/tooltip/tooltip.directive.ts')?.toString();
    expect(content).toContain('export class TooltipDirective');
  });

  it('should handle nested paths', async () => {
    const tree = await runner.runSchematic('directive', {
      name: 'shared/autofocus',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/shared/autofocus/autofocus.directive.ts');
    const content = tree.read('/src/app/shared/autofocus/autofocus.directive.ts')?.toString();
    expect(content).toContain('export class AutofocusDirective');
  });

  it('should respect skipTests option', async () => {
    const tree = await runner.runSchematic('directive', {
      name: 'no-test',
      project: 'test-app',
      skipTests: true
    }, appTree);

    expect(tree.files).not.toContain('/src/app/no-test/no-test.directive.spec.ts');
  });

  it('should handle flat option', async () => {
    const tree = await runner.runSchematic('directive', {
      name: 'flat-directive',
      project: 'test-app',
      flat: true
    }, appTree);

    expect(tree.files).toContain('/src/app/flat-directive.directive.ts');
    expect(tree.files).not.toContain('/src/app/flat-directive/flat-directive.directive.ts');
  });

  it('should handle names with special characters', async () => {
    const tree = await runner.runSchematic('directive', {
      name: 'auto_focus',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/auto-focus/auto-focus.directive.ts');
    const content = tree.read('/src/app/auto-focus/auto-focus.directive.ts')?.toString();
    expect(content).toContain('export class AutoFocusDirective');
  });

  it('should work in subdirectories', async () => {
    const tree = await runner.runSchematic('directive', {
      name: 'shared/directives/tooltip',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/shared/directives/tooltip/tooltip.directive.ts');
    const content = tree.read('/src/app/shared/directives/tooltip/tooltip.directive.ts')?.toString();
    expect(content).toContain('export class TooltipDirective');
  });
});
