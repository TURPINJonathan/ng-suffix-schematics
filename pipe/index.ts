import { Rule } from '@angular-devkit/schematics';
import { BaseSchematicOptions, createComplexSchematic } from '../utils';

export interface PipeOptions extends BaseSchematicOptions {
  standalone?: boolean;
  skipImport?: boolean;
  export?: boolean;
}

export const pipe: (options: PipeOptions) => Rule = createComplexSchematic('pipe', 'Pipe');
