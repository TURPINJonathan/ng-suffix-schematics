import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';

export function ngAdd(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const angularJsonPath = 'angular.json';
    
    if (!tree.exists(angularJsonPath)) {
      context.logger.error('Could not find angular.json. This schematic only works in an Angular workspace.');
      return tree;
    }

    const angularJsonContent = tree.read(angularJsonPath);
    if (!angularJsonContent) {
      context.logger.error('Could not read angular.json');
      return tree;
    }

    let angularJson: any;
    try {
      angularJson = JSON.parse(angularJsonContent.toString('utf-8'));
    } catch (e) {
      context.logger.error('angular.json contains invalid JSON. Please fix the file and try again.');
      context.logger.error(`Parsing error: ${(e as Error).message}`);
      return tree;
    }

    if (!angularJson.cli) {
      angularJson.cli = {};
    }

    if (!angularJson.cli.schematicCollections) {
      angularJson.cli.schematicCollections = [];
    }

    const packageName = '@turpinjonathan/ng-suffix-schematics';
    const angularSchematics = '@schematics/angular';
    
    // Remove our package if it exists (to re-add at the beginning)
    const existingIndex = angularJson.cli.schematicCollections.indexOf(packageName);
    if (existingIndex !== -1) {
      angularJson.cli.schematicCollections.splice(existingIndex, 1);
    }
    
    // Add our package at the beginning for priority
    angularJson.cli.schematicCollections.unshift(packageName);
    
    // Ensure @schematics/angular is present (add at end if missing)
    if (!angularJson.cli.schematicCollections.includes(angularSchematics)) {
      angularJson.cli.schematicCollections.push(angularSchematics);
    }

    if (existingIndex === -1) {
      context.logger.info(`✅ Added ${packageName} to schematic collections`);
    } else {
      context.logger.info(`✅ Updated ${packageName} position in schematic collections`);
    }
    
    tree.overwrite(angularJsonPath, JSON.stringify(angularJson, null, 2));

    context.logger.info('');
    context.logger.info('🎉 Configuration complete!');
    context.logger.info('');
    context.logger.info('You can now use Angular CLI commands:');
    context.logger.info('  ng g component my-component');
    context.logger.info('  ng g service my-service');
    context.logger.info('  ng g pipe my-pipe');
    context.logger.info('');

    return tree;
  };
}
