import { Tree, Rule, SchematicContext, chain, externalSchematic } from '@angular-devkit/schematics';
import { strings, normalize, join } from '@angular-devkit/core';

/**
 * Base interface for all schematic options
 */
export interface BaseSchematicOptions {
  name: string;
  path?: string;
  project?: string;
  flat?: boolean;
  skipTests?: boolean;
}

/**
 * Get workspace default options for a specific schematic
 */
function getWorkspaceDefaults(
  tree: Tree,
  schematicName: string,
  project?: string
): Record<string, any> {
  const angularJsonPath = '/angular.json';
  if (!tree.exists(angularJsonPath)) {
    return {};
  }

  try {
    const angularJsonContent = tree.read(angularJsonPath);
    if (!angularJsonContent) return {};

    const angularJson = JSON.parse(angularJsonContent.toString('utf-8'));
    const defaults: Record<string, any> = {};

    const targetProject = project || angularJson.defaultProject;

    const mergeSchematicOptions = (config: any) => {
      if (!config?.schematics) return;
      
      const schematicKeys = [
        schematicName,
        `@schematics/angular:${schematicName}`,
        `@turpinjonathan/ng-suffix-schematics:${schematicName}`
      ];

      schematicKeys.forEach(key => {
        if (config.schematics[key]) {
          Object.assign(defaults, config.schematics[key]);
        }
      });
    };

    mergeSchematicOptions(angularJson);

    if (targetProject && angularJson.projects?.[targetProject]) {
      const projectConfig = angularJson.projects[targetProject];
      
      mergeSchematicOptions(projectConfig);

      if (
        projectConfig.prefix &&
        ['component', 'directive'].includes(schematicName) &&
        typeof defaults.prefix === 'undefined'
      ) {
        defaults.prefix = projectConfig.prefix;
      }
    }

    return defaults;
  } catch (e) {
    return {};
  }
}

/**
 * Post-process generated files to ensure class names have proper suffixes
 */
export function ensureClassSuffix(
  path: string,
  baseName: string,
  suffix: string
): Rule {
  return (tree: Tree) => {
    const tsFile = tree.read(path);
    if (!tsFile) {
      return tree;
    }

    let content = tsFile.toString('utf-8');
    const className = strings.classify(baseName);
    const expectedClassName = `${className}${suffix}`;

    const classRegex = new RegExp(`export\\s+class\\s+${className}([^A-Za-z]|$)`);
    if (!content.includes(`class ${expectedClassName}`) && classRegex.test(content)) {
      content = content.replace(
        new RegExp(`export\\s+class\\s+${className}([^A-Za-z]|$)`, 'g'),
        `export class ${expectedClassName}$1`
      );
      tree.overwrite(path, content);
    }

    return tree;
  };
}

/**
 * Remove duplicate suffix from file names (e.g., my-pipe-pipe.ts -> my-pipe.pipe.ts)
 */
export function removeDuplicateSuffix(
  tree: Tree,
  oldPath: string,
  baseName: string,
  suffix: string
): Tree {
  const directory = oldPath.substring(0, oldPath.lastIndexOf('/'));
  const dasherizedName = strings.dasherize(baseName);
  const oldFileName = `${dasherizedName}-${suffix.toLowerCase()}`;
  const newFileName = `${dasherizedName}.${suffix.toLowerCase()}`;
  
  const oldFilePath = `${directory}/${oldFileName}.ts`;
  const newFilePath = `${directory}/${newFileName}.ts`;
  const oldSpecPath = `${directory}/${oldFileName}.spec.ts`;
  const newSpecPath = `${directory}/${newFileName}.spec.ts`;
  
  if (tree.exists(oldFilePath)) {
    const content = tree.read(oldFilePath);
    if (content) {
      tree.create(newFilePath, content);
      tree.delete(oldFilePath);
    }
  }
  
  if (tree.exists(oldSpecPath)) {
    let specContent = tree.read(oldSpecPath)?.toString('utf-8') || '';
    specContent = specContent.replace(
      new RegExp(`\\./${oldFileName}`, 'g'),
      `./${newFileName}`
    );
    tree.create(newSpecPath, specContent);
    tree.delete(oldSpecPath);
  }
  
  return tree;
}

/**
 * Build file path for generated schematic files
 */
export function buildFilePath(
  name: string,
  path: string | undefined,
  suffix: string,
  flat: boolean
): string {
  const nameParts = name.split('/');
  const baseName = nameParts[nameParts.length - 1];
  const pathPart = nameParts.slice(0, -1).join('/');
  
  const projectPath = path || 'src/app';
  const folderPath = pathPart 
    ? join(normalize(projectPath), normalize(pathPart)) 
    : normalize(projectPath);
  
  const fileName = flat 
    ? join(folderPath, `${strings.dasherize(baseName)}-${suffix}.ts`)
    : join(folderPath, strings.dasherize(baseName), `${strings.dasherize(baseName)}-${suffix}.ts`);
  
  return fileName;
}

/**
 * Extract base name from a path
 */
export function extractBaseName(name: string): string {
  const nameParts = name.split('/');
  return nameParts[nameParts.length - 1];
}

/**
 * Factory for simple schematics (component, service, directive)
 * that only need to force the 'type' option
 */
export function createSimpleSchematic(
  schematicName: string,
  typeSuffix: string
) {
  return function<T extends BaseSchematicOptions & { type?: string }>(options: T): Rule {
    return (tree: Tree, context: SchematicContext) => {
      const defaults = getWorkspaceDefaults(tree, schematicName, options.project);
      
      const modifiedOptions = { 
        ...defaults,
        ...options, 
        type: typeSuffix 
      };
      
      return chain([
        externalSchematic('@schematics/angular', schematicName, modifiedOptions)
      ])(tree, context);
    };
  };
}

/**
 * Factory for complex schematics (pipe, guard, interceptor, resolver)
 * that need file renaming and class suffix handling
 */
export function createComplexSchematic(
  schematicName: string,
  suffixName: string
) {
  return function<T extends BaseSchematicOptions>(options: T): Rule {
    return (tree: Tree, context: SchematicContext) => {
      const defaults = getWorkspaceDefaults(tree, schematicName, options.project);
      
      const mergedOptions = { 
        ...defaults,
        ...options
      };
      
      const baseName = extractBaseName(mergedOptions.name);
      const fileName = buildFilePath(
        mergedOptions.name,
        mergedOptions.path,
        schematicName,
        mergedOptions.flat || false
      );
      
      return chain([
        externalSchematic('@schematics/angular', schematicName, mergedOptions),
        ensureClassSuffix(fileName, baseName, suffixName),
        (tree: Tree) => removeDuplicateSuffix(tree, fileName, baseName, schematicName)
      ])(tree, context);
    };
  };
}
