import { Rule } from '@angular-devkit/schematics';
import { BaseSchematicOptions, createSimpleSchematic } from '../utils';

export interface ComponentOptions extends BaseSchematicOptions {
  prefix?: string;
  style?: string;
  inlineStyle?: boolean;
  inlineTemplate?: boolean;
  standalone?: boolean;
  skipImport?: boolean;
  selector?: string;
  skipSelector?: boolean;
  type?: string;
  export?: boolean;
  changeDetection?: string;
}

export const component: (options: ComponentOptions) => Rule = createSimpleSchematic('component', 'Component');
