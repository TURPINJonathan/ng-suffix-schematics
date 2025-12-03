import { Rule } from '@angular-devkit/schematics';
import { BaseSchematicOptions, createSimpleSchematic } from '../utils';

export interface DirectiveOptions extends BaseSchematicOptions {
  prefix?: string;
  standalone?: boolean;
  selector?: string;
  skipImport?: boolean;
  export?: boolean;
  type?: string;
}

export const directive: (options: DirectiveOptions) => Rule = createSimpleSchematic('directive', 'Directive');
