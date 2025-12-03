import { extractBaseName, buildFilePath } from './index.js';

describe('Utils - Pure Functions', () => {
  describe('extractBaseName', () => {
    it('should extract base name from simple path', () => {
      expect(extractBaseName('my-component')).toBe('my-component');
    });

    it('should extract base name from nested path', () => {
      expect(extractBaseName('features/admin/my-component')).toBe('my-component');
    });

    it('should handle single level nesting', () => {
      expect(extractBaseName('shared/my-service')).toBe('my-service');
    });

    it('should handle deep nesting', () => {
      expect(extractBaseName('app/core/services/auth/user')).toBe('user');
    });

    it('should handle empty string', () => {
      expect(extractBaseName('')).toBe('');
    });

    it('should handle name with special characters', () => {
      expect(extractBaseName('my-special_component')).toBe('my-special_component');
    });
  });

  describe('buildFilePath', () => {
    it('should build flat file path', () => {
      const result = buildFilePath('my-component', 'src/app', 'component', true);
      expect(result).toBe('src/app/my-component-component.ts');
    });

    it('should build nested file path', () => {
      const result = buildFilePath('my-component', 'src/app', 'component', false);
      expect(result).toBe('src/app/my-component/my-component-component.ts');
    });

    it('should handle nested name with flat=false', () => {
      const result = buildFilePath('features/admin/dashboard', 'src/app', 'component', false);
      expect(result).toBe('src/app/features/admin/dashboard/dashboard-component.ts');
    });

    it('should handle nested name with flat=true', () => {
      const result = buildFilePath('features/admin/dashboard', 'src/app', 'component', true);
      expect(result).toBe('src/app/features/admin/dashboard-component.ts');
    });

    it('should use default path when path is undefined', () => {
      const result = buildFilePath('my-service', undefined, 'service', false);
      expect(result).toBe('src/app/my-service/my-service-service.ts');
    });

    it('should dasherize the name', () => {
      const result = buildFilePath('MyComponent', 'src/app', 'component', false);
      expect(result).toBe('src/app/my-component/my-component-component.ts');
    });

    it('should handle CamelCase with flat=true', () => {
      const result = buildFilePath('MyService', 'src/app', 'service', true);
      expect(result).toBe('src/app/my-service-service.ts');
    });

    it('should handle different suffixes (pipe)', () => {
      const result = buildFilePath('custom', 'src/app', 'pipe', false);
      expect(result).toBe('src/app/custom/custom-pipe.ts');
    });

    it('should handle different suffixes (guard)', () => {
      const result = buildFilePath('auth', 'src/app', 'guard', true);
      expect(result).toBe('src/app/auth-guard.ts');
    });

    it('should handle different suffixes (interceptor)', () => {
      const result = buildFilePath('http', 'src/app', 'interceptor', false);
      expect(result).toBe('src/app/http/http-interceptor.ts');
    });
  });
});
