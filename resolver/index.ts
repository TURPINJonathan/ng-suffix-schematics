import { Rule } from '@angular-devkit/schematics';
import { BaseSchematicOptions, createComplexSchematic } from '../utils';

export interface ResolverOptions extends BaseSchematicOptions {
  functional?: boolean;
}

export const resolver: (options: ResolverOptions) => Rule = createComplexSchematic('resolver', 'Resolver');
