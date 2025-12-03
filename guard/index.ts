import { Rule } from '@angular-devkit/schematics';
import { BaseSchematicOptions, createComplexSchematic } from '../utils';

export interface GuardOptions extends BaseSchematicOptions {
  functional?: boolean;
}

export const guard: (options: GuardOptions) => Rule = createComplexSchematic('guard', 'Guard');
