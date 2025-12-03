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

    // If the class doesn't already have the suffix, replace it
    const classRegex = new RegExp(`export\\s+class\\s+${className}([^A-Za-z]|$)`, 'g');
    if (classRegex.test(content) && !content.includes(`class ${expectedClassName}`)) {
      content = content.replace(
        classRegex,
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
  
  // Rename the main file
  if (tree.exists(oldFilePath)) {
    const content = tree.read(oldFilePath);
    if (content) {
      tree.create(newFilePath, content);
      tree.delete(oldFilePath);
    }
  }
  
  // Rename the spec file
  if (tree.exists(oldSpecPath)) {
    let specContent = tree.read(oldSpecPath)?.toString('utf-8') || '';
    // Update imports in the spec file
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
      const modifiedOptions = { ...options, type: typeSuffix };
      
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
      const baseName = extractBaseName(options.name);
      const fileName = buildFilePath(
        options.name,
        options.path,
        schematicName,
        options.flat || false
      );
      
      return chain([
        externalSchematic('@schematics/angular', schematicName, options),
        ensureClassSuffix(fileName, baseName, suffixName),
        (tree: Tree) => removeDuplicateSuffix(tree, fileName, baseName, schematicName)
      ])(tree, context);
    };
  };
}
