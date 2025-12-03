import { Rule } from '@angular-devkit/schematics';
import { BaseSchematicOptions, createComplexSchematic } from '../utils';

export interface InterceptorOptions extends BaseSchematicOptions {
  functional?: boolean;
}

export const interceptor: (options: InterceptorOptions) => Rule = createComplexSchematic('interceptor', 'Interceptor');
