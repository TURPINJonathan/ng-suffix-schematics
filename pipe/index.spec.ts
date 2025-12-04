import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing/index.js';
import { join } from 'path';

const collectionPath = join(__dirname, '../collection.json');

describe('pipe schematic', () => {
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

  it('should create pipe files with .pipe suffix', async () => {
    const tree = await runner.runSchematic('pipe', {
      name: 'format-date',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/format-date/format-date.pipe.ts');
    expect(tree.files).toContain('/src/app/format-date/format-date.pipe.spec.ts');
  });

  it('should generate class with Pipe suffix', async () => {
    const tree = await runner.runSchematic('pipe', {
      name: 'format-text',
      project: 'test-app'
    }, appTree);

    const content = tree.read('/src/app/format-text/format-text.pipe.ts')?.toString();
    expect(content).toContain('export class FormatTextPipe');
  });

  it('should handle nested paths', async () => {
    const tree = await runner.runSchematic('pipe', {
      name: 'shared/uppercase',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/shared/uppercase/uppercase.pipe.ts');
    const content = tree.read('/src/app/shared/uppercase/uppercase.pipe.ts')?.toString();
    expect(content).toContain('export class UppercasePipe');
  });

  it('should respect skipTests option', async () => {
    const tree = await runner.runSchematic('pipe', {
      name: 'no-test',
      project: 'test-app',
      skipTests: true
    }, appTree);

    expect(tree.files).not.toContain('/src/app/no-test/no-test.pipe.spec.ts');
  });

  it('should handle flat option', async () => {
    const tree = await runner.runSchematic('pipe', {
      name: 'flat-pipe',
      project: 'test-app',
      flat: true
    }, appTree);

    expect(tree.files).toContain('/src/app/flat-pipe.pipe.ts');
    expect(tree.files).not.toContain('/src/app/flat-pipe/flat-pipe.pipe.ts');
  });

  it('should remove duplicate suffix from file names', async () => {
    const tree = await runner.runSchematic('pipe', {
      name: 'format',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/format/format.pipe.ts');
    expect(tree.files).not.toContain('/src/app/format/format-pipe.ts');
  });

  it('should ensure class has Pipe suffix', async () => {
    const tree = await runner.runSchematic('pipe', {
      name: 'currency',
      project: 'test-app'
    }, appTree);

    const content = tree.read('/src/app/currency/currency.pipe.ts')?.toString();
    expect(content).toContain('export class CurrencyPipe');
    
    expect(content).not.toContain('export class CurrencyPipePipe');
  });
});
