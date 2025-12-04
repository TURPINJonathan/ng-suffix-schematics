import { Tree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing/index.js';
import { join } from 'path';

const collectionPath = join(__dirname, '../collection.json');

describe('component schematic', () => {
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

  it('should create component files with .component suffix', async () => {
    const tree = await runner.runSchematic('component', {
      name: 'user-profile',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/user-profile/user-profile.component.ts');
    expect(tree.files).toContain('/src/app/user-profile/user-profile.component.html');
    expect(tree.files).toContain('/src/app/user-profile/user-profile.component.scss');
    expect(tree.files).toContain('/src/app/user-profile/user-profile.component.spec.ts');
  });

  it('should generate class with Component suffix', async () => {
    const tree = await runner.runSchematic('component', {
      name: 'user-card',
      project: 'test-app'
    }, appTree);

    const content = tree.read('/src/app/user-card/user-card.component.ts')?.toString();
    expect(content).toContain('export class UserCardComponent');
  });

  it('should handle nested paths', async () => {
    const tree = await runner.runSchematic('component', {
      name: 'features/admin/dashboard',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/features/admin/dashboard/dashboard.component.ts');
    const content = tree.read('/src/app/features/admin/dashboard/dashboard.component.ts')?.toString();
    expect(content).toContain('export class DashboardComponent');
  });

  it('should respect inlineTemplate option', async () => {
    const tree = await runner.runSchematic('component', {
      name: 'inline-comp',
      project: 'test-app',
      inlineTemplate: true
    }, appTree);

    expect(tree.files).not.toContain('/src/app/inline-comp/inline-comp.component.html');
    const content = tree.read('/src/app/inline-comp/inline-comp.component.ts')?.toString();
    expect(content).toContain('template:');
  });

  it('should respect inlineStyle option', async () => {
    const tree = await runner.runSchematic('component', {
      name: 'inline-style',
      project: 'test-app',
      inlineStyle: true
    }, appTree);

    expect(tree.files).not.toContain('/src/app/inline-style/inline-style.component.scss');
    const content = tree.read('/src/app/inline-style/inline-style.component.ts')?.toString();
    expect(content).toContain('styles:');
  });

  it('should respect skipTests option', async () => {
    const tree = await runner.runSchematic('component', {
      name: 'no-test',
      project: 'test-app',
      skipTests: true
    }, appTree);

    expect(tree.files).not.toContain('/src/app/no-test/no-test.component.spec.ts');
  });

  it('should handle flat option', async () => {
    const tree = await runner.runSchematic('component', {
      name: 'flat-comp',
      project: 'test-app',
      flat: true
    }, appTree);

    expect(tree.files).toContain('/src/app/flat-comp.component.ts');
    expect(tree.files).not.toContain('/src/app/flat-comp/flat-comp.component.ts');
  });

  it('should handle standalone components', async () => {
    const tree = await runner.runSchematic('component', {
      name: 'standalone',
      project: 'test-app',
      standalone: true
    }, appTree);

    const content = tree.read('/src/app/standalone/standalone.component.ts')?.toString();
    expect(content).toContain('imports: []');
    expect(content).toContain('export class StandaloneComponent');
  });

  it('should handle names with underscores and numbers', async () => {
    const tree = await runner.runSchematic('component', {
      name: 'user_item2',
      project: 'test-app'
    }, appTree);

    expect(tree.files).toContain('/src/app/user-item2/user-item2.component.ts');
    const content = tree.read('/src/app/user-item2/user-item2.component.ts')?.toString();
    expect(content).toContain('export class UserItem2Component');
  });

  it('should force Component type suffix even with custom type option', async () => {
    const tree = await runner.runSchematic('component', {
      name: 'test',
      project: 'test-app',
      type: 'CustomType'
    }, appTree);

    const content = tree.read('/src/app/test/test.component.ts')?.toString();
    expect(content).toContain('export class TestComponent');
  });

  it('should use project prefix from angular.json', async () => {
    appTree.overwrite('/angular.json', JSON.stringify({
      version: 1,
      projects: {
        'test-app': {
          root: '',
          sourceRoot: 'src',
          projectType: 'application',
          prefix: 'app'
        }
      }
    }));

    const tree = await runner.runSchematic('component', {
      name: 'my-component',
      project: 'test-app'
    }, appTree);

    const content = tree.read('/src/app/my-component/my-component.component.ts')?.toString();
    expect(content).toContain('selector: \'app-my-component\'');
  });

  it('should use workspace-level schematic defaults', async () => {
    appTree.overwrite('/angular.json', JSON.stringify({
      version: 1,
      schematics: {
        'component': {
          style: 'scss'
        }
      },
      projects: {
        'test-app': {
          root: '',
          sourceRoot: 'src',
          projectType: 'application'
        }
      }
    }));

    const tree = await runner.runSchematic('component', {
      name: 'my-component',
      project: 'test-app',
      skipTests: true
    }, appTree);

    expect(tree.exists('/src/app/my-component/my-component.component.scss')).toBe(true);
    expect(tree.exists('/src/app/my-component/my-component.component.css')).toBe(false);
  });

  it('should merge workspace and project-level defaults correctly', async () => {
    appTree.overwrite('/angular.json', JSON.stringify({
      version: 1,
      schematics: {
        'component': {
          style: 'scss',
          standalone: true
        }
      },
      projects: {
        'test-app': {
          root: '',
          sourceRoot: 'src',
          projectType: 'application',
          prefix: 'app',
          schematics: {
            'component': {
              changeDetection: 'OnPush'
            }
          }
        }
      }
    }));

    const tree = await runner.runSchematic('component', {
      name: 'my-component',
      project: 'test-app',
      skipTests: true
    }, appTree);

    const content = tree.read('/src/app/my-component/my-component.component.ts')?.toString();
    expect(content).toContain('selector: \'app-my-component\'');
    expect(content).toContain('changeDetection: ChangeDetectionStrategy.OnPush');
    expect(tree.exists('/src/app/my-component/my-component.component.scss')).toBe(true);
  });
});
