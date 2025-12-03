import { Rule } from '@angular-devkit/schematics';
import { BaseSchematicOptions, createSimpleSchematic } from '../utils';

export interface ServiceOptions extends BaseSchematicOptions {
  type?: string;
}

export const service: (options: ServiceOptions) => Rule = createSimpleSchematic('service', 'Service');
