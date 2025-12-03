import { Tree } from '@angular-devkit/schematics';
import { removeDuplicateSuffix, ensureClassSuffix } from './index.js';

describe('Utils - Tree Transformations', () => {
  describe('removeDuplicateSuffix', () => {
    let tree: Tree;

    beforeEach(() => {
      tree = Tree.empty();
    });

    it('should rename file from dash format to dot format', () => {
      const oldPath = '/src/app/my-pipe/my-pipe-pipe.ts';
      tree.create(oldPath, 'export class MyPipePipe {}');

      const result = removeDuplicateSuffix(tree, oldPath, 'my-pipe', 'pipe');

      expect(result.exists('/src/app/my-pipe/my-pipe.pipe.ts')).toBe(true);
      expect(result.exists('/src/app/my-pipe/my-pipe-pipe.ts')).toBe(false);
    });

    it('should rename spec file and update imports', () => {
      const oldPath = '/src/app/my-pipe/my-pipe-pipe.ts';
      const oldSpecPath = '/src/app/my-pipe/my-pipe-pipe.spec.ts';
      
      tree.create(oldPath, 'export class MyPipePipe {}');
      tree.create(oldSpecPath, `
import { MyPipePipe } from './my-pipe-pipe';

describe('MyPipePipe', () => {
  it('should work', () => {
    expect(true).toBe(true);
  });
});
      `);

      const result = removeDuplicateSuffix(tree, oldPath, 'my-pipe', 'pipe');

      expect(result.exists('/src/app/my-pipe/my-pipe.pipe.spec.ts')).toBe(true);
      expect(result.exists('/src/app/my-pipe/my-pipe-pipe.spec.ts')).toBe(false);
      
      const specContent = result.read('/src/app/my-pipe/my-pipe.pipe.spec.ts')?.toString('utf-8') || '';
      expect(specContent).toContain('./my-pipe.pipe');
      expect(specContent).not.toContain('./my-pipe-pipe');
    });

    it('should handle file that does not exist', () => {
      const oldPath = '/src/app/non-existent/non-existent-pipe.ts';
      
      const result = removeDuplicateSuffix(tree, oldPath, 'non-existent', 'pipe');
      
      expect(result.exists('/src/app/non-existent/non-existent.pipe.ts')).toBe(false);
    });

    it('should handle spec file only (no main file)', () => {
      const oldPath = '/src/app/my-pipe/my-pipe-pipe.ts';
      const oldSpecPath = '/src/app/my-pipe/my-pipe-pipe.spec.ts';
      
      tree.create(oldSpecPath, 'test content');

      const result = removeDuplicateSuffix(tree, oldPath, 'my-pipe', 'pipe');

      expect(result.exists('/src/app/my-pipe/my-pipe.pipe.spec.ts')).toBe(true);
    });

    it('should handle CamelCase names', () => {
      const oldPath = '/src/app/my-custom/my-custom-guard.ts';
      tree.create(oldPath, 'export const myCustomGuard = () => true;');

      const result = removeDuplicateSuffix(tree, oldPath, 'MyCustom', 'guard');

      expect(result.exists('/src/app/my-custom/my-custom.guard.ts')).toBe(true);
    });
  });

  describe('ensureClassSuffix', () => {
    let tree: Tree;

    beforeEach(() => {
      tree = Tree.empty();
    });

    it('should add suffix to class name', () => {
      const filePath = '/src/app/my-pipe.ts';
      tree.create(filePath, `
export class MyPipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}
      `);

      const rule = ensureClassSuffix(filePath, 'my-pipe', 'Pipe');
      const result = rule(tree, {} as any) as Tree;

      const content = result.read(filePath)?.toString('utf-8') || '';
      expect(content).toContain('export class MyPipePipe');
    });

    it('should not modify class if suffix already exists', () => {
      const filePath = '/src/app/my-pipe.ts';
      tree.create(filePath, `
export class MyPipePipe implements PipeTransform {
  transform(value: any): any {
    return value;
  }
}
      `);

      const rule = ensureClassSuffix(filePath, 'my-pipe', 'Pipe');
      const result = rule(tree, {} as any) as Tree;

      const content = result.read(filePath)?.toString('utf-8') || '';
      expect(content).toContain('export class MyPipePipe');
      expect(content).not.toContain('MyPipePipePipe');
    });

    it('should handle file that does not exist', () => {
      const filePath = '/src/app/non-existent.ts';
      
      const rule = ensureClassSuffix(filePath, 'non-existent', 'Pipe');
      const result = rule(tree, {} as any);

      expect(result).toBe(tree);
    });

    it('should handle class with implements clause', () => {
      const filePath = '/src/app/my-guard.ts';
      tree.create(filePath, `
export class MyGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}
      `);

      const rule = ensureClassSuffix(filePath, 'my-guard', 'Guard');
      const result = rule(tree, {} as any) as Tree;

      const content = result.read(filePath)?.toString('utf-8') || '';
      expect(content).toContain('export class MyGuardGuard');
    });

    it('should handle class with extends clause', () => {
      const filePath = '/src/app/base-service.ts';
      tree.create(filePath, `
export class BaseService extends HttpService {
  constructor() {
    super();
  }
}
      `);

      const rule = ensureClassSuffix(filePath, 'base-service', 'Service');
      const result = rule(tree, {} as any) as Tree;

      const content = result.read(filePath)?.toString('utf-8') || '';
      expect(content).toContain('export class BaseServiceService');
    });

    it('should handle multiple spaces after export class', () => {
      const filePath = '/src/app/my-directive.ts';
      tree.create(filePath, 'export   class   MyDirective   {  }');

      const rule = ensureClassSuffix(filePath, 'my-directive', 'Directive');
      const result = rule(tree, {} as any) as Tree;

      const content = result.read(filePath)?.toString('utf-8') || '';
      expect(content).toContain('export class MyDirectiveDirective');
    });
  });
});
